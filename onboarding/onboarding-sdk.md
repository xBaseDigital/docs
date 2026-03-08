---
title: Onboarding SDK
layout: home
permalink: /onboarding-sdk
parent: Get Started
nav_order: 4
---

# Sumsub SDK Integration Guide

## Overview

This document explains how the **Sumsub WebSDK** is integrated into the
dashboard onboarding flow to perform **customer KYC/KYB verification**
within the application.

---

## Backend Setup

### Base URLs

**Production**

    https://api.relm.co/v1

**Sandbox**

    https://sandbox.api.relm.co/v1

---

## API Authentication

To authenticate API requests, you must generate a **signature** using
the **Key ID**, **Public Key** and **Private Key**.

This signature must be included in the request headers when calling the
API.

### Generate API Signature

Use your **Key ID**, **Public Key** and **Private Key** to generate the API signature from the below documentation.

[Reference documentation](https://docs.relm.co/auth)

---

### Retrieve API Credentials

The **Key ID**, **Public Key** and **Private Key** are available through secure links. The secure links will be shared privately to you.

⚠️ These links can be opened **only once**, so store the credentials
securely.

---

## Access Token API

After authentication is implemented, call the following endpoint from
your backend to generate the **Sumsub access token**.

Add the signature in the header on the below API

### Endpoint

Method

    POST

Endpoint

    /partners/ssb/access-token

---

### Header

````http
Authorization: Signature {GENERATED_SIGNATURE}

### Payload

```json
{
  "externalUserId": "string",
  "customerType": "INDIVIDUAL | BUSINESS"
}
````

### Field Description

externalUserId - Unique customer identifier

customerType - Type of customer (`INDIVIDUAL` or `BUSINESS`)
used for selecting the verification level

---

### Response

```json
{
  "success": true,
  "data": {
    "token": "string",
    "userId": "string"
  }
}
```

---

## Frontend Integration

### Install the SDK

npm:

    npm i @sumsub/websdk --save

yarn:

    yarn add @sumsub/websdk

---

### Import the SDK

```javascript
import snsWebSdk from "@sumsub/websdk";
```

Standalone:

```html
<script src="https://static.sumsub.com/idensic/static/sns-websdk-builder.js"></script>
```

---

### Create SDK Container

```html
<div id="sumsub-websdk-container"></div>
```

---

### Initialize SDK

```javascript
function launchWebSdk(accessToken) {
  let snsWebSdkInstance = snsWebSdk
    .init(accessToken, () => this.getNewAccessToken())

    .withConf({
      lang: "en",
      theme: "dark",
    })

    .withOptions({
      addViewportTag: false,
      adaptIframeHeight: true,
    })

    .on("idCheck.onStepCompleted", (payload) => {
      console.log("onStepCompleted", payload);
    })

    .on("idCheck.onError", (error) => {
      console.log("onError", error);
    })

    .build();

  snsWebSdkInstance.launch("#sumsub-websdk-container");
}

function getNewAccessToken() {
  return Promise.resolve(newAccessToken);
}
```

---

## React Integration

```jsx
import SumsubWebSdk from "@sumsub/websdk-react";

<SumsubWebSdk
  accessToken={accessToken}
  expirationHandler={accessTokenExpirationHandler}
  config={config}
  options={options}
  onMessage={messageHandler}
  onError={errorHandler}
/>;
```

---

## Verification Flow

Customer → Frontend → Backend → Relm API → Access Token → Frontend
launches SDK → KYC Completed
