---
title: "Serial port and driver issues"
description: "Troubleshooting serial issues such as garbled output on Ubuntu and driver residue on macOS"
---

# Serial port and driver issues

Serial issues are a high-frequency cause of flashing failures. The serial port is used to observe the device boot log. This page collects common serial issues on Ubuntu and macOS by symptom.

:::info Environment setup first
This page assumes you have completed [environment setup for each platform](../environment/windows-setup) and installed the drivers and dependencies (for the CH340N driver on macOS, see [macOS environment](../environment/mac-setup#install-the-ch340n-driver)). If not configured yet, complete the environment setup for the relevant platform first, then troubleshoot as described here.
:::

## Ubuntu serial garbled output

**Symptom**: after an Ubuntu laptop connects to the device, the serial output is garbled.

**Cause**: the default Ubuntu CH340N driver has compatibility issues when connecting at the 921600 baud rate.

**Solution**: install the official CH340N driver.

1. Download the official serial driver [CH340N driver](https://www.wch.cn/downloads/CH341SER_LINUX_ZIP.html).
2. Modify `ch341_tty_driver->name = "ttyUSB";`.
3. Recompile and install the driver.

## macOS driver residue still causing garbled output

**Symptom**: the official driver has been installed per [macOS environment → Install the CH340N driver](../environment/mac-setup#install-the-ch340n-driver), but the device still shows `tty.usbserial*` and the serial output is still garbled.

**Cause**: the default macOS driver `CH34xVCPDriverApp` was not fully uninstalled and conflicts with the new driver.

**Solution**:

1. Uninstall the residual `CH34xVCPDriverApp`: move it to Trash and empty it.
2. Restart the system.
3. Reinstall the CH340N driver; see [macOS environment → Install the CH340N driver](../environment/mac-setup#install-the-ch340n-driver).

## More issues

If this page does not cover your case, visit the [D-Robotics developer forum](https://developer.d-robotics.cc/forum) for help.