---
title: "串口与驱动问题"
description: "Ubuntu 串口乱码、macOS 驱动残留等串口异常排查"
---

# 串口与驱动问题

串口问题是烧录失败排查的高频原因。串口用于观察设备启动日志，本篇按问题现象归集 Ubuntu、macOS 两个平台的常见串口异常。

:::info 环境准备在前
本篇默认已完成 [各平台环境准备](../environment/windows-setup) 安装好驱动与依赖（macOS 的 CH340N 驱动安装见 [macOS 环境](../environment/mac-setup#安装-ch340n-驱动)）。若未配置，先完成对应平台的环境准备，再按照本篇进行排查。
:::

## Ubuntu 串口乱码

**问题现象**：Ubuntu 系统笔记本连接设备后，串口出现乱码。

**原因分析**：Ubuntu 默认的 CH340N 驱动以 921600 波特率连接时存在兼容问题。

**解决方案**：安装官方 CH340N 驱动。

1. 下载官方串口驱动 [CH340N 驱动](https://www.wch.cn/downloads/CH341SER_LINUX_ZIP.html)。
2. 修改 `ch341_tty_driver->name = "ttyUSB";`。
3. 重新编译并安装驱动。

## macOS 驱动残留导致仍乱码

**问题现象**：已按 [macOS 环境 → 安装 CH340N 驱动](../environment/mac-setup#安装-ch340n-驱动) 安装官方驱动，但设备仍显示 `tty.usbserial*`、串口仍乱码。

**原因分析**：macOS 默认驱动 `CH34xVCPDriverApp` 未彻底卸载，与新版驱动冲突。

**解决方案**：

1. 卸载残留的 `CH34xVCPDriverApp`：将其移至废纸篓并清空。
2. 重启系统。
3. 重新安装 CH340N 驱动，步骤见 [macOS 环境 → 安装 CH340N 驱动](../environment/mac-setup#安装-ch340n-驱动)。

## 更多问题

若本篇未覆盖，可访问 [D-Robotics 开发者官方论坛](https://developer.d-robotics.cc/forum) 获得帮助。
