---
title: "XBurn 概述"
description: "XBurn 烧录工具简介、适用型号（RDK S100/RDK S600/RDK X5/RDK X5 Module）与核心能力"
---

# XBurn 概述

XBurn 是 D-Robotics 面向 RDK 系列设备的板级烧录工具，运行在 PC 端（Windows/Linux/macOS），用于固件烧录与备份。适用于 RDK S100、RDK S600、RDK X5、RDK X5 Module 四个型号。它替代了早期的 D-Navigation，成为上述型号推荐的板级烧录工具。

核心能力：

| 能力 | 说明 | RDK S100 | RDK S600 | RDK X5 | RDK X5 Module |
|------|------|:------:|:------:|:------:|:------:|
| 全镜像烧录 | 把完整系统镜像写入设备的板载存储（eMMC / UFS / NAND）或 M.2 NVMe 扩展存储 | ✅ | ✅ | ✅ | ✅ |
| 指定区域烧录 | 只写入指定区域（如 miniboot） | ✅ | ✅ | ✅ | ✅ |
| 指定区域备份 | 导出并留存设备当前某个区域的镜像 | ✅ | ✅ | ❌ | ❌ |
| 指定分区镜像烧录 | 只写入某个分区的镜像 | ✅ | ✅ | ❌ | ❌ |

## 下一步

- [安装 XBurn](./install)
