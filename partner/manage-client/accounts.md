---
title: Client Accounts
layout: endpoint
try_it:
  - op: getClientAccounts
    heading: "Get Client Accounts"
  - op: getClientAccount
    heading: "Get Client Account"
try_it_spec: /assets/openapi/partner.json
permalink: /partner/manage-client/accounts
parent: Manage Client Banking
nav_order: 2
---

# Client Accounts

Manage the customer's accounts and the currencies enabled on each account.

---

## Get Client Accounts

{: .endpoint-desc }
Lists all accounts belonging to the customer, optionally filtered by account status.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/accounts
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. |

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `status` | string | No | Filter accounts by status: `ACTIVE` (default), `PENDING`, `PROCESSING`, `LOCKED`, `BLOCKED`, `DISABLED` or `CLOSED`. |

### Response

```
Status: 200 OK
```

```json
{
  "success": true,
  "data": [
    {
      "id": "9ffa201c-6733-4837-b728-b0ec2bc419bd",
      "customerId": "c709ff4d-d384-4292-9f49-8a4c4f46712b",
      "accountProvider": "FUSE",
      "onboardingMode": "AUTOMATED",
      "status": "ACTIVE",
      "type": "PERSONAL",
      "externalId": "328",
      "correlationId": "328",
      "accountCurrencies": [
        {
          "id": "e2149078-9be5-46f8-9ec1-4c742314a170",
          "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
          "type": "FIAT",
          "balance": "76205.12",
          "available": "75221.85",
          "locked": "0",
          "status": "ENABLED",
          "currency": {
            "id": "0ff5db18-ad57-4703-a031-08907aa814f1",
            "currencyCode": "AED",
            "currencyName": "United Arab Emirates Dirham",
            "currencySymbol": "د.إ",
            "currencyType": "FIAT",
            "enabled": true
          }
        }
      ],
      "createdAt": "2026-02-12T10:42:03.644Z",
      "updatedAt": "2026-04-20T10:45:58.120Z"
    }
  ]
}
```

---

## Get Client Account

{: .endpoint-desc }
Returns a single account for the customer, formatted with its currency details.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. |
| `accountId` | string (UUID) | Yes | ID of the account. Must belong to the customer. |

### Response

```
Status: 200 OK
```

Returns the formatted `AccountDTO` for the account.

```json
{
  "success": true,
  "data": {
    "id": "9ffa201c-6733-4837-b728-b0ec2bc419bd",
    "customerId": "c709ff4d-d384-4292-9f49-8a4c4f46712b",
    "accountProvider": "FUSE",
    "status": "ACTIVE",
    "type": "PERSONAL",
    "externalId": "328",
    "accountCurrencies": [
      {
        "id": "e2149078-9be5-46f8-9ec1-4c742314a170",
        "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
        "type": "FIAT",
        "balance": "76205.12",
        "available": "75221.85",
        "locked": "0",
        "status": "ENABLED",
        "currency": {
          "currencyCode": "AED",
          "currencyName": "United Arab Emirates Dirham",
          "currencySymbol": "د.إ",
          "currencyType": "FIAT"
        }
      }
    ],
    "createdAt": "2026-02-12T10:42:03.644Z",
    "updatedAt": "2026-04-20T10:45:58.120Z"
  }
}
```

If the account does not exist or does not belong to the customer, the request returns `404 Account not found`.

---

## Get Available Currencies

{: .endpoint-desc }
Returns the currencies that can be enabled on the account, with their details.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/currencies
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. |
| `accountId` | string (UUID) | Yes | ID of the account. |

### Response

```
Status: 200 OK
```

Returns the list of currencies that can be enabled on the account.

```json
{
  "success": true,
  "data": [
    {
      "id": "0ff5db18-ad57-4703-a031-08907aa814f1",
      "currencyCode": "AED",
      "currencyName": "United Arab Emirates Dirham",
      "currencySymbol": "د.إ",
      "currencyType": "FIAT",
      "enabled": true
    },
    {
      "id": "cd6a2c1c-d62c-4ea5-983b-82fae5395b2d",
      "currencyCode": "USDT",
      "currencyName": "Tether",
      "currencySymbol": "₮",
      "currencyType": "CRYPTO",
      "enabled": true
    }
  ]
}
```

---

## Possible values

In the account list, `accountProvider` is the name of the provider that holds the account (for example `FUSE`). The single-account response does not include it.

{% include enums/account-values.md %}
