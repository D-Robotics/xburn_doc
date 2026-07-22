---
title: "Storage media and partitions"
description: "The four media types (eMMC / UFS / NAND / NVMe) and the region model; miniboot_flash location varies by model"
---

# Storage media and partitions

When flashing with XBurn, the **Storage media** field must match the target storage type. Different media determine the available flashing regions and how images are named. This page explains the concepts of media classification and the region model; for the specific media, region lists, and image paths per model, see each product's flashing docs.

## Storage media

In the table below, "flash" and "backup" both refer to the **region** granularity (full-image flashing is supported for all media):

| Media | Nature | Models | Flash | Backup |
| ----- | ------ | ------ |:-----:|:------:|
| eMMC | Onboard | RDK S100 | ✅ | ✅ |
| UFS | Onboard | RDK S600 | ✅ | ✅ |
| NAND | Onboard | RDK X5 | ✅ | ❌ |
| NVMe | M.2 expansion | RDK S600, etc. | ✅ | ✅ |

In addition to the media above, some models have a separate base boot region, `miniboot_flash`, containing boot components such as HSM/MCU0 and BL31/U-Boot. It is more low-level than the system image: full-image flashing overwrites it as well, and you can also flash it alone to update only the Bootloader without reflashing the entire disk. Its physical location varies by model: on the S100/S600 it is on the Norflash, and on the RDK X5 it is on the onboard NAND.

## Region model

Flashing is performed in units of "regions", and the storage media determines which regions can be selected. Full-image flashing writes a complete image package covering all regions of the main media and `miniboot_flash`; selecting "region flashing" writes only one of the regions. The regions are as follows:

| Region | Granularity | Firmware content | Storage media |
| ------ | ----------- | ---------------- | ------------- |
| miniboot_flash | Base boot | Bootloader components (HSM/MCU0, BL31/U-Boot) | Varies by model |
| miniboot_emmc | Base boot | BL31/U-Boot, etc. | eMMC |
| emmc | Whole disk | Complete system image (includes miniboot_emmc) | eMMC |
| miniboot_ufs | Base boot | BL31/U-Boot, etc. | UFS |
| ufs | Whole disk | Complete system image (includes miniboot_ufs) | UFS |
| miniboot_nvme | Base boot | BL31/U-Boot, etc. | NVMe |
| nvme | Whole disk | Complete system image (includes miniboot_nvme) | NVMe |
| sdcard | Whole disk | System image | Currently fixed as NAND |

:::info Flashing NVMe ≠ booting from NVMe
An NVMe image can be flashed, but whether the device can boot from NVMe is determined by the boot switch, and varies by model (for example, the S100 cannot boot from NVMe, the S600 can). Whether boot is supported follows each product's flashing docs.
:::

## Backup image naming

A backup image appends `_backup` to the original image name (for example, `miniboot_flash.img` → `miniboot_flash_backup.img`). For the backupable regions and image lists per model, see each product's flashing docs.

:::warning Reflashing a backup image
When reusing a backup image for flashing, remove `_backup` from the file name and use the same extension as when flashing that region: base boot regions use `.img` (`miniboot_flash_backup.img` → `miniboot_flash.img`), and whole-disk regions use `.simg` (`ufs_disk_backup.img` → `ufs_disk.simg`).
:::