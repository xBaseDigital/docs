---
title: Client Whitelisting
layout: endpoint
try_it:
  - op: getClientWhitelistedWallets
    heading: "Get Whitelisted Wallets"
  - op: whitelistClientCryptoWallet
    heading: "Whitelist Crypto Wallet"
  - op: whitelistClientFiatAccount
    heading: "Whitelist Fiat Account"
  - op: removeClientWhitelistedWallet
    heading: "Remove Whitelisted Wallet"
try_it_spec: /assets/openapi/partner.json
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
| `assetType` | string | No | Filter by asset type: `FIAT` or `CRYPTO`. |
| `status` | string | No | Filter by status: `WHITELISTED` or `NON_WHITELISTED`. |
| `currencyId` | string | No | Filter by currency. |

{: .note }
When `assetType` and `status` are omitted, the list defaults to `CRYPTO` remitters with status `WHITELISTED`.

### Response

```
Status: 200 OK
```

```json
{
  "success": true,
  "data": [
    {
      "id": "b7c1f0a2-3d4e-4f5a-8b6c-9d0e1f2a3b4c",
      "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
      "assetType": "CRYPTO",
      "status": "WHITELISTED",
      "isWhitelisted": true,
      "label": "Treasury cold wallet",
      "type": "INDIVIDUAL",
      "firstName": "Ahmed",
      "lastName": "Khan",
      "cryptoWalletAddress": "0xAE2Aa32105185B00508fF6f477c3Eb1D75BA8dDa",
      "networkId": "6a48b281-c3c4-4a78-aa1f-f153d6b5ae71",
      "currencyId": "cd6a2c1c-d62c-4ea5-983b-82fae5395b2d",
      "currency": {
        "currencyCode": "USDT",
        "currencyName": "Tether",
        "currencyType": "CRYPTO"
      },
      "createdAt": "2026-05-01T09:00:00.000Z"
    }
  ]
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
| `type` | string | No | `INDIVIDUAL` or `BUSINESS`. |
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
  "data": {
    "id": "b7c1f0a2-3d4e-4f5a-8b6c-9d0e1f2a3b4c",
    "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
    "assetType": "CRYPTO",
    "status": "WHITELISTED",
    "isWhitelisted": true,
    "label": "Treasury cold wallet",
    "type": "INDIVIDUAL",
    "cryptoWalletAddress": "0xAE2Aa32105185B00508fF6f477c3Eb1D75BA8dDa",
    "networkId": "6a48b281-c3c4-4a78-aa1f-f153d6b5ae71",
    "currencyId": "cd6a2c1c-d62c-4ea5-983b-82fae5395b2d",
    "createdAt": "2026-05-01T09:00:00.000Z"
  }
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
| `type` | string | No | `INDIVIDUAL` or `BUSINESS`. Determines whether business or individual name fields are required. |
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
  "data": {
    "id": "c8d2e1b3-4e5f-4a6b-9c7d-0e1f2a3b4c5d",
    "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
    "assetType": "FIAT",
    "status": "WHITELISTED",
    "isWhitelisted": true,
    "label": "Supplier account",
    "type": "BUSINESS",
    "accountNumber": null,
    "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
    "currency": {
      "currencyCode": "AED",
      "currencyName": "United Arab Emirates Dirham",
      "currencyType": "FIAT"
    },
    "createdAt": "2026-05-01T09:05:00.000Z"
  }
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
  "data": {
    "id": "b7c1f0a2-3d4e-4f5a-8b6c-9d0e1f2a3b4c",
    "status": "REMOVED"
  }
}
```

## Possible values

{% include enums/whitelist-values.md %}
