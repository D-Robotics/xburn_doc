---
title: "安装 XBurn"
description: "XBurn 工具的下载与安装（Windows/Linux/macOS）"
---

# 安装 XBurn

## 下载

前往 [XBurn 下载页](https://archive.d-robotics.cc/downloads/software_tools/download_tools/)，根据所用操作系统选择对应安装包。以 `xburn-gui_1.2.1` 为例：

| 操作系统 | 安装包 | 安装方法 |
| -------- | ------ | -------- |
| Windows | `xburn-gui_1.2.1_x64-setup.exe` | 双击安装包，按向导完成 |
| Linux | `xburn-gui_1.2.1_amd64.deb` | 1. 执行 `sudo dpkg -i xburn-gui_1.2.1_amd64.deb`<br />2. 执行 `sudo xburn-gui`，或点应用菜单 XBurn 图标（弹密码框）输密码打开 |
| macOS | `xburn-gui_1.2.1_universal.dmg` | 拖入 Applications |

## 下一步

工具安装完成后，按以下步骤准备烧录：

**配置运行环境**（因系统而异）

- [Windows 环境](./environment/windows-setup)
- [Linux 环境](./environment/linux-setup)
- [macOS 环境](./environment/mac-setup)

**烧录系统镜像**（各产品烧录文档）

- [RDK S100](https://developer.d-robotics.cc/rdk_s_doc/Quick_start/install_os/rdk_s100/burn) / [RDK S600](https://developer.d-robotics.cc/rdk_s_doc/Quick_start/install_os/rdk_s600/burn)
- [RDK X5](https://developer.d-robotics.cc/rdk_x_doc/Quick_start/install_os/rdk_x5/burn) / [RDK X5 Module](https://developer.d-robotics.cc/rdk_x_doc/Quick_start/install_os/rdk_x5_module/burn)
