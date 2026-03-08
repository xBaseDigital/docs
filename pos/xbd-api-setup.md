---
title: Order Creation
layout: home
permalink: /pos/checkout
parent: POS API
nav_order: 3
---

# Integrating RELM Checkout via Direct API

This guide explains how to integrate **RELM Checkout** directly into your **e-commerce store** or **POS system** using the RELM REST API.

## Prerequisites

Before starting the integration, ensure that you have the following:

- **Key ID**, **Public Key**, and **Private Key** provided by RELM
- Implemented **API signature generation** as described in the [Authentication & Signing Guide](https://docs.relm.co/auth)
- Basic familiarity with **HTTP requests** and **JSON payloads**

## Environment URLs

Use the following base URLs depending on the environment you are working in.

| Environment | Base URL                      |
| ----------- | ----------------------------- |
| Sandbox     | `https://sandbox.api.relm.co` |
| Production  | `https://api.relm.co`         |

## Integration Steps

<strong>Step 1.</strong> Call the <strong>Order creation api</strong> to create an order on RELM System

Endpoint – `/v1/pos/client/order/create`

Method – <strong>`POST`</strong>

Headers

```json
"header" : {
  "Content-Type" : "application/json"
  "Authorization" : "Signature {Generated Signature}"
}
```

Request

```json
{
  "clientOrderId": "{Your specific order id}",
  "orderAmount": "{amount of the order}",
  "currencyCode": "{currency of the amount in FIAT}",
  "description": "{Description of the Cart}",
  "recipientEmail": "{customer email}",
  "redirectUrl": {
    "accept": "{Your accept Url for redirect}",
    "cancel": "{Your cancel Url for redirect}",
    "failed": "{Your failed Url for redirect}"
  }
}
```

Response

```json
{
  "success": true,
  "data": {
    "orderId": "string",
    "clientOrderId": "string",
    "orderAmount": "string",
    "orderCurrency": "string",
    "recipientEmail": "string",
    "status": "string",
    "orderType": "string",
    "token": "string",
    "paymentCurrency": "string | undefined",
    "paymentAmount": "string | undefined",
    "payerPaidAmount": "string | undefined",
    "payerRemainingAmount": "string | undefined",
    "payerEmail": "string",
    "paymentWalletAddress": "string",
    "qrCode": "string",
    "paymentLink": "string",
    "company": "object | undefined",
    "network": "string",
    "createdAt": "Date",
    "expiresAt": "Date",
    "additionalInfo": "string | undefined",
    "payerConversionRate": "string | undefined"
  }
}
```

You will receive a <strong>paymentLink</strong> in the response, which you need to redirect the user to.

With this <strong>paymentLink</strong>, your frontend can navigate to our Checkout solution which will further process the order and receive the payment.

### Demo

- [Ecommerce store](https://xkicks.store)
