---
title: "Interface and fields"
description: "All 7+ XBurn interface fields explained: product type / connection type / download mode / image directory / storage media / firmware type / advanced"
---

# Interface and fields

After opening XBurn, you configure parameters on the main interface to complete a flashing task. This page gives an overview of the interface fields and what each does. Connection type and download mode each have their own dedicated page; here we only point out their place and role in the interface without repeating details.

:::info Model differences in field values
This page describes what fields *mean* (common across models). For what *value* each field takes (for example, whether product type is `RDK S100` or `RDK S600`, or whether media is `eMMC` or `UFS`), see each product's flashing docs.
:::

## Field overview

The core fields of the XBurn main interface are as follows:

| Field | Purpose | Consequence of a wrong choice |
| ----- | ------- | ----------------------------- |
| Product type | Select the product type of the device to flash | Flashing incompatible firmware; flashing fails |
| Connection type | How the device communicates with the PC | Affects available download modes; a wrong choice fails to recognize the device |
| Download mode | The boot mode used for flashing | A mode that does not match the device state cannot start flashing |
| Storage media | The type of storage the image is written to | Writing to the wrong media cannot complete flashing |
| Firmware type | The security type of the firmware | A wrong choice leads to flashing failure |
| Image file directory | The product folder containing the image | A wrong directory means the image file cannot be found |
| Advanced | Advanced options such as region flashing / backup | Select as needed |

## Product type

Select the model of the device to flash (for example, `RDK S100`, `RDK S600`). It determines the available connection types and subsequent fields.

:::warning Must match the actual model
Select the option that matches the device's actual model; otherwise incompatible firmware is flashed and flashing fails.
:::

## Connection type

Select how the device communicates with the PC: `USB` or `Serial+USB`. The product type determines the available connection types, and the connection type in turn determines the available download modes.

For the description, combination rules, and available download modes of connection types, see [Connection types and download modes](./download-modes).

## Download mode

XBurn automatically matches the available download modes based on the selected connection type. For the modes and selection per model, see [Connection types and download modes](./download-modes).

## Storage media

Select the type of storage the image is written to, matching the target storage: onboard storage (`eMMC`, `UFS`, `NAND Flash`) or M.2 NVMe expansion. For the media types per model, see each product's flashing docs.

## Firmware type

Select the security type of the firmware. All models currently use `secure`, the default and only option.

## Image file directory

Select the directory containing the image to flash — the image folder obtained by extracting the image package.

## Advanced

The following features are supported:

- **Region flashing**: the image is written only to a specified region.
- **Region backup**: export the current image of a region on the device to the PC.
- **Partition-image flashing**: the image is written only to a single partition, at a finer granularity than region flashing.
- **Auto-reboot after flashing**: after flashing completes, the device automatically reboots into normal boot mode, saving manual power-off and switch operation.
- **Check whether the device booted successfully**: after reboot, automatically check whether the device booted normally, saving manual power-on and inspection.

The first three (region flashing, region backup, partition-image flashing) are mutually exclusive — select only one at a time; the last two can be combined with the first three. See [Batch flashing](./batch-burn) and [Auto-reboot after flashing and boot check](./auto-reboot).