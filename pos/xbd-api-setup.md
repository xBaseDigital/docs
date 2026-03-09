---
title: Order Creation
layout: home
permalink: /pos/checkout
parent: POS API
nav_order: 3
---

## Integrating RELM Checkout via Direct API

This guide explains how to integrate **RELM Checkout** directly into your **e-commerce store** or **POS system** using the RELM REST API.

## Prerequisites

Before starting the integration, ensure that you have the following:

- **Key ID**, **Public Key**, and **Private Key** are generated as mentioned in the [Reference](https://docs.relm.co/auth/create-api-key)
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

## Rate Limiting

There are currently no rate limits enforced for creating orders via the RELM APIs. You can create orders as needed without restrictions. 

## Error Codes

When an error occurs, the API responds with a structured error object. Below is the general format:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "fullCode": "string",
    "msg": ["string"],
    "source": "string",
    "statusCode": "number",
    "traceId": "string"
  }
}
```

### Example: 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "internal-server-error",
    "fullCode": "RELM-GEN-INTERNAL-SERVER-ERROR",
    "msg": [
      "\nInvalid `prisma.posOrder.create()` invocation:\n\n\nUnique constraint failed on the fields: (`clientOrderId`)"
    ],
    "source": "GEN",
    "statusCode": 500,
    "traceId": "cfc75450-1bba-11f1-ad67-93c03b26c699"
  }
}
```

### Example: 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "unauthorized",
    "fullCode": "RELM-GEN-UNAUTHORIZED",
    "msg": [
      "Invalid API key authentication"
    ],
    "source": "GEN",
    "statusCode": 401,
    "traceId": "63f10450-1bbb-11f1-ad67-93c03b26c699"
  }
}
```

### Example: 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "not-found",
    "fullCode": "RELM-GEN-NOT-FOUND",
    "msg": [
      "Currency USDE not found"
    ],
    "source": "GEN",
    "statusCode": 404,
    "traceId": "98c52fd0-1bbb-11f1-ad67-93c03b26c699"
  }
}
```

### Demo

- [Ecommerce store](https://xkicks.store)
