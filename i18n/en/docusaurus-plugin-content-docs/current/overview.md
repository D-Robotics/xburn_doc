---
title: "XBurn overview"
description: "Introduction to the XBurn flashing tool, supported models (RDK S100/RDK S600/RDK X5/RDK X5 Module), and core capabilities"
---

# XBurn overview

XBurn is a D-Robotics board-level flashing tool that runs on a PC (Windows/Linux/macOS) for firmware flashing and backup. It supports four models: RDK S100, RDK S600, RDK X5, and RDK X5 Module. It replaces the earlier D-Navigation and is the recommended board-level flashing tool for these models.

Core capabilities:

| Capability | Description | RDK S100 | RDK S600 | RDK X5 | RDK X5 Module |
|------------|-------------|:--------:|:--------:|:------:|:-------------:|
| Full-image flashing | Write a complete system image to the device's onboard storage (eMMC / UFS / NAND Flash) or M.2 NVMe expansion storage | ✅ | ✅ | ✅ | ✅ |
| Region flashing | Write only a specified region (such as miniboot) | ✅ | ✅ | ✅ | ✅ |
| Region backup | Export and save the current image of a region on the device | ✅ | ✅ | ❌ | ❌ |
| Partition-image flashing | Write the image of a single partition | ✅ | ✅ | ❌ | ❌ |

## Next steps

- [Install XBurn](./install)