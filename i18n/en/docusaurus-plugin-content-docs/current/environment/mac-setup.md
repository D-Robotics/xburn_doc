---
title: "macOS environment"
description: "Installing brew dependencies and the serial console on macOS"
---

# macOS environment

Before using XBurn on macOS, you need to install the adb/fastboot/dfu-util dependencies via Homebrew, and install the official CH340N serial driver (required for the 921600 baud rate).

## Install dependencies

```bash
brew update
brew install android-platform-tools
brew install dfu-util
```

## Install the CH340N driver

The default macOS serial driver does not support connecting to the CH340N at a 921600 baud rate and produces garbled output; the macOS built-in `screen` tool also has compatibility issues at 921600. Therefore, install the official CH340N driver (fixes the driver layer), and switch to `minicom` for the connection (fixes the tool layer).

1. Download the package from the [latest CH340N driver release page](https://github.com/WCHSoftGroup/ch34xser_macos?tab=readme-ov-file), extract it, and install the pkg package. Enter your password when prompted to complete authorization. See that page's README for the installation procedure.
2. After a successful installation, **restart the computer**. A `tty.wch*` device means the driver is installed successfully. If it still shows `tty.usbserial*` or the serial output is still garbled, see [macOS driver residue still causing garbled output](../troubleshooting/serial-driver#macos-driver-residue-still-causing-garbled-output).
3. Install minicom (the macOS built-in `screen` does not work at 921600; minicom is required):

   ```bash
   brew install minicom
   ```

## Verify device recognition

After the dependencies and driver are installed, follow these steps to verify that the serial port and Fastboot are ready.

### Verify the serial port

1. Run `ls /dev/tty.wch*` in a terminal to check whether a serial device node appears (for example, `/dev/tty.wchusbserial1220`). If it appears, the official CH340N driver is in effect.

   ```text
   $ ls /dev/tty.wch*
   /dev/tty.wchusbserial1220  /dev/tty.wchusbserial1230
   ```

2. Note the recognized serial node for the Fastboot verification below.

### Verify Fastboot

1. In a terminal, open the serial port with minicom. Using the `/dev/tty.wchusbserial1220` node and a baud rate of 921600 as an example:

   ```bash
   minicom -D /dev/tty.wchusbserial1220 -b 921600 -8
   ```

2. Power the device back on, and in minicom press the space bar to enter the U-Boot command line (the log below uses the S600 as an example; other models are similar):

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

3. In the U-Boot command line, enter `fastboot 0` to enter Fastboot mode:

   ```text
   Hobot$ fastboot 0
   ```

4. Open a new terminal and run `fastboot devices` to search for Fastboot devices. A listed device means the driver is configured correctly.

   ```text
   $ fastboot devices
   0639410833906a03        fastboot
   ```