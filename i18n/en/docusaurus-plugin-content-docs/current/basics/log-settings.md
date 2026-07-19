---
title: "Log settings"
description: "Setting XBurn log level (info/debug) and capturing logs for troubleshooting"
---

# Log settings

The XBurn log level controls the verbosity of the output logs and is configured on the **Settings** page.

## Log level

| Level | Output | When to use |
| ----- | ------ | ----------- |
| `info` | Standard runtime information | When you want details of the flashing process |
| `debug` | Detailed debug information | When flashing fails and standard information is not enough to locate the cause,<br />switch to `debug` and reproduce the problem so the log records the detail needed for diagnosis |

## Log location

Logs are visible in two places, with identical content:

- **Upgrade progress page**: after you click **Start**, the upgrade progress page shows flashing logs in real time, useful for identifying the failing step.
- **Log files**: logs are written in real time to the `logs` folder under the XBurn installation directory. Attach them when submitting a problem report.