---
title: "Linux 环境"
description: "Linux 下 adb/fastboot/dfu-util 安装与 udev 规则"
---

# Linux 环境

在 Linux 上使用 XBurn 前，需安装 adb/fastboot/dfu-util 依赖；Ubuntu 24.04 系统还需配置 udev 规则以授予 USB 设备访问权限。

## 安装依赖

```bash
sudo apt update
sudo apt install android-tools-adb android-tools-fastboot
sudo apt install dfu-util
```

Ubuntu 24.04 系统还需执行如下脚本：

```bash
#!/bin/bash

set -e

echo "[INFO] Updating APT package list..."
sudo apt update

echo "[INFO] Installing required packages..."
sudo apt install -y dfu-util libusb-1.0-0-dev

echo "[INFO] Writing udev rules to /etc/udev/rules.d/99-drobotics.rules..."

sudo tee /etc/udev/rules.d/99-drobotics.rules > /dev/null <<EOF
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6610", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6615", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6620", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6625", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", ATTR{idProduct}=="6631", MODE="0666"
SUBSYSTEM=="tty", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE="0666"
EOF

echo "[INFO] Reloading and triggering udev rules..."
sudo udevadm control --reload
sudo udevadm trigger

echo "[INFO] Setup complete. Please replug your devices or reboot if necessary."
```

或者依次执行如下命令：

```bash
# 更新 APT 源
sudo apt update

# 安装 DFU 工具和 libusb
sudo apt install -y dfu-util libusb-1.0-0-dev

# 设定设备接口权限
sudo tee /etc/udev/rules.d/99-drobotics.rules > /dev/null <<EOF
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6610", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6615", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6620", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6625", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", ATTR{idProduct}=="6631", MODE="0666"
SUBSYSTEM=="tty", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE="0666"
EOF

# 重载 udev
sudo udevadm control --reload
sudo udevadm trigger
```

## 验证设备识别

依赖安装完成后，按以下步骤验证串口与 Fastboot 是否就绪。

### 验证串口

1. 在终端执行 `sudo dmesg`，查看系统输出。若出现 `ch341-uart converter now attached to ttyUSB0` 之类信息，说明串口已被识别为 `ttyUSB*` 节点。

   ```text
   [   49.546445] usb 1-2: new full-speed USB device number 3 using xhci_hcd
   [   49.805929] usb 1-2: New USB device found, idVendor=1a86, idProduct=7523, bcdDevice=81.34
   [   49.805933] usb 1-2: New USB device strings: Mfr=0, Product=2, SerialNumber=0
   [   49.805935] usb 1-2: Product: USB Serial
   [   49.825085] usbcore: registered new interface driver usbserial_generic
   [   49.825303] usbserial: USB Serial support registered for generic
   [   49.836517] usbcore: registered new interface driver ch341
   [   49.836752] usbserial: USB Serial support registered for ch341-uart
   [   49.836807] ch341 1-2:1.0: ch341-uart converter detected
   [   49.843222] usb 1-2: ch341-uart converter now attached to ttyUSB0
   [   75.845194] usb 1-3: new full-speed USB device number 4 using xhci_hcd
   [   76.102371] usb 1-3: New USB device found, idVendor=1a86, idProduct=7523, bcdDevice=81.34
   [   76.102380] usb 1-3: New USB device strings: Mfr=0, Product=2, SerialNumber=0
   [   76.102383] usb 1-3: Product: USB Serial
   [   76.114322] ch341 1-3:1.0: ch341-uart converter detected
   [   76.120005] usb 1-3: ch341-uart converter now attached to ttyUSB1
   ```

2. 记录识别到的串口节点（如 `/dev/ttyUSB0`），供后续验证 fastboot 使用。

### 验证 Fastboot

1. （若已安装可跳过）安装 minicom：

   ```bash
   sudo apt install minicom
   ```

2. 在终端通过 minicom 打开串口，以 `/dev/ttyUSB0` 节点、921600 波特率为例：

   ```bash
   sudo minicom -D /dev/ttyUSB0 -b 921600
   ```

3. 设备重新上电，在 minicom 中按空格进入 U-Boot 命令行（以下日志以 S600 为例，其他型号日志类似）：

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

4. 在 U-Boot 命令行下输入 `fastboot 0` 进入 Fastboot 模式：

   ```text
   Hobot$ fastboot 0
   ```

5. 新建终端，执行 `fastboot devices` 搜索 Fastboot 设备；正常列出设备即代表驱动配置就绪。

   ```text
   $ fastboot devices
   0639410833906a03        fastboot
   ```



