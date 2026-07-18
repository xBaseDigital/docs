---
title: Client Accounts
layout: home
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
| `status` | string | No | Filter accounts by `AccountStatus` (e.g. `ACTIVE`). |

### Response

```
Status: 200 OK
```

```json
{
  "success": true,
  "data": [ ]
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

Returns the formatted `AccountDTO`. If the account does not exist or does not belong to the customer, the request returns `404 Account not found`.

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

Returns the list of available currencies for the account.

---

## Enable Account Currency

{: .endpoint-desc }
Creates and enables a currency on the account. This action is recorded in the customer's audit log as a partner action.

### Request

```
Method:   PATCH
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/currencies/:currencyCode
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. |
| `accountId` | string (UUID) | Yes | ID of the account. |
| `currencyCode` | string | Yes | 3–5 character uppercase currency code (e.g. `USD`, `USDT`). |

### Payload

```json
{
  "status":    "AccountCurrencyStatus",
  "networkId": "string"
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | No | Target `AccountCurrencyStatus` for the currency. |
| `networkId` | string (UUID) | No | Network to enable the currency on (for multi-network assets). |

### Response

```
Status: 200 OK
```

```json
{
  "success": true,
  "data": { }
}
```
