import fs from "node:fs";
import path from "node:path";

const DEFAULT_LOCALE = "zh-Hans";
const MAX_PAGE_SNIPPET = 200;
const MAX_SECTION_TEXT = 800;

function normalizeText(value) {
  return String(value || "")
    .replace(/[​-‍﻿]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function relativePathFromUrl(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function deepestHeadingText(hierarchy) {
  for (const lvl of ["lvl6", "lvl5", "lvl4", "lvl3", "lvl2", "lvl1"]) {
    const text = normalizeText(hierarchy?.[lvl]);
    if (text) return text;
  }
  return "";
}

function headingText(record) {
  return normalizeText(record.hierarchy?.[record.type] || record.content);
}

function pageTitleOf(records, titleType) {
  const ordered = [
    titleType,
    ...["lvl0", "lvl1", "lvl2", "lvl3", "lvl4", "lvl5", "lvl6"].filter(
      (t) => t !== titleType,
    ),
  ];
  for (const type of ordered) {
    const hit = records.find((r) => r.type === type && headingText(r));
    if (hit) return headingText(hit);
  }
  return "";
}

function breadcrumbsOf(records, {titleType, pageTitle, breadcrumbsByUrl, url}) {
  const fromDom = breadcrumbsByUrl?.get(url);
  let crumbs;
  if (fromDom?.length) {
    crumbs = fromDom;
  } else if (titleType !== "lvl0") {
    const lvl0 = normalizeText(records[0]?.hierarchy?.lvl0);
    crumbs = lvl0 ? lvl0.split(" / ") : [];
  } else {
    crumbs = [];
  }

  const out = [];
  for (const crumb of crumbs.map(normalizeText)) {
    if (!crumb) continue;
    // 面包屑最后一项常与页面标题重复，MCP 的 b 只要祖先路径。
    if (crumb === pageTitle) continue;
    if (out[out.length - 1] === crumb) continue;
    out.push(crumb);
  }
  return out;
}

/**
 * 把 DocSearch records 映射成 easyops `search-index.json` 的 5 shard 格式，
 * 供 rdk-docs-mcp 读取（compactDocusaurusIndex 只读 t/s/u/b/h）。
 *
 * shard0 = 页面级 {t,u,b}；shard1 = 标题级 {t,u,h,p}；shard2 = 页内短摘要 {t,s,u,p}；
 * shard3 = 空；shard4 = 正文摘要 {t,s,u,h,p}。
 *
 * 只产出中文：MCP catalog 每站只指向一个 zh indexPath，不读 /en/。
 *
 * titleType 指页面标题落在哪一级：
 *   - "lvl1"：docusaurus 默认（lvl0 是侧边栏面包屑），magicbox / x5_cases 属此类；
 *   - "lvl0"：爬虫把 h1 记成 lvl0（stereo_camera），面包屑改从 DOM 取。
 */
export function buildEasyopsIndex(
  records,
  {titleType = "lvl1", breadcrumbsByUrl} = {},
) {
  const zh = records.filter(
    (r) => r.language === DEFAULT_LOCALE || r.language === "zh",
  );
  if (zh.length === 0) {
    // 宁可让 CI 红，也不要把空索引覆盖到线上（MCP 会直接搜不到）。
    throw new Error(
      `No ${DEFAULT_LOCALE} records; refusing to write an empty search-index.json.`,
    );
  }

  const byPage = new Map();
  for (const r of zh) {
    const key = r.url_without_anchor;
    if (!byPage.has(key)) byPage.set(key, []);
    byPage.get(key).push(r);
  }

  const pages = [];
  const headings = [];
  const pageSnippets = [];
  const contentSnippets = [];
  const seen = new Set();
  let id = 0;
  let pageSeq = 0;

  for (const [url, recs] of byPage) {
    pageSeq += 1;
    const u = relativePathFromUrl(url);
    const pageTitle = pageTitleOf(recs, titleType);
    const b = breadcrumbsOf(recs, {titleType, pageTitle, breadcrumbsByUrl, url});

    pages.push({i: ++id, t: pageTitle, u, b});

    let pageSnippet = "";
    for (const r of recs) {
      if (r.type === "content" && normalizeText(r.content)) {
        pageSnippet = normalizeText(r.content).slice(0, MAX_PAGE_SNIPPET);
        break;
      }
    }
    if (!pageSnippet) {
      const firstHeading = recs.find(
        (r) =>
          r.type?.startsWith("lvl") &&
          r.type !== titleType &&
          headingText(r),
      );
      pageSnippet = firstHeading ? headingText(firstHeading) : pageTitle;
    }
    if (pageSnippet) {
      pageSnippets.push({i: ++id, t: pageSnippet, s: pageTitle, u, p: pageSeq});
    }

    for (const r of recs) {
      if (!r.type?.startsWith("lvl") || r.type === titleType) continue;
      const text = headingText(r);
      if (!text || !r.anchor) continue;
      const key = `${url}|${r.anchor}|lvl|${text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      headings.push({i: ++id, t: text, u, h: `#${r.anchor}`, p: pageSeq});
    }

    // 正文按 section（锚点）合并成块：p/li/td 逐条成记录会让表格密集的页面
    // 被表格单元格碎片淹没，MCP 检索要的是「一段可读的上下文」。
    const sections = new Map();
    for (const r of recs) {
      if (r.type !== "content") continue;
      const text = normalizeText(r.content);
      if (!text) continue;
      const anchor = r.anchor || "";
      const key = `${url}|${anchor}`;
      if (!sections.has(key)) {
        sections.set(key, {anchor, heading: r.hierarchy, texts: new Set()});
      }
      sections.get(key).texts.add(text);
    }

    for (const [sectionKey, section] of sections) {
      if (seen.has(sectionKey)) continue;
      seen.add(sectionKey);
      const doc = {
        i: ++id,
        t: [...section.texts].join(" ").slice(0, MAX_SECTION_TEXT),
        u,
        p: pageSeq,
      };
      const source = deepestHeadingText(section.heading);
      if (source && source !== pageTitle) doc.s = source;
      if (section.anchor) doc.h = `#${section.anchor}`;
      contentSnippets.push(doc);
    }
  }

  return [
    {documents: pages},
    {documents: headings},
    {documents: pageSnippets},
    {documents: []},
    {documents: contentSnippets},
  ];
}

/** 写出 MCP 读取的本地索引文件；由 workflow 覆盖上传到 OSS 站点根目录。 */
export function writeEasyopsIndex(records, filePath, options = {}) {
  const shards = buildEasyopsIndex(records, options);
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, JSON.stringify(shards));
  console.log(
    `[algolia-index] Wrote search-index.json: pages=${shards[0].documents.length} ` +
      `headings=${shards[1].documents.length} snippets=${shards[4].documents.length} -> ${filePath}`,
  );
  return shards;
}
