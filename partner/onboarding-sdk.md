---
title: Onboarding SDK
layout: home
permalink: /onboarding-sdk
parent: SDK Integration
nav_order: 2
---

# Onboarding SDK

The **Onboarding SDK** (`@relm-dev/onboard-sdk`) embeds Relm's in‑house onboarding
flow directly inside your application. You provide a customer's **access token**
and **refresh token**; the SDK launches the fully hosted flow in a secure iframe
and calls you back when the customer is done.

The onboarding UI runs unchanged on the Relm platform — the package only mounts
it, performs the token handshake, and surfaces lifecycle callbacks.

---

## Customer Login & OTP Verification

Before you can open the Onboarding SDK, you need a customer's **access token**
and **refresh token**. These are issued by logging the customer in and
verifying a one‑time password (OTP), sent as an MFA code.

The flow has two steps:

1. **Login** — authenticate the customer with their email and password. If the
   account requires MFA, the response returns an `mfaToken` instead of session
   tokens, and the customer is shown an **OTP screen** to enter the code sent
   to them.
2. **Verify OTP** — submit the `mfaToken` together with the OTP code the
   customer entered. This returns the `token` (access token) and
   `refreshToken` to pass into the SDK as `providerAccessToken` /
   `providerRefreshToken`.

### Login API

Method

    POST

Endpoint

    auth/login

### Payload

```json
{
  "email": "string",
  "password": "string"
}
```

### Field Description

- **email** — the customer's account email.
- **password** — the customer's account password.

### Response

If MFA is required, the response has no session tokens yet — show the OTP
screen and collect the code, then call **Verify OTP** with the `mfaToken`:

```json
{
  "success": true,
  "data": {
    "mfaRequired": true,
    "mfaToken": "string",
    "customer": { "...": "..." }
  }
}
```

If MFA is not required for the account, `token` and `refreshToken` are
returned directly and the OTP step is skipped:

```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string",
    "customer": { "...": "..." }
  }
}
```

---

### Verify OTP API

Once the customer enters the OTP code shown on the **OTP screen**, submit it
along with the `mfaToken` from the login response.

Method

    POST

Endpoint

    auth/mfa/verify

### Payload

```json
{
  "mfaToken": "string",
  "code": "string"
}
```

### Field Description

- **mfaToken** — the token returned from the Login API when `mfaRequired` is `true`.
- **code** — the OTP code entered by the customer.

### Response

```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string",
    "customer": { "...": "..." }
  }
}
```

Use `data.token` as `providerAccessToken` and `data.refreshToken` as
`providerRefreshToken` when initializing the SDK (see
[Quick start](#quick-start-frameworkagnostic) below).

Both endpoints return an `error` object (`code`, `msg`, `traceId`) instead of
`data` when `success` is `false`.

---

## Authentication

The SDK authenticates with a customer's **access token** and **refresh token**
(the same session tokens the Relm portal issues). You obtain these for the
customer being onboarded and pass them to the SDK:

- **`providerAccessToken`** — short‑lived access token for the onboarding user.
- **`providerRefreshToken`** — refresh token; the SDK's API layer uses it to
  silently renew the session while the flow is open.

> **Note:** The tokens are only ever sent to the resolved Relm origin for the
> selected environment. The SDK handles refresh automatically — you don't need to.

---

## Environments

Set `flavor` to match where the tokens are valid, or override with `baseUrl`.

| Flavor | Origin |
| --- | --- |
| `SANDBOX` | `https://sandbox.portal.relm.co` |
| `PROD` | `https://portal.relm.co` |

---

## Install

```bash
npm install @relm-dev/onboard-sdk
# or
yarn add @relm-dev/onboard-sdk
```

`react` / `react-dom` are optional peer dependencies — only required if you use
the `/react` entry.

---

## Quick start (framework‑agnostic)

```javascript
import { RelmOnboarding } from "@relm-dev/onboard-sdk";

const onboarding = new RelmOnboarding({
  providerAccessToken: "<access-token>",
  providerRefreshToken: "<refresh-token>",
  flavor: "PROD", // SANDBOX | PROD
  onComplete: (payload) => console.log("Onboarding complete", payload),
  onError: (err) => console.error("Onboarding error", err),
  onSessionExpired: () => redirectToLogin(),
  onClose: () => console.log("Widget closed"),
});

// Opens a centered modal by default
document.querySelector("#start").addEventListener("click", () => onboarding.open());
```

`createOnboardingWidget(config)` is also available and returns an
`{ open, close, destroy, setTokens }` controller (the `init/open/close` style).

---

## React integration

```jsx
import { RelmOnboardingWidget } from "@relm-dev/onboard-sdk/react";

export function Onboard({ providerAccessToken, providerRefreshToken }) {
  return (
    <RelmOnboardingWidget
      providerAccessToken={providerAccessToken}
      providerRefreshToken={providerRefreshToken}
      flavor="PROD"
      onComplete={() => console.log("done")}
      onClose={() => console.log("closed")}
    />
  );
}
```

Control it imperatively with a ref and `autoOpen={false}`:

```jsx
const ref = useRef(null);
<RelmOnboardingWidget
  ref={ref}
  autoOpen={false}
  providerAccessToken={a}
  providerRefreshToken={r}
/>;
// ref.current.open() / ref.current.close()
```

---

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `providerAccessToken` | `string` | — | **Required.** Customer's onboarding access token. |
| `providerRefreshToken` | `string` | — | **Required.** Refresh token used to silently renew the session. |
| `flavor` | `SANDBOX \| PROD` | `PROD` | Environment preset (maps to an origin). |
| `baseUrl` | `string` | — | Explicit origin; overrides `flavor`. |
| `route` | `string` | `/customer` | Route that renders the onboarding flow. |
| `partnerId` | `string` | — | Forwarded to the app for partner branding. |
| `mode` | `drawer \| modal \| inline` | `modal` | Presentation style (modal is centered). |
| `width` | `string` | `min(1120px, calc(100vw - 48px))` | Panel width (drawer/modal). |
| `height` | `string` | `min(760px, calc(100vh - 40px))` | Panel height (drawer/modal). |
| `mount` | `string \| HTMLElement` | — | Target element for `inline` mode. |
| `showHeader` | `boolean` | `false` | Show a titled header bar with a close button. |
| `showCloseButton` | `boolean` | `true` | Show a floating close (X) when the header is hidden. |
| `title` | `string` | `Complete your verification` | Header title (only when `showHeader` is true). |
| `closeOnEscape` | `boolean` | `true` | Close the drawer/modal on `Esc`. |
| `zIndex` | `number` | `2147483000` | Overlay base z‑index. |

### Callbacks

| Callback | Fired when |
| --- | --- |
| `onReady()` | The app acknowledged the handshake and is displaying the flow. |
| `onComplete(payload)` | The customer finished onboarding. The widget then closes. |
| `onError(payload)` | The app reported an error. |
| `onSessionExpired()` | The tokens are no longer valid. The widget closes. |
| `onClose()` | The widget was closed (by the user, host, or completion). |

---

## How it works

1. The SDK renders an iframe at `{origin}{route}?a=<access>&r=<refresh>` (the URL
   params are a bootstrap fallback and are stripped from history on load).
2. On load, the SDK posts an `INIT_WIDGET` message (with the tokens) to the app,
   retrying until the app replies `WIDGET_READY`.
3. The app stores the tokens, enters widget mode, and runs the onboarding flow.
   Its API layer transparently refreshes the access token using the refresh token.
4. On completion the app posts `ONBOARDING_COMPLETE`; the SDK closes the widget
   and invokes `onComplete`. `SESSION_EXPIRED` and `CLOSE_WIDGET` are handled
   similarly.

All messages are origin‑checked against the resolved environment origin.

> **Note:** This package requires a browser environment. The hosted platform
> behaviour is unchanged when the flow is opened directly (non‑widget) —
> widget‑only messaging is gated behind widget mode.
