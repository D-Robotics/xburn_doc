---
title: "Windows environment"
description: "Installing and verifying the USB driver and CH341 serial driver on Windows"
---

# Windows environment

Before using XBurn on Windows, you need to install and verify two types of drivers: the USB Driver (ADB, Fastboot, DFU, for flashing) and the USB to Serial Driver (CH341, for the serial console).

## Install drivers

1. Open XBurn and click **Driver** on the left.
2. In the driver list, click **Install** to the right of **USB Driver (ADB, Fastboot, DFU)** and **USB to Serial Driver (CH341)**.
3. After installation, an **Installed** status in the action column means success.

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/driver-installed.png" alt="XBurn driver installation complete" style={{ width: '100%' }} />

## Verify drivers

After both drivers are installed, verify each:

### Verify the serial driver

Connect the device to the PC and confirm in Device Manager that the serial port is recognized as **USB-SERIAL CH340**, which means the serial driver is installed successfully.

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/verify-usb-driver.png" alt="Device Manager recognizes USB-SERIAL CH340" style={{ width: '100%' }} />

### Verify the USB driver

Use the MobaXterm serial console to put the device into Fastboot mode. When Device Manager recognizes it as **Android Device**, the USB driver is installed successfully.

1. Download the remote connection tool [MobaXterm](https://mobaxterm.mobatek.net/download.html).
2. Open MobaXterm, click **Session**, select **Serial**, and enter the serial configuration. The parameters are split into **Basic Serial settings** and **Advanced Serial settings**:

   **Basic Serial settings**:

   | Setting | Value |
   | ------- | ----- |
   | Serial port | `COM3` (use the actual USB-SERIAL CH340 port number detected by the PC) |
   | Speed (bps) | `921600` (`115200` for RDK X5) |

   **Advanced Serial settings**:

   | Setting | Value | Description |
   | ------- | ----- | ----------- |
   | Serial engine | `PuTTY` | Allows manual COM port selection |
   | Data bits | `8` | Data bits |
   | Stop bits | `1` | Stop bits |
   | Parity | `None` | Parity |
   | Flow control | `None` | Flow control |

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/serial-driver.jpg" alt="MobaXterm serial session configuration" style={{ width: '100%' }} />

3. Click **OK** to create the serial session.
4. Power on the device and immediately hold the space bar to enter the U-Boot command line.
5. In the U-Boot command line, enter `fastboot 0` to put the device into Fastboot mode.
6. In Device Manager, confirm that **Android Device** appears, which means the USB driver is installed successfully.

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/android-device.png" alt="Android Device shown" style={{ width: '100%' }} />

   :::note Driver not recognized
   If Device Manager shows an unknown device for **USB download gadget**, the USB driver was not installed successfully. Go back to [Install drivers](#install-drivers) to reinstall, or click **Scan driver** to recheck the status.

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/usb-download-gadget.png" alt="USB download gadget unknown device shown" style={{ width: '100%' }} />
   :::