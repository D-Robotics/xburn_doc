---
title: "macOS 环境"
description: "macOS 下 brew 依赖安装与串口控制台"
---

# macOS 环境

在 macOS 上使用 XBurn 前，需通过 Homebrew 安装 adb/fastboot/dfu-util 依赖，并安装 CH340N 官方串口驱动（921600 波特率必需）。

## 安装依赖

```bash
brew update
brew install android-platform-tools
brew install dfu-util
```

## 安装 CH340N 驱动

macOS 默认串口驱动不支持以 921600 波特率连接 CH340N，会出现乱码；macOS 自带的 `screen` 工具在 921600 下也有兼容问题。因此需安装官方 CH340N 驱动（解决驱动层），并改用 `minicom` 连接（解决工具层）。

1. 在 [CH340N 最新驱动发布页面](https://github.com/WCHSoftGroup/ch34xser_macos?tab=readme-ov-file) 下载压缩包，解压后用 pkg 包安装，按提示输入密码、完成授权。安装流程详见该页面 README。
2. 安装成功后，**重启电脑**。识别到 `tty.wch*` 表示驱动安装成功。若仍显示 `tty.usbserial*` 或串口乱码，见 [macOS 驱动残留导致仍乱码](../troubleshooting/serial-driver#macos-驱动残留导致仍乱码)。
3. 安装 minicom（macOS 自带的 `screen` 在 921600 下不可用，须用 minicom）：

   ```bash
   brew install minicom
   ```

## 验证设备识别

依赖与驱动安装完成后，按以下步骤验证串口与 Fastboot 是否就绪。

### 验证串口

1. 在终端执行 `ls /dev/tty.wch*`，查看是否出现串口设备节点（如 `/dev/tty.wchusbserial1220`）。出现即说明 CH340N 官方驱动已生效。

   ```text
   $ ls /dev/tty.wch*
   /dev/tty.wchusbserial1220  /dev/tty.wchusbserial1230
   ```

2. 记录识别到的串口节点，供后续验证 fastboot 使用。

### 验证 Fastboot

1. 在终端通过 minicom 打开串口，以 `/dev/tty.wchusbserial1220` 节点、921600 波特率为例：

   ```bash
   minicom -D /dev/tty.wchusbserial1220 -b 921600 -8
   ```

2. 设备重新上电，在 minicom 中按空格进入 U-Boot 命令行（以下日志以 S600 为例，其他型号日志类似）：

   ```text
   U-Boot 2022.04-00898-g5bfc55eaf9 (Jul 13 2026 - 14:07:19 +0800)

   Reset cause: unknown reset
   Model: D-Robotics S600 Module32 GiB
   EL Level:       EL2
   Core:  51 devices, 18 uclasses, devicetree: fit
   MMC:   
   SCSI:  ufs mphy trim value: 0x6c798780
   ufs eq: main:29 post:6
   ufs io ref clk: value: 0x34
   ufs_hobot ufs@0x33700000: [RX, TX]: gear=[4, 4], lane[2, 2], pwr[FAST MODE, FAST MODE], rate = 2

   Loading Environment from SCSI... *** Warning - bad CRC, using default environment

   NVME:  Device 0: Vendor: 0x1d97 Rev: Q7100    Prod: QKA9904104631P2237  
               Type: Hard Disk
               Capacity: 976762.3 M (2000409264 x 512)

   In:    serial
   Out:   serial
   Err:   seri
   Warning: gmac2 (eth0) using random MAC address - ea:e4:0b:15:c: gmac2
   system_slot: 0 adc_boardinfo: 5111110
   strap_pin = 0x20t = 0x1
   boot_block_device [3]
   ** File not found config.txt **
   flash boot
   success!
   Hit any key to stop autoboot:  0 
   Hobot$
   ```

3. 在 U-Boot 命令行下输入 `fastboot 0` 进入 Fastboot 模式：

   ```text
   Hobot$ fastboot 0
   ```

4. 新建终端，执行 `fastboot devices` 搜索 Fastboot 设备；正常列出设备即代表驱动配置就绪。
   
   ```text
   $ fastboot devices
   0639410833906a03        fastboot
   ```


