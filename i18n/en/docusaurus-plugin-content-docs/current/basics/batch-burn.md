---
title: "Batch flashing"
description: "Batch flashing limits and hardware requirements: software limit of 8 devices, recommended ≤4; the more devices, the higher the failure rate; stability depends on hardware environment such as cables, hub, and power"
---

# Batch flashing

XBurn supports connecting multiple devices at the same time for batch flashing, suitable for production lines and bulk flashing scenarios. However, concurrent multi-device flashing places requirements on USB power, bandwidth, and cable quality, and **the more devices connected, the higher the failure rate**. The software only controls the flashing process itself and cannot guarantee your hardware environment. This page explains the limits and requirements.

## Limits and recommendations

| Parameter | Value | Description |
| -- | ---- | ---- |
| Software limit | 8 devices | Maximum number of devices XBurn supports for simultaneous flashing; more cannot be connected. |
| Recommended concurrency | ≤4 devices | A recommended number that balances efficiency and failure rate, **not a stability guarantee**. |

:::warning Hardware-related failures are not supported
Concurrent multi-device flashing requires adequate cables, hub, and power. Failures caused by these hardware factors are not covered by software support.
:::

## Recommendations

- **Prefer native USB ports on the motherboard**, and avoid low-quality USB hubs.
- **Independent power**: when flashing multiple devices concurrently, make sure each device is powered adequately to avoid insufficient power from a single port.
- **High-quality cables**: every Type-C cable should have shielding, be as short as possible, and support data transfer (see the cable requirements in each product's flashing docs).
- **Flash in batches**: when the number of devices exceeds 4, flash in batches with ≤4 devices per batch.

:::info Auto-reboot in batch scenarios
During batch flashing, it is recommended to turn off [auto-reboot after flashing](./auto-reboot) to avoid one device rebooting on completion and affecting the flashing of other devices.
:::