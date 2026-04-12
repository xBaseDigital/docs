---
title: Payroll Widget
layout: home
permalink: /payroll-widget
parent: Get Started
nav_order: 5
---

# Payroll Widget — Integration Guide

A lightweight embeddable widget that opens a payroll widget inside your app via an iframe. This guide covers everything you need to load and launch the widget.

---

## Overview

The flow has three steps:

1. **Fetch tokens** from the Relm API using your API key credentials
2. **Load the SDK script** served from the portal
3. **Call `init()` then `open()`** to launch the widget

---

### Generating the API Signature

Use your **Key ID**, **Public Key**, and **Private Key** to generate the authentication signature as described in the documentation below.

[Signature Generation Guide](https://docs.relm.co/auth)

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

| Flavor    | Base URL                      |
| --------- | ----------------------------- |
| `LOCAL`   | `http://localhost:3000`       |
| `SANDBOX` | `https://sandbox.api.relm.co` |
| `LIVE`    | `https://portal.relm.co`      |

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
  flavor: "SANDBOX", // LOCAL | SANDBOX | LIVE
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

| Property       | Type     | Required | Description                                  |
| -------------- | -------- | -------- | -------------------------------------------- |
| `accessToken`  | `string` | ✅       | Short-lived token from `/v1/api-keys/tokens` |
| `refreshToken` | `string` | ✅       | Refresh token from `/v1/api-keys/tokens`     |
| `flavor`       | `string` | ✅       | Target environment (`SANDBOX`, `LIVE`, etc.) |

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

## Session Expiry

Access tokens are short-lived. When a token expires mid-session, the widget will **automatically close** and fire the `onSessionExpired` callback.

This means the existing tokens are no longer valid. To reopen the widget you must fetch a fresh pair of tokens from `/v1/api-keys/tokens` and call `init()` + `open()` again — the same process as the initial launch.

```ts
window.PayoutSDK.init({
  // ...
  onSessionExpired: async () => {
    // Widget has already closed at this point.
    // Do NOT reopen with the old tokens — they are expired.

    // 1. Re-fetch fresh tokens
    const response = await fetch(`${baseUrl}/v1/api-keys/tokens`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "<your_signature>",
      },
    });

    const { data } = await response.json();
    const { token, refreshToken } = data;

    // 2. Re-initialize with new tokens and reopen
    window.PayoutSDK.init({
      accessToken: token,
      refreshToken,
      flavor: "SANDBOX",
      onSuccess: (data) => console.log("Success:", data),
      onError: (err) => console.error("Error:", err),
      onSessionExpired: () => {
        /* handle recursively if needed */
      },
    });

    window.PayoutSDK.open();
  },
});
```

> **Important:** Do not attempt to reopen the widget with the old tokens after `onSessionExpired` fires. The session is already invalid and the widget will fail to load. Always fetch fresh tokens first.

---

## Full Example (React)

```tsx
const openPayoutWidget = async () => {
  const baseUrl = "https://sandbox.api.relm.co";
  const portalUrl = "https://sandbox.portal.relm.co";

  // Reusable token fetch
  const fetchTokens = async () => {
    const response = await fetch(`${baseUrl}/v1/api-keys/tokens`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "<your_signature>",
      },
    });
    const { data } = await response.json();
    return data; // { token, refreshToken }
  };

  // Reusable init + open
  const initAndOpen = (token: string, refreshToken: string) => {
    window.PayoutSDK?.init({
      accessToken: token,
      refreshToken,
      flavor: "SANDBOX",
      onSuccess: (data) => console.log("Success:", data),
      onError: (err) => console.error("Error:", err),
      onSessionExpired: async () => {
        // Widget is closed — re-fetch and reopen
        const fresh = await fetchTokens();
        initAndOpen(fresh.token, fresh.refreshToken);
      },
    });
    window.PayoutSDK?.open();
  };

  // 1. Fetch tokens
  const { token, refreshToken } = await fetchTokens();

  // 2. Load SDK (skip if already loaded)
  const existing = document.querySelector(
    `script[src="${portalUrl}/sdk/payout-sdk.js"]`,
  );

  if (existing) {
    initAndOpen(token, refreshToken);
  } else {
    const script = document.createElement("script");
    script.src = `${portalUrl}/sdk/payout-sdk.js`;
    script.async = true;
    script.onload = () => initAndOpen(token, refreshToken);
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
| `LIVE`    | `https://portal.relm.co`         |
