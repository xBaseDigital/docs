---
title: Client Whitelisting
layout: home
permalink: /partner/manage-client/whitelisting
parent: Manage Client Banking
nav_order: 4
---

# Client Whitelisting

Manage the deposit sources (remitters) whitelisted on the customer's account. Whitelist and removal actions are recorded in the customer's audit log as partner actions.

---

## Get Whitelisted Wallets

{: .endpoint-desc }
Returns the whitelisted deposit sources on the account, filterable by asset type, status, and currency.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/whitelisted
Auth:     PARTNER | PARTNER_ADMIN
```

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `assetType` | string | No | Filter by `RemitterAssetType`. |
| `status` | string | No | Filter by `RemitterStatus`. |
| `currencyId` | string | No | Filter by currency. |

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

## Whitelist Crypto Wallet

{: .endpoint-desc }
Whitelists a crypto wallet as an approved deposit source for the account.

### Request

```
Method:   POST
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/crypto-wallets/whitelist
Auth:     PARTNER | PARTNER_ADMIN
```

### Payload

```json
{
  "cryptoWalletAddress": "string",
  "networkId":           "string",
  "currencyId":          "string",
  "label":               "string",
  "type":                "RemitterType",
  "firstName":           "string",
  "lastName":            "string",
  "dob":                 "YYYY-MM-DD",
  "address":             { },
  "metadata":            { }
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `cryptoWalletAddress` | string | Yes | Wallet address. 26–100 characters. |
| `networkId` | string (UUID) | Yes | Network the wallet is on. |
| `currencyId` | string | Yes | Currency associated with the wallet. |
| `label` | string | No | Friendly label. Max 200 chars. |
| `type` | string | No | `RemitterType`. |
| `firstName` / `lastName` | string | No | Owner name. Max 100 chars each. |
| `dob` | string | No | Date of birth, ISO 8601. |
| `address` | object | No | Owner address. |
| `metadata` | object | No | Additional details. |

### Response

```
Status: 201 Created
```

```json
{
  "success": true,
  "data": { }
}
```

---

## Whitelist Fiat Account

{: .endpoint-desc }
Whitelists a fiat bank account as an approved deposit source for the account.

### Request

```
Method:   POST
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/fiat-accounts/whitelist
Auth:     PARTNER | PARTNER_ADMIN
```

### Payload

```json
{
  "iban":       "string",
  "currencyId": "string",
  "type":       "RemitterType",
  "name":       "string",
  "firstName":  "string",
  "lastName":   "string",
  "label":      "string",
  "address":    { }
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `iban` | string | Yes | IBAN, 10–34 characters. |
| `currencyId` | string | Yes | Currency associated with the account. |
| `type` | string | No | `RemitterType`. Determines whether business or individual name fields are required. |
| `name` | string | Conditional | Required when `type=BUSINESS`. Max 200 chars. |
| `firstName` / `lastName` | string | Conditional | Required when `type` is not `BUSINESS`. Max 100 chars each. |
| `label` | string | No | Friendly label. Max 200 chars. |
| `address` | object | No | Owner address. When provided, `line1` and `country` are required. |

### Response

```
Status: 201 Created
```

```json
{
  "success": true,
  "data": { }
}
```

---

## Remove Whitelisted Wallet

{: .endpoint-desc }
Removes a whitelisted deposit source from the account. Applies to both crypto and fiat remitters.

### Request

```
Method:   DELETE
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/crypto-wallets/whitelisted/:remitterId
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `remitterId` | string (UUID) | Yes | ID of the whitelisted remitter to remove. |

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
