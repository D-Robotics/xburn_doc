---
title: "存储介质与分区"
description: "eMMC / UFS / NAND / NVMe 四种介质与区域模型，miniboot_flash（位置因型号而异）"
---

# 存储介质与分区

使用 XBurn 烧录时，**存储介质** 字段须与目标存储类型一致。不同介质决定可选的烧录区域、镜像如何命名。本文讲介质分类与区域模型的概念；各型号的具体介质、区域清单、镜像路径见各产品烧录文档。

## 存储介质

下表「烧录」「备份」均指**指定区域**粒度（全镜像烧录所有介质均支持）：

| 介质 | 性质 | 对应型号 | 烧录 | 备份 |
| ---- | ---- | -------- | ---- | ---- |
| eMMC | 板载 | RDK S100 | ✅ | ✅ |
| UFS | 板载 | RDK S600 | ✅ | ✅ |
| NAND | 板载 | RDK X5 | ✅ | ❌ |
| NVMe | M.2 扩展 | RDK S600 等 | ✅ | ✅ |

除上述介质外，部分型号还有一块独立的基础启动区域 `miniboot_flash`，含 HSM/MCU0、BL31/U-Boot 等启动组件——它比系统镜像更底层，烧全镜像会一并覆盖它，也可单独烧录只更新 Bootloader 而不重刷整盘。其物理位置因型号而异：S100/S600 在 Norflash，RDK X5 在板载 NAND。

## 区域模型

烧录以「区域」为单位，存储介质决定可勾选的区域。烧录全镜像是写入完整镜像包，覆盖主介质的所有区域及 `miniboot_flash`；勾选「烧录指定区域」则只写入其中一个区域。各区域如下：

| 区域 | 粒度 | 固件内容 | 存储介质 |
| ---- | ---- | -------- | -------- |
| miniboot_flash | 基础启动 | Bootloader 组件（HSM/MCU0、BL31/U-Boot） | 因设备型号而异 |
| miniboot_emmc | 基础启动 | BL31/U-Boot 等 | eMMC |
| emmc | 整盘 | 完整系统镜像（含 miniboot_emmc） | eMMC |
| miniboot_ufs | 基础启动 | BL31/U-Boot 等 | UFS |
| ufs | 整盘 | 完整系统镜像（含 miniboot_ufs） | UFS |
| miniboot_nvme | 基础启动 | BL31/U-Boot 等 | NVMe |
| nvme | 整盘 | 完整系统镜像（含 miniboot_nvme） | NVMe |
| sdcard | 整盘 | 系统镜像 | 目前固定为 NAND |

:::info 能烧 NVMe ≠ 能从 NVMe 启动
NVMe 镜像可烧录，但设备能否从 NVMe 启动由启动拨码决定，各型号不同（如 S100 不可从 NVMe 启动、S600 可）。能否启动以各产品烧录文档为准。
:::

## 备份镜像命名

备份镜像在原镜像名后加 `_backup`（如 `miniboot_flash.img` → `miniboot_flash_backup.img`）。各型号可备份区域与镜像清单见各产品烧录文档。

:::warning 备份镜像再烧录
备份镜像再用于烧录时，去掉文件名中的 `_backup`，后缀与该区域烧录时一致：基础启动区域用 `.img`（`miniboot_flash_backup.img` → `miniboot_flash.img`），整盘区域用 `.simg`（`ufs_disk_backup.img` → `ufs_disk.simg`）。
:::
