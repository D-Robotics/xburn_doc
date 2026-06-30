#!/usr/bin/env bash
# 检查 docs/ 下所有 .md/.mdx 文件名和目录名是否 lower-kebab-case
# 规则：全小写 + 连字符，无序号前缀，无中文，无大写，无下划线
set -euo pipefail

STATUS=0
# 仅扫 docs/，跳过 i18n/、build/、node_modules/
while IFS= read -r -d '' f; do
  base="$(basename "$f")"
  # lower-kebab-case：小写字母、数字、连字符、点（扩展名）；排除大写、下划线、中文、序号前缀
  if [[ ! "$base" =~ ^[a-z0-9]+(-[a-z0-9]+)*\.(md|mdx)$ ]]; then
    echo "❌ 文件名不合规: $f（要求 lower-kebab-case，无序号/中文/大写/下划线）"
    STATUS=1
  fi
done < <(find docs -type f \( -name '*.md' -o -name '*.mdx' \) -print0)

while IFS= read -r -d '' d; do
  base="$(basename "$d")"
  if [[ ! "$base" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo "❌ 目录名不合规: $d（要求 lower-kebab-case，无中文/大写/下划线）"
    STATUS=1
  fi
done < <(find docs -type d -print0)

exit $STATUS
