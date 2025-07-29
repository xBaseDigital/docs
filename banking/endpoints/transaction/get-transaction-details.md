---
title: Get Transaction Details
layout: home
permalink: /banking/endpoints/transaction/get-transaction-details
parent: Transaction
nav_order: 2
---

## Get Transaction Details

{: .endpoint-desc }
This endpoint retrieves detailed information about a specific transaction identified by the transactionId for a given account. It provides details about the transaction status, recipient, and associated risks.

### Request

```
Method: GET
URL: {{baseUrl}}/accounts/:accountId/transactions/:transactionId
Path Parameters:
accountId - The unique identifier of the account (e.g., 7fb7c416-4526-44c2-8e57-30b6198af5e3)
transactionId - The unique identifier of the transaction (e.g., 006cd6a4-59ff-4ff2-b5de-759a57ee35f7)
Authentication: Requires authentication.
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
    "id": "006cd6a4-59ff-4ff2-b5de-759a57ee35f7",
    "externalId": "E1GPJ64KZIB0",
    "assetType": "FIAT",
    "accountCurrencyId": "e45d8f69-cbcf-455d-8512-b0017d4e3941",
    "accountCurrency": {
      "id": "e45d8f69-cbcf-455d-8512-b0017d4e3941",
      "banking_provider_account_id": "b01fb443-bc0e-4d4a-abec-6bef3497ac95",
      "currencyId": "561ddd4b-3016-4ef1-8db0-1d3ac8ff4d96",
      "balance": "19985",
      "available": "19886",
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
        "account_name": "Account balance",
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
    "amount": 14,
    "currencyId": "561ddd4b-3016-4ef1-8db0-1d3ac8ff4d96",
    "currency": {
      "id": "561ddd4b-3016-4ef1-8db0-1d3ac8ff4d96",
      "currencyCode": "GBP",
      "currencySymbol": "£",
      "currencyFlag": "https://statics.xbd.money/images/flags/gbp.png"
    },
    "status": "PROCESSING",
    "type": "DEBIT",
    "paymentMethod": "LOCAL",
    "paymentType": "PAYMENT_TYPE_UK_FASTERPAYMENTS",
    "riskScore": 0,
    "riskScoringResult": {
      "id": "903b5fca-6e9c-458d-8048-f20faa8bfabe",
      "score": 0,
      "dryScore": 0,
      "matchedRulesJson": [
        {
          "id": "67583483572f5449dc1ec47b",
          "name": "AFN0-col-app-fra-net-sta-WWTN",
          "score": 0,
          "stage": "pre",
          "title": "Collect applicant fraud network statistics",
          "action": "score",
          "dryRun": false,
          "revision": 1,
          "preScoringRunnerType": "kytTxnApplicantFraudNetworks"
        },
        {
          "id": "675833ba8796e63b0f9fa4a0",
          "name": "TXDE9-fin-tra-fra-che-ewel",
          "score": 0,
          "stage": "pre",
          "title": "Finance transaction fraud check",
          "action": "score",
          "dryRun": false,
          "revision": 1,
          "preScoringRunnerType": "behavioralEvents"
        }
      ],
      "action": "score",
      "ruleCnt": 61,
      "dryRunRuleCnt": 3,
      "transactionId": "006cd6a4-59ff-4ff2-b5de-759a57ee35f7"
    },
    "createdAt": "2025-04-23T09:52:12.914Z",
    "updatedAt": "2025-04-23T09:52:25.072Z"
  }
}
```

- `status`: A boolean indicating the success of the request.
- `data`: An object containing transaction details:
  - `highRisk`: A boolean indicating if the transaction is high risk.
  - `refunded`: A boolean indicating if the transaction has been refunded.
  - `id`: The unique identifier for the transaction.
  - `externalId`: An external reference ID for the transaction.
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
    - `id`: The identifier.
    - `IBAN`: The IBAN (can be null).
    - `bic_swift_code`: The BIC/SWIFT code.
    - `correspondent_bic`: The correspondent BIC.
    - `beneficiary`: The beneficiary.
    - `sort_code`: The sort code.
    - `account_number`: The account number.
    - `account_name`: The name on the account.
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
  - `amount`: The amount of the transaction.
  - `currencyId`: The identifier for the currency.
  - `currency`: An object containing:
    - `id`: The unique identifier for the currency.
    - `currencyCode`: The ISO currency code.
    - `currencySymbol`: The currency symbol.
    - `currencyFlag`: A URL to the currency flag image.
  - `status`: The current status of the transaction (e.g., “PROCESSING”).
  - `type`: The type of transaction (e.g., “DEBIT”).
  - `paymentMethod`: The payment method (e.g., “LOCAL”).
  - `paymentType`: The specific payment type (e.g., “PAYMENT_TYPE_UK_FASTERPAYMENTS”).
  - `riskScore`: The risk score associated with the transaction.
  - `riskScoringResult`: An object containing risk scoring details:
    - `id`: The unique identifier for the risk scoring result.
    - `score`: The risk score.
    - `dryScore`: The dry run risk score.
    - `matchedRulesJson`: An array of objects each with:
      - `id`: The rule ID.
      - `name`: The rule name.
      - `score`: The score for the rule.
      - `stage`: The evaluation stage.
      - `title`: The rule title.
      - `action`: The action taken.
      - `dryRun`: Whether it was a dry run.
      - `revision`: The revision number.
      - `preScoringRunnerType`: The type of pre-scoring runner.
    - `action`: The action taken based on the risk score.
    - `ruleCnt`: The total number of rules evaluated.
    - `dryRunRuleCnt`: The number of dry run rules evaluated.
    - `transactionId`: The identifier of the transaction.
  - `createdAt`: The timestamp when the transaction was created.
  - `updatedAt`: The timestamp of the last update to the transaction.
