---
title: "Linux environment"
description: "Installing adb/fastboot/dfu-util and configuring udev rules on Linux"
---

# Linux environment

Before using XBurn on Linux, you need to install the adb/fastboot/dfu-util dependencies. On Ubuntu 24.04, you also need to configure udev rules to grant access to USB devices.

## Install dependencies

```bash
sudo apt update
sudo apt install android-tools-adb android-tools-fastboot
sudo apt install dfu-util
```

On Ubuntu 24.04, also run the following script:

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

Alternatively, run these commands one by one:

```bash
# Update APT sources
sudo apt update

# Install DFU tools and libusb
sudo apt install -y dfu-util libusb-1.0-0-dev

# Set device interface permissions
sudo tee /etc/udev/rules.d/99-drobotics.rules > /dev/null <<EOF
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6610", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6615", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6620", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="3652", ATTR{idProduct}=="6625", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", ATTR{idProduct}=="6631", MODE="0666"
SUBSYSTEM=="tty", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE="0666"
EOF

# Reload udev
sudo udevadm control --reload
sudo udevadm trigger
```

## Verify device recognition

After the dependencies are installed, follow these steps to verify that the serial port and Fastboot are ready.

### Verify the serial port

1. Run `sudo dmesg` in a terminal to view the system output. If a message like `ch341-uart converter now attached to ttyUSB0` appears, the serial port has been recognized as a `ttyUSB*` node.

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

2. Note the recognized serial node (such as `/dev/ttyUSB0`) for the Fastboot verification below.

### Verify Fastboot

1. (Skip if already installed) Install minicom:

   ```bash
   sudo apt install minicom
   ```

2. In a terminal, open the serial port with minicom. Using the `/dev/ttyUSB0` node and a baud rate of 921600 as an example:

   ```bash
   sudo minicom -D /dev/ttyUSB0 -b 921600
   ```

3. Power the device back on, and in minicom press the space bar to enter the U-Boot command line (the log below uses the S600 as an example; other models are similar):

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

4. In the U-Boot command line, enter `fastboot 0` to enter Fastboot mode:

   ```text
   Hobot$ fastboot 0
   ```

5. Open a new terminal and run `fastboot devices` to search for Fastboot devices. A listed device means the driver is configured correctly.

   ```text
   $ fastboot devices
   0639410833906a03        fastboot
   ```