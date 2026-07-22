---
title: "Boot issues"
description: "Common causes and troubleshooting for boot failure after flashing"
---

# Boot issues

After flashing is complete and the device is powered back on, if there is no display output for a long time or boot fails, troubleshoot as described here. Boot issues are usually related to the selected flashing mode, boot-disk configuration, or image integrity.

:::info Check the serial port first
Troubleshooting boot issues relies heavily on the serial log. If you have not set up a serial port, first configure a serial console per [environment setup for each platform](../environment/windows-setup), then proceed with this page.
:::

## No display output for a long time

**Symptom**: no display output for a long time after the device is powered on (over 2 minutes).

**Cause**: boot may be abnormal. Use the serial log to determine whether the device boots normally and where it gets stuck.

**Solution**:

1. Connect the device with a serial cable and open the serial console (baud rate `921600`, `115200` for RDK X5; see each platform's environment setup).
2. Power it back on and check whether the serial log shows boot output.
3. If the serial output is completely empty, check that the power and boot-disk switch are correct.
4. If the serial output appears but stops at some stage, determine the cause from the log (for example, stuck at U-Boot, stuck at kernel loading).

## Wrong boot-disk selection

**Symptom**: after flashing completes, the device cannot boot, and the serial log reports that the boot media cannot be found.

**Cause**: on some models, the boot disk must be selected via a switch. A wrong switch position means the device does not boot from the flashed media.

**Solution**: taking the RDK S100 as an example, set the SW3 switch to boot from the onboard eMMC (booting from the M.2 NVMe SSD is not supported). For the boot-disk selection method per model, see the corresponding product's flashing docs and hardware introduction.

## Flashing mode not exited

**Symptom**: after flashing completes, the device cannot boot normally and stays in flashing mode.

**Cause**: DFU flashing requires manually setting the device into DFU mode. After flashing completes, you must exit DFU mode to return to normal boot mode.

**Solution**: after DFU flashing completes, power off, switch the flashing switch back to the normal boot position, and power on again. For the specific switch operations, see each product's flashing docs.

## Backup image flashing failure

**Symptom**: flashing fails when reusing a backed-up image.

**Cause**: the backup image file name has the `_backup` suffix and does not match the original image name required when flashing the specified region.

**Solution**: remove `_backup` from the backup image file name and change it back to the original image name used for region flashing (for example, `miniboot_flash_backup.img` → `miniboot_flash.img`).

:::warning Whole-disk backup takes time
Data backup takes a long time. Wait patiently for it to finish; powering off midway produces an incomplete backup image.
:::