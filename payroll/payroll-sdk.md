---
title: Payroll Widget
layout: home
permalink: /payroll-widget
parent: Get Started
nav_order: 5
---

# PayoutSDK — Integration Guide

A lightweight embeddable widget that opens a payout portal inside your app via an iframe. This guide covers everything you need to load and launch the widget.

---

## Overview

The flow has three steps:

1. **Fetch tokens** from the Relm API using your API key credentials
2. **Load the SDK script** served from the portal
3. **Call `init()` then `open()`** to launch the widget

---

## Step 1 — Fetch Access & Refresh Tokens

Before initializing the SDK, you need a short-lived `accessToken` and `refreshToken` from the Relm token endpoint.

### Endpoint

```
GET /v1/api-keys/tokens
```

### Request

```ts
const response = await fetch(`${baseUrl}/v1/api-keys/tokens`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "<your_signature>",
  },
});
```

| Header          | Description                             |
| --------------- | --------------------------------------- |
| `Authorization` | Request signature generated server-side |
| `Content-Type`  | Must be `application/json`              |

### Response

```json
{
  "data": {
    "token": "<accessToken>",
    "refreshToken": "<refreshToken>"
  }
}
```

### Base URLs by environment

| Flavor    | Base URL                         |
| --------- | -------------------------------- |
| `LOCAL`   | `http://localhost:3000`          |
| `SANDBOX` | `https://sandbox.api.relm.co`    |
| `PREPROD` | `https://portal.preprod.relm.co` |
| `LIVE`    | `https://portal.relm.co`         |

---

## Step 2 — Load the SDK Script

The SDK script is served from the portal. Inject it into the page once — typically after tokens are ready.

```ts
const portalUrl = "https://sandbox.portal.relm.co"; // swap per environment

const script = document.createElement("script");
script.src = `${portalUrl}/sdk/payout-sdk.js`;
script.async = true;
script.onload = () => {
  // Safe to call PayoutSDK here
};
document.body.appendChild(script);
```

> **Note:** Check for an existing script tag before injecting to avoid duplicates:
>
> ```ts
> const existing = document.querySelector(
>   `script[src="${portalUrl}/sdk/payout-sdk.js"]`,
> );
> if (!existing) document.body.appendChild(script);
> ```

---

## Step 3 — Initialize & Open the Widget

Once the script has loaded and you have your tokens, call `init()` followed by `open()`.

### `PayoutSDK.init(config)`

Initializes the widget. Call this **once** per session.

```ts
window.PayoutSDK.init({
  accessToken: "<token from Step 1>",
  refreshToken: "<refreshToken from Step 1>",
  flavor: "SANDBOX", // LOCAL | SANDBOX | PREPROD | LIVE
  onSuccess: (data) => {
    console.log("Payout success:", data);
    // data: { transactionId, amount, currency, method }
  },
  onError: (err) => {
    console.error("Payout error:", err);
  },
  onSessionExpired: () => {
    console.log("Session expired — re-authenticate");
  },
});
```

#### Config options

| Property           | Type       | Required | Description                                  |
| ------------------ | ---------- | -------- | -------------------------------------------- |
| `accessToken`      | `string`   | ✅       | Short-lived token from `/v1/api-keys/tokens` |
| `refreshToken`     | `string`   | ✅       | Refresh token from `/v1/api-keys/tokens`     |
| `flavor`           | `string`   | ✅       | Target environment (`SANDBOX`, `LIVE`, etc.) |
| `onSuccess`        | `function` | ❌       | Called on successful payout                  |
| `onError`          | `function` | ❌       | Called on payout failure                     |
| `onSessionExpired` | `function` | ❌       | Called when the session expires              |

### `PayoutSDK.open()`

Opens the widget drawer. Call this after `init()`.

```ts
window.PayoutSDK.open();
```

### `PayoutSDK.close()`

Programmatically closes the widget.

```ts
window.PayoutSDK.close();
```

---

## Full Example (React)

```tsx
const handleOpenPayout = async () => {
  const baseUrl = "https://sandbox.api.relm.co";
  const portalUrl = "https://sandbox.portal.relm.co";

  // 1. Fetch tokens
  const response = await fetch(`${baseUrl}/v1/api-keys/tokens`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "<your_signature>",
    },
  });

  const { data } = await response.json();
  const { token, refreshToken } = data;

  // 2. Load SDK (skip if already loaded)
  const existing = document.querySelector(
    `script[src="${portalUrl}/sdk/payout-sdk.js"]`,
  );

  const initAndOpen = () => {
    window.PayoutSDK?.init({
      accessToken: token,
      refreshToken,
      flavor: "SANDBOX",
      onSuccess: (data) => console.log("Success:", data),
      onError: (err) => console.error("Error:", err),
      onSessionExpired: () => console.log("Session expired"),
    });
    window.PayoutSDK?.open();
  };

  if (existing) {
    initAndOpen();
  } else {
    const script = document.createElement("script");
    script.src = `${portalUrl}/sdk/payout-sdk.js`;
    script.async = true;
    script.onload = initAndOpen;
    document.body.appendChild(script);
  }
};
```

---

## `onSuccess` Payload

```ts
{
  transactionId: string;
  amount: number;
  currency: string;
  method: string;
}
```

---

## Environment Reference

| Flavor    | Portal URL                       |
| --------- | -------------------------------- |
| `LOCAL`   | `http://localhost:3000`          |
| `SANDBOX` | `https://sandbox.portal.relm.co` |
| `PREPROD` | `https://portal.preprod.relm.co` |
| `LIVE`    | `https://portal.relm.co`         |
