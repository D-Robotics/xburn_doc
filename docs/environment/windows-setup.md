---
title: "Windows 环境"
description: "Windows 下 USB 驱动与 CH341 串口驱动的安装与验证"
---

# Windows 环境

在 Windows 上使用 XBurn 前，需安装并验证两类驱动：USB Driver（ADB、Fastboot、DFU，用于烧录）与 USB to Serial Driver（CH341，用于串口控制台）。

## 安装驱动

1. 打开 XBurn，单击左侧的 **驱动**。
2. 在驱动列表中分别单击 **USB Driver (ADB, Fastboot, DFU)** 与 **USB to Serial Driver (CH341)** 右侧的 **安装**。
3. 安装完成后，操作栏显示 **已安装** 即表示安装成功。

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/driver-installed.png" alt="XBurn 驱动安装完成界面" style={{ width: '100%' }} />

## 验证驱动

两类驱动安装完成后，分别验证：

### 验证串口驱动

将设备连接到 PC，在设备管理器中确认串口板端口识别为 **USB-SERIAL CH340**，表示串口驱动安装成功。

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/verify-usb-driver.png" alt="设备管理器端口识别 USB-SERIAL CH340" style={{ width: '100%' }} />

### 验证 USB 驱动

通过 MobaXterm 串口控制台让设备进入 Fastboot 模式，设备管理器识别为 **Android Device** 即表示 USB 驱动安装成功。

1. 下载远程连接工具 [MobaXterm](https://mobaxterm.mobatek.net/download.html)。
2. 打开 MobaXterm，单击 **Session**，选择 **Serial**，进入串口配置。参数分 **Basic Serial settings** 与 **Advanced Serial settings** 两部分：

   **Basic Serial settings**（基础串口设置）：

   | 配置项 | 参数值 |
   | ------ | ------ |
   | Serial port | `COM3`（实际以 PC 识别到的 USB-SERIAL CH340 串口号为准） |
   | Speed (bps) | `921600`（RDK X5 为 `115200`） |

   **Advanced Serial settings**（高级串口设置）：

   | 配置项 | 参数值 | 说明 |
   | ------ | ------ | ---- |
   | Serial engine | `PuTTY` | 允许手动设置 COM 口 |
   | Data bits | `8` | 数据位 |
   | Stop bits | `1` | 停止位 |
   | Parity | `None` | 奇偶校验 |
   | Flow control | `None` | 流控 |

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/serial-driver.jpg" alt="MobaXterm 串口会话配置" style={{ width: '100%' }} />

3. 单击 **OK**，完成串口会话创建。
4. 设备上电，立刻长按空格键，进入 U-Boot 命令行模式。
5. 在 U-Boot 命令行输入 `fastboot 0`，让设备进入 Fastboot 模式。
6. 在设备管理器中确认显示 **Android Device**，表示 USB 驱动安装成功。

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/android-device.png" alt="显示 Android Device" style={{ width: '100%' }} />

   :::note 驱动未识别
   若设备管理器提示存在 **USB download gadget** 的未知设备，说明 USB 驱动未成功安装，回到 [安装驱动](#安装驱动) 重装或单击 **扫描驱动** 复核状态。

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/usb-download-gadget.png" alt="显示 USB download gadget 未知设备" style={{ width: '100%' }} />
   :::
