---
title: Create Payout Request
layout: home
permalink: /banking/endpoints/payout/create-payout-request
parent: Payout
nav_order: 1
---

## Create Payout Request

{: .endpoint-desc }
This endpoint initiates a payout to a specified beneficiary from a given account. It provides details about the payout transaction and its status.

### Request

```
Method: POST
URL: {{baseUrl}}/accounts/:accountId/payout
Path Parameters : accountId - The unique identifier of the account (e.g., 36abacac-2aa2-4eb7-b96e-870364065c05)
Authentication: Requires authentication.
```

### Request Body

```json
{
  "beneficiaryId": "36d94ef0-148a-4b76-865a-47c6449b4c2b",
  "amount": "12",
  "currency": "GBP"
}
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 200 and a JSON object containing the following structure:

```json
{
  "status": true,
  "data": {
    "highRisk": false,
    "refunded": false,
    "id": "5c30fb3b-558c-40c0-bd27-abc658872377",
    "assetType": "FIAT",
    "accountCurrencyId": "e45d8f69-cbcf-455d-8512-b0017d4e3941",
    "accountCurrency": {
      "id": "e45d8f69-cbcf-455d-8512-b0017d4e3941",
      "banking_provider_account_id": "b01fb443-bc0e-4d4a-abec-6bef3497ac95",
      "currencyId": "561ddd4b-3016-4ef1-8db0-1d3ac8ff4d96",
      "balance": "19985",
      "available": "19822",
      "accountDetailsId": "88c7fa4f-a8d7-4589-883e-4f1a4bb36dda",
      "accountId": "7fb7c416-4526-44c2-8e57-30b6198af5e3",
      "accountDetails": {
        "id": "88c7fa4f-a8d7-4589-883e-4f1a4bb36dda",
        "IBAN": "dummyIban",
        "bic_swift_code": "",
        "correspondent_bic": "",
        "beneficiary": null,
        "sort_code": "12-12-12",
        "account_number": "dummyAccountNumber",
        "addressId": null
      },
      "currency": {
        "id": "561ddd4b-3016-4ef1-8db0-1d3ac8ff4d96",
        "currencyCode": "GBP",
        "currencySymbol": "£",
        "currencyFlag": "https://statics.xbd.money/images/flags/gbp.png"
      }
    },
    "recipientId": "36d94ef0-148a-4b76-865a-47c6449b4c2b",
    "recipient": {
      "id": "36d94ef0-148a-4b76-865a-47c6449b4c2b",
      "recipientId": "8m9jjkhw0",
      "accountId": "7fb7c416-4526-44c2-8e57-30b6198af5e3",
      "name": "Mr Lance Henry",
      "displayName": "Mr Lance Henry",
      "reference": "Ben",
      "iban": null,
      "bicSwiftCode": null,
      "correspondentBic": null,
      "sortCode": "302414",
      "accountNumber": "33264517",
      "type": "INDIVIDUAL",
      "currencyCode": "GBP",
      "countryCode": "GB",
      "bankCountryCode": "GB",
      "status": "ACTIVE",
      "createdAt": "2025-04-16T06:19:39.948Z",
      "updatedAt": "2025-04-16T06:19:43.797Z"
    },
    "amount": 9,
    "currencyId": "561ddd4b-3016-4ef1-8db0-1d3ac8ff4d96",
    "currency": {
      "id": "561ddd4b-3016-4ef1-8db0-1d3ac8ff4d96",
      "currencyCode": "GBP",
      "currencySymbol": "£",
      "currencyFlag": "https://statics.xbd.money/images/flags/gbp.png"
    },
    "status": "PENDING",
    "type": "DEBIT",
    "paymentMethod": "LOCAL",
    "paymentType": "PAYMENT_TYPE_UK_FASTERPAYMENTS",
    "riskScore": 0,
    "createdAt": "2025-04-28T04:23:09.439Z",
    "updatedAt": "2025-04-28T04:23:10.046Z"
  }
}
```

- `status`: A boolean indicating the success of the request.
- `data`: An object containing payout request details:
  - `highRisk`: A boolean indicating if the transaction is high risk.
  - `refunded`: A boolean indicating if the transaction has been refunded.
  - `id`: The unique identifier for the payout request.
  - `assetType`: The type of asset (e.g., “FIAT”).
  - `accountCurrencyId`: The identifier for the account currency.
  - `accountCurrency`: An object containing account currency details:
    - `id`: The unique identifier for the account currency.
    - `banking_provider_account_id`: The identifier for the banking provider account.
    - `currencyId`: The identifier for the currency.
    - `balance`: The current balance of the account in the currency.
    - `available`: The available balance of the account in the currency.
  - `accountDetailsId`: The identifier for the account details.
  - `accountId`: The identifier for the account.
  - `accountDetails`: An object containing:
    - `id`: The identifier of the account details object.
    - `IBAN`: The IBAN of the account (can be null).
    - `bic_swift_code`: The BIC/SWIFT code.
    - `correspondent_bic`: The correspondent BIC.
    - `beneficiary`: The beneficiary name.
    - `sort_code`: The sort code.
    - `account_number`: The account number.
    - `addressId`: The address ID (can be null).
  - `currency`: An object containing:
    - `id`: The unique identifier for the currency.
    - `currencyCode`: The ISO currency code.
    - `currencySymbol`: The symbol of the currency.
    - `currencyFlag`: A URL to the currency flag image.
  - `recipientId`: The identifier for the recipient.
  - `recipient`: An object containing recipient details:
    - `id`: The unique identifier for the recipient.
    - `recipientId`: An external identifier for the recipient.
    - `accountId`: The account ID associated with the recipient.
    - `name`: The name of the recipient.
    - `displayName`: A display name for the recipient.
    - `reference`: A reference for the recipient (can be null).
    - `iban`: The IBAN of the recipient (can be null).
    - `bicSwiftCode`: The BIC/SWIFT code (can be null).
    - `correspondentBic`: The correspondent BIC (can be null).
    - `sortCode`: The sort code.
    - `accountNumber`: The account number.
    - `type`: The type of recipient (e.g., “INDIVIDUAL”).
    - `currencyCode`: The currency code associated with the recipient.
    - `countryCode`: The country code of the recipient.
    - `bankCountryCode`: The bank country code of the recipient.
    - `status`: The current status of the recipient.
    - `createdAt`: The timestamp when the recipient was created.
    - `updatedAt`: The timestamp of the last update to the recipient.
  - `amount`: The amount of the payout.
  - `currencyId`: The identifier for the currency.
  - `currency`: An object containing:
    - `id`: The unique identifier for the currency.
    - `currencyCode`: The ISO currency code.
    - `currencySymbol`: The currency symbol.
    - `currencyFlag`: A URL to the currency flag image.
  - `status`: The current status of the payout (e.g., “PENDING”).
  - `type`: The type of transaction (e.g., “DEBIT”).
  - `paymentMethod`: The payment method (e.g., “LOCAL”).
  - `paymentType`: The specific payment type (e.g., “PAYMENT_TYPE_UK_FASTERPAYMENTS”).
  - `riskScore`: The risk score associated with the transaction.
  - `createdAt`: The timestamp when the payout was created.
  - `updatedAt`: The timestamp of the last update to the payout.
