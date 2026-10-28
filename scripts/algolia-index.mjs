#!/usr/bin/env node
/**
 * Crawl the published Docusaurus site and upload DocSearch v3–compatible records.
 *
 * Requires: ALGOLIA_ADMIN_API_KEY (env or .env)
 * Optional: ALGOLIA_APP_ID, ALGOLIA_INDEX_NAME, ALGOLIA_SITE_URL, ALGOLIA_SEARCH_API_KEY
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import { config as loadDotenv } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

loadDotenv({ path: path.join(rootDir, ".env") });
loadDotenv({ path: path.join(rootDir, ".env.local") });

const APP_ID = (process.env.ALGOLIA_APP_ID || "1VU781LYTV").trim();
const INDEX_NAME = (
  process.env.ALGOLIA_INDEX_NAME || "xburn_doc"
).trim();
const SITE_URL = normalizeSiteUrl(
  process.env.ALGOLIA_SITE_URL ||
    "https://developer.d-robotics.cc/xburn_doc/",
);
const ADMIN_API_KEY = (process.env.ALGOLIA_ADMIN_API_KEY || "").trim();
const SEARCH_API_KEY = (
  process.env.ALGOLIA_SEARCH_API_KEY ||
  "fb65c6e54a52ce6fba0645bd2630e79b"
).trim();

const MAX_PAGES = Number(process.env.ALGOLIA_MAX_PAGES || 500);
const FETCH_CONCURRENCY = Number(process.env.ALGOLIA_FETCH_CONCURRENCY || 4);
const BATCH_SIZE = 1000;

const LEVEL_WEIGHT = {
  lvl0: 100,
  lvl1: 90,
  lvl2: 70,
  lvl3: 50,
  lvl4: 40,
  lvl5: 30,
  lvl6: 20,
  content: 0,
};

const INDEX_SETTINGS = {
  attributesForFaceting: [
    "type",
    "lang",
    "language",
    "version",
    "docusaurus_tag",
  ],
  attributesToRetrieve: [
    "hierarchy",
    "content",
    "anchor",
    "url",
    "url_without_anchor",
    "type",
  ],
  attributesToHighlight: ["hierarchy", "content"],
  attributesToSnippet: ["content:10"],
  camelCaseAttributes: ["hierarchy", "content"],
  searchableAttributes: [
    "unordered(hierarchy.lvl0)",
    "unordered(hierarchy.lvl1)",
    "unordered(hierarchy.lvl2)",
    "unordered(hierarchy.lvl3)",
    "unordered(hierarchy.lvl4)",
    "unordered(hierarchy.lvl5)",
    "unordered(hierarchy.lvl6)",
    "content",
  ],
  distinct: true,
  attributeForDistinct: "url",
  customRanking: [
    "desc(weight.pageRank)",
    "desc(weight.level)",
    "asc(weight.position)",
  ],
  ranking: [
    "words",
    "filters",
    "typo",
    "attribute",
    "proximity",
    "exact",
    "custom",
  ],
  highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
  highlightPostTag: "</span>",
  minWordSizefor1Typo: 3,
  minWordSizefor2Typos: 7,
  allowTyposOnNumericTokens: false,
  minProximity: 1,
  ignorePlurals: true,
  advancedSyntax: true,
  attributeCriteriaComputedByMinProximity: true,
  removeWordsIfNoResults: "allOptional",
  separatorsToIndex: "_",
};

function normalizeSiteUrl(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    throw new Error("ALGOLIA_SITE_URL is empty");
  }
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function assertConfig() {
  if (!ADMIN_API_KEY) {
    console.error(
      "[algolia-index] Missing ALGOLIA_ADMIN_API_KEY.\n" +
        "Set it in the environment or copy .env.example -> .env",
    );
    process.exit(1);
  }
  if (!APP_ID || !INDEX_NAME || !SITE_URL) {
    console.error("[algolia-index] APP_ID / INDEX_NAME / SITE_URL required");
    process.exit(1);
  }
}

function algoliaHost() {
  return `https://${APP_ID}-dsn.algolia.net`;
}

async function algoliaRequest(pathname, { method = "GET", body, apiKey } = {}) {
  const key = apiKey || ADMIN_API_KEY;
  const res = await fetch(`${algoliaHost()}${pathname}`, {
    method,
    headers: {
      "X-Algolia-Application-Id": APP_ID,
      "X-Algolia-API-Key": key,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      text ||
      `${res.status} ${res.statusText}`;
    const err = new Error(`Algolia ${method} ${pathname}: ${msg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function cleanText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absolutize(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function normalizePageUrl(href) {
  if (!href) return null;
  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  url.hash = "";
  url.search = "";
  let pathname = url.pathname.replace(/\/index\.html$/i, "/");
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  url.pathname = pathname || "/";
  return url.href;
}

function isIndexablePageUrl(href) {
  const normalized = normalizePageUrl(href);
  if (!normalized) return false;
  const url = new URL(normalized);
  const site = new URL(SITE_URL);
  if (url.origin !== site.origin) return false;

  const rootPath = site.pathname.replace(/\/$/, "") || "";
  if (rootPath) {
    const underSite =
      url.pathname === rootPath || url.pathname.startsWith(`${rootPath}/`);
    if (!underSite) return false;
  }

  if (
    /\.(css|js|json|xml|txt|map|png|jpe?g|gif|svg|webp|ico|pdf|zip|gz|woff2?|ttf|eot)$/i.test(
      url.pathname,
    )
  ) {
    return false;
  }
  if (/\/(assets|img|static|_next)\//i.test(url.pathname)) return false;
  if (/\/search\/?$/i.test(url.pathname)) return false;
  return true;
}

function metaContent($, name) {
  return cleanText($(`.meta[name="${name}"], meta[name="${name}"]`).attr("content"));
}

function extractLvl0($) {
  const navbarTitle = cleanText($(".navbar__item.navbar__link--active").first().text());
  const crumbs = $(".breadcrumbs__link")
    .toArray()
    .map((el) => cleanText($(el).text()))
    .filter(Boolean);
  return [navbarTitle, ...crumbs].filter(Boolean).join(" / ") || "Documentation";
}

function headingLevel(tagName) {
  const m = /^h([1-6])$/i.exec(tagName || "");
  return m ? Number(m[1]) : null;
}

function getAnchor($el) {
  const id = cleanText($el.attr("id"));
  if (id) return id;
  const childId = cleanText($el.find("[id]").first().attr("id"));
  return childId || "";
}

function makeObjectId(parts) {
  return createHash("sha1").update(parts.join("\0")).digest("hex");
}

function buildRecordsFromHtml(pageUrl, html) {
  const $ = cheerio.load(html);
  $(".hash-link, .theme-edit-this-page, .pagination-nav, nav.pagination-nav").remove();

  const language =
    metaContent($, "docsearch:language") ||
    cleanText($("html").attr("lang")) ||
    "zh-Hans";
  const version = metaContent($, "docsearch:version") || "current";
  const docusaurusTag =
    metaContent($, "docsearch:docusaurus_tag") || "docs-default-current";
  const lang = language;

  const article = $("article").first().length
    ? $("article").first()
    : $(".theme-doc-markdown").first().length
      ? $(".theme-doc-markdown").first()
      : $("main").first();

  if (!article.length) {
    return [];
  }

  const urlWithoutAnchor = normalizePageUrl(pageUrl);
  const lvl0 = extractLvl0($);
  const hierarchy = {
    lvl0,
    lvl1: null,
    lvl2: null,
    lvl3: null,
    lvl4: null,
    lvl5: null,
    lvl6: null,
  };

  /** @type {any[]} */
  const records = [];
  let position = 0;
  let currentAnchor = "";
  let pendingContent = [];

  const flushContent = () => {
    const content = cleanText(pendingContent.join(" "));
    pendingContent = [];
    if (!content) return;
    position += 1;
    const type = "content";
    const url = currentAnchor
      ? `${urlWithoutAnchor}#${currentAnchor}`
      : urlWithoutAnchor;
    records.push({
      objectID: makeObjectId([url, type, content, String(position)]),
      hierarchy: { ...hierarchy },
      content,
      type,
      url,
      url_without_anchor: urlWithoutAnchor,
      anchor: currentAnchor || null,
      language,
      lang,
      version,
      docusaurus_tag: docusaurusTag,
      weight: {
        pageRank: 0,
        level: LEVEL_WEIGHT.content,
        position,
      },
    });
  };

  const nodes = article
    .find("h1, h2, h3, h4, h5, h6, p, li, td")
    .toArray()
    .filter((el) => {
      // Prefer direct semantic blocks; skip nested li/p already covered as parent text? keep all for coverage
      const $el = $(el);
      if ($el.closest("nav, .table-of-contents, .theme-doc-toc-desktop, .theme-doc-toc-mobile").length) {
        return false;
      }
      return true;
    });

  for (const el of nodes) {
    const $el = $(el);
    const tag = (el.tagName || el.name || "").toLowerCase();
    const level = headingLevel(tag);

    if (level) {
      flushContent();
      const text = cleanText($el.text());
      if (!text) continue;
      const anchor = getAnchor($el);
      currentAnchor = anchor;

      for (let i = level; i <= 6; i += 1) {
        hierarchy[`lvl${i}`] = null;
      }
      hierarchy[`lvl${level}`] = text;

      position += 1;
      const type = `lvl${level}`;
      const url = anchor ? `${urlWithoutAnchor}#${anchor}` : urlWithoutAnchor;
      records.push({
        objectID: makeObjectId([url, type, text, String(position)]),
        hierarchy: { ...hierarchy },
        content: null,
        type,
        url,
        url_without_anchor: urlWithoutAnchor,
        anchor: anchor || null,
        language,
        lang,
        version,
        docusaurus_tag: docusaurusTag,
        weight: {
          pageRank: 0,
          level: LEVEL_WEIGHT[type] ?? 0,
          position,
        },
      });
      continue;
    }

    // Skip first-column table cells used as labels when a heading-like td is preferred as lvl5 in crawler;
    // keep both columns as content for searchability.
    const text = cleanText($el.text());
    if (!text) continue;
    // Avoid duplicating heading text captured inside nested anchors already handled
    if ($el.parents("h1, h2, h3, h4, h5, h6").length) continue;
    pendingContent.push(text);
  }

  flushContent();
  return records;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "xburn_doc-algolia-indexer/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    throw new Error(`Non-HTML content-type (${contentType}) for ${url}`);
  }
  return {
    finalUrl: normalizePageUrl(res.url) || normalizePageUrl(url),
    html: await res.text(),
  };
}

function extractLinks(pageUrl, html) {
  const $ = cheerio.load(html);
  const links = new Set();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    const abs = absolutize(pageUrl, href);
    if (abs && isIndexablePageUrl(abs)) {
      links.add(normalizePageUrl(abs));
    }
  });
  return [...links];
}

async function crawlSite() {
  const siteRoot = normalizePageUrl(SITE_URL);
  const enRoot = normalizePageUrl(new URL("en/", SITE_URL).href);
  const seed = [siteRoot, enRoot, normalizePageUrl(new URL("en/introduction", SITE_URL).href)].filter(Boolean);

  const queue = [...new Set(seed)];
  const seen = new Set();
  /** @type {{ url: string, html: string }[]} */
  const pages = [];

  console.log(`[algolia-index] Crawling ${SITE_URL}`);

  while (queue.length && pages.length < MAX_PAGES) {
    const batch = [];
    while (queue.length && batch.length < FETCH_CONCURRENCY) {
      const next = queue.shift();
      if (!next || seen.has(next)) continue;
      seen.add(next);
      batch.push(next);
    }
    if (!batch.length) break;

    const results = await Promise.allSettled(
      batch.map(async (url) => {
        const { finalUrl, html } = await fetchHtml(url);
        return { requested: url, finalUrl, html };
      }),
    );

    for (const result of results) {
      if (result.status !== "fulfilled") {
        console.warn(`[algolia-index] Skip failed page: ${result.reason?.message || result.reason}`);
        continue;
      }
      const { finalUrl, html } = result.value;
      if (!finalUrl || !isIndexablePageUrl(finalUrl)) continue;
      if (pages.some((p) => p.url === finalUrl)) continue;
      pages.push({ url: finalUrl, html });
      for (const link of extractLinks(finalUrl, html)) {
        if (!seen.has(link) && !queue.includes(link)) {
          queue.push(link);
        }
      }
      process.stdout.write(`\r[algolia-index] pages=${pages.length} queued=${queue.length}   `);
    }
  }

  process.stdout.write("\n");
  console.log(`[algolia-index] Collected ${pages.length} HTML pages`);
  return pages;
}

async function ensureIndexSettings() {
  console.log(`[algolia-index] Applying DocSearch settings to ${INDEX_NAME}`);
  await algoliaRequest(`/1/indexes/${encodeURIComponent(INDEX_NAME)}/settings`, {
    method: "PUT",
    body: INDEX_SETTINGS,
  });
}

async function clearIndex() {
  console.log(`[algolia-index] Clearing index ${INDEX_NAME}`);
  await algoliaRequest(`/1/indexes/${encodeURIComponent(INDEX_NAME)}/clear`, {
    method: "POST",
    body: {},
  });
}

async function uploadRecords(records) {
  console.log(`[algolia-index] Uploading ${records.length} records`);
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    await algoliaRequest(`/1/indexes/${encodeURIComponent(INDEX_NAME)}/batch`, {
      method: "POST",
      body: {
        requests: chunk.map((record) => ({
          action: "addObject",
          body: record,
        })),
      },
    });
    console.log(
      `[algolia-index] Uploaded ${Math.min(i + chunk.length, records.length)}/${records.length}`,
    );
  }
}

async function verifySearch() {
  const query = "RDK 音频套件";
  console.log(`[algolia-index] Verifying search query="${query}"`);
  const data = await algoliaRequest(
    `/1/indexes/${encodeURIComponent(INDEX_NAME)}/query`,
    {
      method: "POST",
      apiKey: SEARCH_API_KEY,
      body: {
        query,
        hitsPerPage: 5,
        facetFilters: [
          "language:zh-Hans",
          "docusaurus_tag:docs-default-current",
        ],
      },
    },
  );
  const hits = data.hits || [];
  console.log(`[algolia-index] hits=${hits.length} nbHits=${data.nbHits ?? "?"}`);
  for (const hit of hits.slice(0, 3)) {
    console.log(
      `  - ${hit.type} | ${hit.hierarchy?.lvl1 || hit.hierarchy?.lvl0 || ""} | ${hit.url}`,
    );
  }
  if (!hits.length) {
    console.warn(
      "[algolia-index] Warning: contextual query returned 0 hits. Check facets / language values.",
    );
  }
}

async function main() {
  assertConfig();
  if (!existsSync(path.join(rootDir, "package.json"))) {
    throw new Error("Run from repository root");
  }

  console.log(`[algolia-index] appId=${APP_ID}`);
  console.log(`[algolia-index] indexName=${INDEX_NAME}`);
  console.log(`[algolia-index] siteUrl=${SITE_URL}`);

  const pages = await crawlSite();
  if (!pages.length) {
    throw new Error("No pages crawled; aborting without clearing index");
  }

  /** @type {any[]} */
  const records = [];
  for (const page of pages) {
    const pageRecords = buildRecordsFromHtml(page.url, page.html);
    records.push(...pageRecords);
  }
  console.log(`[algolia-index] Built ${records.length} DocSearch records`);
  if (!records.length) {
    throw new Error("No records extracted; aborting without clearing index");
  }

  await ensureIndexSettings();
  await clearIndex();
  await uploadRecords(records);
  // Small delay helps Search API see fresh objects on free tier
  await new Promise((r) => setTimeout(r, 2000));
  await verifySearch();
  console.log("[algolia-index] Done");
}

main().catch((err) => {
  console.error("[algolia-index] Failed:", err.message || err);
  if (err.status === 403) {
    console.error(
      "Hint: 403 often means proxy/network blocks Algolia write API, or the Admin API Key is wrong.",
    );
  }
  process.exit(1);
});
