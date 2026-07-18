---
title: Client Beneficiaries
layout: home
permalink: /partner/manage-client/beneficiaries
parent: Manage Client Banking
nav_order: 3
---

# Client Beneficiaries

Manage payout beneficiaries on an account belonging to the customer. Create, update, confirm, and remove actions are recorded in the customer's audit log as partner actions.

{: .note }
Note the path spelling: **update** uses `/beneficiary/:beneficiaryId` (singular), while **confirm** and **remove** use `/beneficiaries/:beneficiaryId` (plural).

---

## Get Beneficiary List

{: .endpoint-desc }
Returns a paginated list of beneficiaries on the account.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/beneficiary
Auth:     PARTNER | PARTNER_ADMIN
```

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `page` | integer | No | Page number. Defaults to `1`. |
| `limit` | integer | No | Page size. Defaults to `10`. |
| `assetType` | string | No | Filter by `BeneficiaryAssetType` (`FIAT` or `CRYPTO`). |

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

---

## Create Beneficiary

{: .endpoint-desc }
Adds a new beneficiary to the account. Supports both fiat and crypto beneficiaries.

### Request

```
Method:   POST
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/beneficiary
Auth:     PARTNER | PARTNER_ADMIN
```

### Field Description

Core fields are listed below. Additional bank-scheme fields (`sortCode`, `routingTransitNumber`, `transitNumber`, `bankStateBranch`, `ifsc`, `accountNumber`, `routingNumber`, `pixKey`, `clabe`, `nin`, `idType`, `idNumber`, and others) are accepted and, where applicable, merged into the beneficiary `metadata`.

| Field | Type | Required | Description |
|---|---|---|---|
| `assetType` | string | No | `FIAT` or `CRYPTO`. Defaults to fiat behaviour when omitted. |
| `name` | string | Conditional | Beneficiary name. One of `name`, `firstName`, or `companyName` is required. |
| `firstName` / `lastName` | string | Conditional | Individual name parts. `lastName` is required when `firstName` is set (non-business). Max 100 chars each. |
| `companyName` | string | Conditional | Company name for business beneficiaries. Max 35 chars. |
| `displayName` | string | No | Defaults to `name` when omitted. |
| `reference` | string | Yes | Payment reference. Max 200 chars. |
| `type` | string | No | `BeneficiaryType` (e.g. `INDIVIDUAL`, `BUSINESS`). |
| `transactionType` | string | No | `BeneficiaryTransactionType` (e.g. `LOCAL`, `INTERNATIONAL`). |
| `currencyCode` | string | Yes | 3–5 character uppercase currency code. |
| `countryCode` | string | No | ISO 3166-1 alpha-2, uppercase. |
| `bankCountryCode` | string | No | ISO 3166-1 alpha-2, uppercase. |
| `iban` | string | Conditional | IBAN for fiat beneficiaries. |
| `bicSwiftCode` / `swiftCode` | string | No | BIC/SWIFT code. `swiftCode` is accepted as an alias. |
| `correspondentBic` | string | No | Correspondent BIC. |
| `cryptoWalletAddress` | string | Conditional | Required when `assetType=CRYPTO`. |
| `networkId` | string (UUID) | Conditional | Required when `assetType=CRYPTO`. |
| `address` | object | Conditional | Required for international fiat transfers (`line1` and `country`). |
| `email` | string | No | Beneficiary email. |
| `source` | string | No | Source of the beneficiary. |
| `metadata` | object | No | Additional scheme-specific fields. |

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

## Update Beneficiary

{: .endpoint-desc }
Updates editable fields on an existing beneficiary.

### Request

```
Method:   PUT
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/beneficiary/:beneficiaryId
Auth:     PARTNER | PARTNER_ADMIN
```

### Payload

```json
{
  "name":        "string",
  "displayName": "string",
  "countryCode": "string",
  "email":       "string",
  "source":      "string"
}
```

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

## Confirm Beneficiary

{: .endpoint-desc }
Confirms (activates) or rejects a pending beneficiary. When `confirmed` is `false`, the beneficiary is removed.

### Request

```
Method:   PUT
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/beneficiaries/:beneficiaryId
Auth:     PARTNER | PARTNER_ADMIN
```

### Payload

```json
{
  "confirmed": true
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `confirmed` | boolean | Yes | `true` confirms the beneficiary; `false` removes it. |

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

---

## Remove Beneficiary

{: .endpoint-desc }
Deletes a beneficiary from the account.

### Request

```
Method:   DELETE
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/beneficiaries/:beneficiaryId
Auth:     PARTNER | PARTNER_ADMIN
```

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

---

## Get Payout Config

{: .endpoint-desc }
Returns the payout configuration for a beneficiary, scoped to an account currency.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/beneficiary/:beneficiaryId/payout-config
Auth:     PARTNER | PARTNER_ADMIN
```

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `accountCurrencyId` | string | Yes | Account currency to resolve the payout configuration for. |

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
