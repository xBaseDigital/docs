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

`data` is an array of beneficiaries for the account (page and limit control the window).

```json
{
  "success": true,
  "data": [
    {
      "id": "39aa9cab-c45a-41f6-92d8-5aff67916fcf",
      "recipientId": "8a42e9ff-ac35-4b47-b605-5aca4ac0bc78",
      "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
      "name": "Acme Corp",
      "displayName": "Acme Corp",
      "reference": "Invoice#123",
      "type": "BUSINESS",
      "status": "ACTIVE",
      "assetType": "FIAT",
      "iban": "GB29NWBK60161331926812",
      "bicSwiftCode": "NWBKGB2L",
      "correspondentBic": null,
      "bankingId": null,
      "bankingIdType": null,
      "accountNumber": null,
      "routingNumber": null,
      "currencyCode": "AED",
      "countryCode": null,
      "bankCountryCode": null,
      "transactionType": "LOCAL",
      "addressId": "f00e6da2-1d30-40ea-9593-7ecd3f9bb10e",
      "address": {
        "line1": "123 Business Rd",
        "line2": "Suite 100",
        "country": "AG"
      },
      "cryptoWalletAddress": null,
      "networkId": null
    }
  ]
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
  "data": {
    "id": "39aa9cab-c45a-41f6-92d8-5aff67916fcf",
    "recipientId": "8a42e9ff-ac35-4b47-b605-5aca4ac0bc78",
    "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
    "name": "Acme Corp",
    "displayName": "Acme Corp",
    "reference": "Invoice#123",
    "type": "BUSINESS",
    "status": "PENDING",
    "assetType": "FIAT",
    "iban": "GB29NWBK60161331926812",
    "bicSwiftCode": "NWBKGB2L",
    "currencyCode": "AED",
    "transactionType": "LOCAL",
    "metadata": {
      "bankName": "NatWest"
    },
    "cryptoWalletAddress": null,
    "networkId": null
  }
}
```

New beneficiaries are created in `PENDING` status and must be confirmed before they can receive payouts.

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
  "data": {
    "id": "39aa9cab-c45a-41f6-92d8-5aff67916fcf",
    "name": "Acme Corp",
    "displayName": "Acme Corporation",
    "reference": "Invoice#123",
    "type": "BUSINESS",
    "status": "ACTIVE",
    "assetType": "FIAT",
    "currencyCode": "AED",
    "countryCode": "GB",
    "updatedAt": "2026-07-15T12:01:02.479Z"
  }
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
  "data": {
    "id": "39aa9cab-c45a-41f6-92d8-5aff67916fcf",
    "name": "Acme Corp",
    "status": "ACTIVE",
    "assetType": "FIAT",
    "currencyCode": "AED"
  }
}
```

When `confirmed` is `false`, the beneficiary is removed and `data` reflects the deletion result.

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
  "data": {
    "id": "39aa9cab-c45a-41f6-92d8-5aff67916fcf",
    "status": "DELETED"
  }
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

`data` contains the provider-specific payout configuration for the beneficiary, including the supported payment methods, purpose codes, and any per-scheme limits. Exact fields depend on the account's banking provider.

```json
{
  "success": true,
  "data": {
    "beneficiaryId": "39aa9cab-c45a-41f6-92d8-5aff67916fcf",
    "accountCurrencyId": "e2149078-9be5-46f8-9ec1-4c742314a170",
    "currencyCode": "AED",
    "paymentMethods": ["LOCAL", "SWIFT"],
    "purposeCodes": ["salaries", "goods_bought", "professional"],
    "limits": {
      "min": "1.00",
      "max": "1000000.00"
    }
  }
}
```
