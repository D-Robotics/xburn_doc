---
title: "Auto-reboot after flashing and boot check"
description: "Location, behavior, and usage recommendations for the two XBurn settings: auto-reboot after flashing and checking whether the device booted successfully"
---

# Auto-reboot after flashing and boot check

XBurn provides two settings under **Settings → Advanced**: **Auto-reboot after flashing** and **Check whether the device booted successfully**. Each is selected independently.

## Auto-reboot after flashing

- **When enabled**: after flashing completes, XBurn sends a fastboot command to reboot the device into normal boot mode.
- **When disabled**: after flashing completes, the device stays in flashing mode. You need to manually power it off, switch back to normal boot mode, and power it on again.

### Recommended to enable

For single-device full-image flashing, enabling it is recommended — it completes "flash → boot" in one step, with no manual switch operation.

### Recommended to disable

**Batch flashing**: because a finished device reboots immediately, which may affect the USB bus stability of devices still flashing, and makes it easy to lose track of "which device is done and which is still flashing". With it disabled, all devices finish flashing first, then you power them off and reboot together.

## Check whether the device booted successfully

After enabling **Auto-reboot after flashing**, the **Check whether the device booted successfully** option appears. When selected, XBurn checks whether the device has entered normal boot, saving you from manually powering on and inspecting the boot result.

:::info Boot-success check depends on an adb device on the board
This check relies on an adb device — if the device does not generate an adb device after the system boots (for example, boot hangs), or adbd has been actively disabled on the board, the check fails.
:::