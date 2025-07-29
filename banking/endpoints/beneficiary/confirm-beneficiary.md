---
title: Confirm Beneficiary
layout: home
permalink: /banking/endpoints/beneficiary/confirm-beneficiary
parent: Beneficiary
nav_order: 2
---

## Confirm Beneficiary

{: .endpoint-desc }
This endpoint allows you to update the confirmation status of a specific beneficiary associated with a user account. Use this endpoint to confirm or update a beneficiary's verification status after they have been validated.

### Request

```
Method: PUT
URL: /v1/accounts/:accountId/beneficiaries/:beneficiaryId
Path Parameters: 
  accountId - The unique identifier of the account (e.g., 36abacac-2aa2-4eb7-b96e-870364065c05)
  beneficiaryId - The unique identifier of the beneficiary (e.g., 7188121ac-2aa2-4eb7-b96e-870364065c05)
Authentication: Requires authentication.
Content-Type: application/json
```

### Request Body

The request body is a JSON object with the following fields:

```json
{
  "confirmed": true
}
```

**Parameters:**
- `confirmed` (boolean, required) - Set to `true` to confirm the beneficiary, `false` to unconfirm

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 200 and a JSON object containing the following structure:

```json
{
    "success": true,
    "data": {
        "id": "01e17885-ee59-4f4e-99a4-739cb1c8e3f3",
        "recipientId": "0f624785-8dd1-4c6a-9a5d-7446e59e03a7",
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "name": "BeneficiaryName",
        "displayName": "BeneficiaryName",
        "reference": "Sample Reference",
        "iban": "IB00000000AN000",
        "bicSwiftCode": "SWIFT0000",
        "correspondentBic": null,
        "sortCode": null,
        "accountNumber": null,
        "type": "BUSINESS",
        "currencyCode": "AED",
        "countryCode": null,
        "bankCountryCode": null,
        "status": "ACTIVE",
        "createdAt": "2025-07-29T06:11:55.717Z",
        "updatedAt": "2025-07-29T08:38:21.180Z",
        "transactionType": "INTERNATIONAL",
        "addressId": "34a355a6-55de-43c3-9938-dc11587b260e",
        "address": null
    }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `data` | object | The beneficiary data object |

**Beneficiary Data Object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the beneficiary |
| `recipientId` | string | Unique identifier of the recipient |
| `accountId` | string | Account ID associated with the beneficiary |
| `name` | string | Name of the beneficiary |
| `displayName` | string | Display name of the beneficiary |
| `reference` | string | Reference text for the beneficiary |
| `iban` | string | International Bank Account Number |
| `bicSwiftCode` | string | BIC/SWIFT code of the beneficiary's bank |
| `correspondentBic` | string \| null | Correspondent BIC code (if applicable) |
| `sortCode` | string \| null | Bank sort code (if applicable) |
| `accountNumber` | string \| null | Bank account number (if applicable) |
| `type` | string | Type of beneficiary (e.g., "BUSINESS", "INDIVIDUAL") |
| `currencyCode` | string | Currency code (ISO 4217 format, e.g., "AED") |
| `countryCode` | string \| null | Country code (if applicable) |
| `bankCountryCode` | string \| null | Bank's country code (if applicable) |
| `status` | string | Current status ("ACTIVE", "INACTIVE", etc.) |
| `createdAt` | string | Timestamp when the beneficiary was created (ISO 8601) |
| `updatedAt` | string | Timestamp when the beneficiary was last updated (ISO 8601) |
| `transactionType` | string | Type of transaction ("INTERNATIONAL", "DOMESTIC") |
| `addressId` | string | Unique identifier of the associated address |
| `address` | object \| null | Address details (if included) |