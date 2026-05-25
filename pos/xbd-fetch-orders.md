---
title: Fetch Orders
layout: home
permalink: /pos/fetch-orders
parent: POS API
nav_order: 3
---

## Fetch Orders

This guide explains how to retrieve a paginated list of POS orders for your account, with optional filters to narrow results by status, date range, order type, and more.

## Authentication

This endpoint uses the same API signature method as described in the [Authentication & Signing Guide](https://docs.relm.co/auth).

## Environment URLs

| Environment | Base URL                      |
| ----------- | ----------------------------- |
| Sandbox     | `https://sandbox.api.relm.co` |
| Production  | `https://api.relm.co`         |

## Endpoint

Endpoint – `/v1/pos/client/orders`

Method – <strong>`GET`</strong>

Headers

```json
"header" : {
  "Content-Type"  : "application/json",
  "Authorization" : "Signature {Generated Signature}"
}
```

## Query Parameters

| Parameter       | Type    | Required | Description |
| --------------- | ------- | -------- | ----------- |
| `page`          | integer | No       | Page number to retrieve. Defaults to `1`. |
| `limit`         | integer | No       | Number of records per page. |
| `status`        | string  | No       | Filter by order status. Accepted values: `PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED`, `EXPIRED`, `FAILED`. |
| `orderType`     | string  | No       | Filter by order type. Accepted values: `EPOS`, `APP_POS`, `PAYMENT_LINK`. |
| `posOrderId`    | UUID    | No       | Filter by the RELM-assigned order ID (must be a valid UUID). |
| `clientOrderId` | string  | No       | Filter by the order ID assigned by your system. |
| `recipientName` | string  | No       | Filter by the recipient's name. |
| `recipientEmail`| string  | No       | Filter by the recipient's email address. |
| `fromDate`      | string  | No       | Return orders created on or after this date. Must be a valid ISO 8601 date string (e.g. `2026-01-01T00:00:00.000Z`). |
| `toDate`        | string  | No       | Return orders created on or before this date. Must be a valid ISO 8601 date string (e.g. `2026-12-31T23:59:59.999Z`). |

## Response

```json
{
    "success": true,
    "data": [
        {
            "gasStationEventReceived": false,
            "isSanctioned": false,
            "id": "53b89106-ad4a-46b2-8c33-e319c8210ba1",
            "clientOrderId": "e7486f2f-a404-4d68-8427-b09ffb14e240",
            "orderAmount": "100",
            "orderCurrencyId": "9110cbef-78e4-485a-b3f8-27e6b51b83c3",
            "paymentCurrencyId": "23712d7e-9a56-4c28-91cc-5c9676bd7651",
            "settlementCurrencyId": "cd6a2c1c-d62c-4ea5-983b-82fae5395b2d",
            "paymentAmount": "0.044387",
            "paymentAmountFeePercent": "1",
            "paymentFeeAmount": "0.000439",
            "payerPaidAmount": "0.044387",
            "providerPaymentAmount": "0.04185438533405442116",
            "paymentWallet": "0xe659c1D8118364331265a1dd7a006bDd0D609bDB",
            "paymentExternalId": "544",
            "status": "COMPLETED",
            "orderType": "PAYMENT_LINK",
            "recipientEmail": "some@m.com",
            "orderCurrency": {
                "id": "9110cbef-78e4-485a-b3f8-27e6b51b83c3",
                "currencyCode": "USD",
                "currencyName": null,
                "currencySymbol": "$",
                "currencyFlag": "https://statics.xbd.money/images/flags/usd.png",
                "currencyType": "FIAT",
                "enabled": true,
                "externalId": null,
                "fiatDetailsId": "fiat-USD",
                "createdAt": "2025-07-08T05:15:22.312Z",
                "updatedAt": "2025-12-03T15:31:47.532Z"
            },
            "paymentCurrency": {
                "id": "23712d7e-9a56-4c28-91cc-5c9676bd7651",
                "currencyCode": "ETH",
                "currencyName": "Ethereum",
                "currencySymbol": "Ξ",
                "currencyFlag": "https://statics.xbd.money/images/flags/crypto/eth.svg",
                "currencyType": "CRYPTO",
                "enabled": true,
                "externalId": null,
                "fiatDetailsId": null,
                "createdAt": "2025-11-20T06:48:07.263Z",
                "updatedAt": "2025-12-03T15:31:48.164Z"
            },
            "settlementCurrency": {
                "id": "cd6a2c1c-d62c-4ea5-983b-82fae5395b2d",
                "currencyCode": "USDT",
                "currencyName": "Tether",
                "currencySymbol": "₮",
                "currencyFlag": "https://statics.xbd.money/images/flags/crypto/usdt.svg",
                "currencyType": "CRYPTO",
                "enabled": true,
                "externalId": null,
                "fiatDetailsId": "fiat-USDT",
                "createdAt": "2025-11-13T05:07:36.544Z",
                "updatedAt": "2025-12-03T15:31:48.205Z"
            },
            "settlementAccountCurrencyId": "90b2b7f1-c415-4c6b-b5fe-4b4d23b672f8",
            "customerId": "285bbf4d-9c56-45d4-96fd-8d8a36abf5e9",
            "customer": {
                "isFeeProfileAvailable": true,
                "id": "285bbf4d-9c56-45d4-96fd-8d8a36abf5e9",
                "customerType": "BUSINESS",
                "accountApplicationStatus": "APPROVED",
                "verificationResult": "APPROVED",
                "createdAt": "2026-02-05T05:33:45.182Z",
                "updatedAt": "2026-03-09T11:41:47.025Z",
                "company": {
                    "id": "92796d00-62b2-4ec3-96a3-cc9c05e3a741",
                    "customerId": "285bbf4d-9c56-45d4-96fd-8d8a36abf5e9",
                    "name": "test",
                    "displayName": "test",
                    "registrationNumber": "46378645398",
                    "registeredAddress": "fscewdce, dfwefv, Karnataka, 560056, IND",
                    "industryName": "Education",
                    "industryType": "Education",
                    "createdAt": "2026-02-05T05:33:45.203Z",
                    "updatedAt": "2026-03-27T13:31:36.799Z"
                }
            },
            "additionalInfo": {
                "description": "ETH",
                "recipientName": "ETH Gas test"
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "paymentLink": "https://sandbox.checkout.relm.co/?t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "metadata": {
                "addressTag": "",
                "legacyAddress": "",
                "fireblocksAssetId": "ETH",
                "networkId": "6a48b281-c3c4-4a78-aa1f-f153d6b5ae71"
            },
            "createdAt": "2026-05-05T12:49:59.554Z",
            "updatedAt": "2026-05-05T13:01:38.578Z",
            "tokenCreatedAt": "2026-05-05T12:49:59.554Z",
            "tokenExpiresAt": "2026-05-05T13:49:59.554Z",
            "provider": "LMAX",
            "payerConversionRate": "0.000444",
            "internalConversionRate": "0.000439"
        }
    ],
    "pagination": {
        "total": 103,
        "limit": 10,
        "page": 1,
        "totalPages": 11
    }
}
```
