---
title: "Connection types and download modes"
description: "Selection of XBurn connection types (USB / Serial+USB) and download modes, and how they relate"
---

# Connection types and download modes

To flash with XBurn, first choose a **connection type** (how the device communicates with the PC). The connection type determines the available **download modes**, after which you enter the matching mode to flash. This page explains how to choose connection types and download modes, and how the two relate.

## Connection types

The **Connection type** field in the XBurn interface selects how the device communicates with the PC. Two are actually involved in flashing:

| Connection type | Description | Applies to |
| --------------- | ----------- | ---------- |
| `USB` | The main channel over which XBurn communicates with the device and sends flashing commands | S100 / S600 (single Type-C, multiplexed) |
| `Serial+USB` | Serial + USB combo: the serial port guides via XModem, and USB sends via Fastboot | X5 / X5 Module (two cables) |

> The serial port is never used alone; it is only for logging and XModem guidance, and must be combined with USB. For which connection each model uses and how to wire it, see each product's flashing docs.

## Download mode selection

Choose the recommended mode by the current state of the device:

| Device state | Recommended download mode | Description |
| ------------ | ------------------------- | ----------- |
| Non-empty board, normal system update | `Fastboot` | Common, fastest |
| Empty board (first flash) or system damaged, bricked | `DFU+Fastboot` | Requires a switch to put the device into DFU boot mode; the recovery path when U-Boot cannot be entered |
| Device without a DFU mode | `XModem+Fastboot` | Enter Fastboot after serial XModem guidance |

## Connection type → available download modes

The connection type determines the available download modes. Based on the selected connection type, XBurn automatically matches the available download modes:

| Connection type | Available download modes | Prerequisites |
| --------------- | ------------------------ | ------------- |
| `Serial+USB` | `xmodem_fastboot` / `fastboot` | Serial guides via XModem, USB sends via Fastboot; works for both empty and non-empty boards |
| `USB` | `fastboot` | Requires the device's U-Boot to be normal and a manual entry into Fastboot; see each product's flashing docs |