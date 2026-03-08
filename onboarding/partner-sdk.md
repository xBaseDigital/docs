---
title: Partner SDK
layout: home
permalink: /onboarding-sdk
parent: Get Started
nav_order: 4
---

# Sumsub SDK Integration Guide

## Overview

This document explains how the **Sumsub WebSDK** is integrated into the dashboard onboarding flow to enable **customer KYC/KYB verification** within the application.

---

## Backend Setup

### Base URLs

**Production**

    https://api.relm.co/v1

**Sandbox**

    https://sandbox.api.relm.co/v1

---

## API Authentication

All API requests must be authenticated using a **signature-based authentication mechanism**.

To generate the signature, you will need the following credentials:

- **Key ID**
- **Public Key**
- **Private Key**

The generated signature must be included in the request headers when calling any RELM API.

### Generating the API Signature

Use your **Key ID**, **Public Key**, and **Private Key** to generate the authentication signature as described in the documentation below.

[Signature Generation Guide](https://docs.relm.co/auth)

---

### Retrieve API Credentials

The following credentials are required to generate the API signature:

- **Key ID**
- **Public Key**
- **Private Key**

These credentials will be shared with you through **secure links**.

⚠️ **Important:**  
Each secure link can be opened **only once**. Please make sure to store the credentials in a **secure location** after accessing them.

---

## Access Token API

Once API authentication has been implemented, you can call the following endpoint from your **backend** to generate the **Sumsub access token**.

The generated **API signature must be included in the request headers** when calling this API.

### Endpoint

Method

    POST

Endpoint

    /partners/ssb/access-token

---

### Header

`Authorization: Signature {GENERATED_SIGNATURE}`

### Payload

```json
{
  "externalUserId": "string",
  "customerType": "INDIVIDUAL | BUSINESS"
}
```

### Field Description

- **externalUserId**  
  Unique identifier for the customer.

- **customerType**  
  Specifies the type of customer. Supported values are `INDIVIDUAL` or `BUSINESS`.  
  This value is used to determine the appropriate verification level.

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
