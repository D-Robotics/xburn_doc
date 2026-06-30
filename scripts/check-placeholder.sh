#!/usr/bin/env bash
# 检查 docs/ 下是否残留占位符/遗留标记
set -euo pipefail

# 占位符/遗留标记清单（TODO 含注释形态，全拦）
placeholders='📷|SCREENSHOT|IMAGE PENDING|TODO|FIXME|TBD|XXX|HACK|WIP|DRAFT'

found=0

# 1. 文本占位符/遗留标记
if grep -rEn "$placeholders" docs/ 2>/dev/null; then
  echo "❌ 发现占位符/遗留标记残留（📷/SCREENSHOT/IMAGE PENDING/TODO/FIXME/TBD/XXX/HACK/WIP/DRAFT），请替换为真实内容或删除"
  found=1
fi

# 2. 空图片 ![]() 或 ![alt]()（src 为空）
if grep -rEn '!\[[^]]*\]\(\s*\)' docs/ 2>/dev/null; then
  echo "❌ 发现空图片 ![]()，请补 src 或删除"
  found=1
fi

if [ "$found" -ne 0 ]; then exit 1; fi
echo "✅ 无占位符/遗留标记残留"
