---
title: SDK Integration
layout: home
permalink: /sdk-integration
parent: Get Started
nav_order: 2
has_children: true
---

# SDK Integration

Relm offers client SDKs to embed onboarding and verification directly inside your
own application.

- **[Onboarding SDK](/onboarding-sdk)** — embed Relm's in‑house onboarding flow
  (`@relm-dev/onboard-sdk`) using an access token and refresh token.
- **[Sumsub SDK](/sumsub-sdk)** — integrate the **Sumsub WebSDK** to run
  customer KYC/KYB verification within your app.

Choose the SDK that matches your integration:

| SDK            | Package | What it embeds | Auth |
|----------------| --- | --- | --- |
| Onboarding SDK | `@relm-dev/onboard-sdk` | Relm hosted onboarding flow | Access token + refresh token |
| Sumsub SDK     | `@sumsub/websdk` | Sumsub verification UI | API signature (backend) → Sumsub token |
