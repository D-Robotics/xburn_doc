---
title: "Install XBurn"
description: "Download and install the XBurn tool (Windows/Linux/macOS)"
---

# Install XBurn

## Download

Go to the [XBurn download page](https://archive.d-robotics.cc/downloads/software_tools/download_tools/) and choose the installer for your operating system. Using `xburn-gui_1.2.1` as an example:

| OS | Installer | How to install |
| --- | --------- | -------------- |
| Windows | `xburn-gui_1.2.1_x64-setup.exe` | Double-click the installer and follow the wizard |
| Linux | `xburn-gui_1.2.1_amd64.deb` | 1. Run `sudo dpkg -i xburn-gui_1.2.1_amd64.deb`<br />2. Run `sudo xburn-gui`, or click the XBurn icon in the application menu and enter your password when prompted |
| macOS | `xburn-gui_1.2.1_universal.dmg` | Drag it into Applications |

## Next steps

After the tool is installed, prepare for flashing as follows:

**Set up the runtime environment** (varies by OS)

- [Windows environment](./environment/windows-setup)
- [Linux environment](./environment/linux-setup)
- [macOS environment](./environment/mac-setup)

**Flash a system image** (per-product flashing docs)

- [RDK S100](https://developer.d-robotics.cc/rdk_s_doc/Quick_start/install_os/rdk_s100/burn) / [RDK S600](https://developer.d-robotics.cc/rdk_s_doc/Quick_start/install_os/rdk_s600/burn)
- [RDK X5](https://developer.d-robotics.cc/rdk_x_doc/Quick_start/install_os/rdk_x5/burn) / [RDK X5 Module](https://developer.d-robotics.cc/rdk_x_doc/Quick_start/install_os/rdk_x5_module/burn)