---
title: Phones and tablets
order: 7
annexRef: Annex F §5, §11
summary: Set up KoboCollect with each collector's own account, keep forms up to date, and use the offline web form as a fallback.
lastChecked: 2026-11-12
---
RISA runs on Android phones or tablets with KoboCollect (or ODK Collect). The offline web form (Enketo) on an iPhone, iPad or laptop is the fallback.

Why: KoboCollect works fully offline, records the audit log and handles GPS and photos best. Web forms work on any device but do not record the audit log.

## Set up KoboCollect

1. Install KoboCollect and configure the first device with the KoboCollect server URL of the chosen server (Global or EU) and the **collector's own** account. Kobo's article on [setting up KoboCollect](https://support.kobotoolbox.org/kobocollect_on_android_latest.html) explains which URL to enter.
2. Check the username is set, so each record carries who collected it.
3. Set **Blank form update mode** to update automatically ("Exactly match server", or "Previously downloaded forms only" with automatic download), so a redeployed form reaches every device.
4. Set **auto send**: over Wi-Fi only where mobile data is expensive or slow; over Wi-Fi and cellular where it is not.
5. Turn on high-accuracy location on the device. Let collectors take a test point at the first site.

All the settings are described in [Customizing KoboCollect settings](https://support.kobotoolbox.org/kobocollect_settings.html) and in the [ODK Collect settings](https://docs.getodk.org/collect-settings/).

## The settings QR code

To copy the settings to other devices, use the device's settings QR code ([ODK Collect: settings QR codes](https://docs.getodk.org/collect-import-export/)). The code contains the server, username and password in plain text. So either:

- remove the password from the code before sharing it, so each collector enters their own; or
- make one code per collector.

Treat any settings QR code as a password. Never put one in a document, slide, chat or screenshot.

## GPS, photos and power

- **GPS.** The form captures at 5 m accuracy and warns above 10 m. High-accuracy location must be on.
- **Image size.** The form caps photos at 1600 px. The device's image-size setting can reduce them further if bandwidth is very poor.
- **Bandwidth.** Photos and voice notes are most of the data volume. Send over Wi-Fi at the base each evening if mobile data is poor. Check the account's [storage and submission limits](https://support.kobotoolbox.org/account_usage_limits.html) before the mission.
- **Power.** Carry power banks and a vehicle charger. Frequent automatic form updates and high-accuracy GPS drain the battery.
- **Screen lock** on every device (see [Data protection](/guide/protection)).

## The web form fallback

For iOS or laptops, use the web form link that works online and offline ("Online-Offline (multiple submission)"). See [Collecting data using web forms](https://support.kobotoolbox.org/data_through_webforms.html) and [Enketo](https://support.kobotoolbox.org/enketo.html).

1. Open the link once while online, so it is cached.
2. Do not clear the browser's cache or site data during collection, or saved drafts are lost.
3. Send drafts as soon as there is a connection.

Records from the web form have no audit log. That is expected.

```prompt tool=get_project
Give me the web form link for the RISA <country> project.
```

:::failure Common failure
One device is set up with the owner account and its QR code is copied to every tablet. Every record is "submitted by" the owner, and the password travels with the code. Set up each device with the collector's own account.
:::
