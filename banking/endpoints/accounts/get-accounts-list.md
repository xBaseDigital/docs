---
title: Get Accounts List
layout: home
permalink: /banking/endpoints/accounts/get-accounts-list
parent: Accounts
nav_order: 1
---

## Get List of Accounts

{: .endpoint-desc }
This endpoint retrieves a list of accounts associated with the authenticated user. It provides detailed information about each account, including customer details, account status, and currency information.

### Request

```
Method: GET
URL: {{baseUrl}}/v1/customers/:customerId/accounts/
Authentication: Requires authentication (see collection variables for keyId and privateKey).
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 200 and a JSON object containing the following structure:

```json
[
  {
    "id": "385dec3a-9bfe-4072-8733-7872ef350e71",
    "customerId": "b10a855a-76a9-4b7d-9628-175a55326473",
    "customer": {
      "isFeeProfileAvailable": true,
      "id": "b10a855a-76a9-4b7d-9628-175a55326473",
      "customerType": "BUSINESS",
      "customerAddressId": "98cc9162-180d-480f-8509-6c4b79515108",
      "customerAddress": {
        "id": "98cc9162-180d-480f-8509-6c4b79515108",
        "line1": "123 Main St",
        "line2": null,
        "line3": "Apt 4B",
        "line4": null,
        "countyState": "NY",
        "postCode": "10001",
        "country": "USA"
      },
      "terms": true,
      "privacyPolicy": true,
      "accountApplicationStatus": "APPROVED",
      "bankingEnabledAt": "2025-07-24T04:14:18.079Z",
      "accountActivationFeePaid": true,
      "verificationResult": "APPROVED",
      "providerVerificationResult": "PENDING",
      "riskEvaluation": null,
      "riskLevel": null,
      "createdAt": "2025-06-28T08:24:52.566Z",
      "updatedAt": "2025-11-09T12:39:29.346Z",
      "lastLogin": null,
      "feeProfileId": "1e7f5444-0f82-42ca-8c55-4bae303016ef",
      "Referrals": null,
      "userId": "fdda84df-588f-49bf-856c-fb3d23ef7f7f",
      "productActivations": {}
    },
    "accountProvider": "4",
    "onboardingMode": "AUTOMATED",
    "status": "ACTIVE",
    "type": "PERSONAL",
    "externalId": "0197c5c8-cdcd-73d0-a517-09090bb28f14",
    "correlationId": "0197c5c8-cdcd-73d0-a517-09090bb28f14",
    "currencyId": "9110cbef-78e4-485a-b3f8-27e6b51b83c3",
    "baseCurrency": {
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
    "accountCurrencies": [
      {
        "id": "969f1f0d-2692-4d8f-8eaa-5f74498be498",
        "banking_provider_account_id": "0197c5c8-cef6-7341-9c2e-c7b4effbe4d1",
        "currencyId": "9110cbef-78e4-485a-b3f8-27e6b51b83c3",
        "type": "FIAT",
        "balance": "667",
        "available": "544",
        "locked": "0",
        "accountDetailsId": "d2dec439-b582-44fc-a94c-8543cc6ffc38",
        "cryptoDetailsId": null,
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "accountDetails": {
          "id": "d2dec439-b582-44fc-a94c-8543cc6ffc38",
          "IBAN": null,
          "bic_swift_code": null,
          "correspondent_bic": null,
          "beneficiary": null,
          "sort_code": null,
          "routing_number": "bMTDEgAJzWgC",
          "account_number": "iovMVCvWeOkn9r0G6RC",
          "account_name": "Business Account USD",
          "addressId": null
        },
        "currency": {
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
        "status": "ENABLED",
        "createdAt": "2025-10-29T09:06:16.148Z",
        "updatedAt": "2025-12-04T09:36:06.526Z"
      }
    ],
    "metadata": {
      "currency": "USD",
      "event_id": "0197c5c8-cef6-7341-9c2e-c7b4effbe4d1",
      "customer_id": "0197c5c8-cdcd-73d0-a517-09090bb28f14",
      "account_name": "Suzuki USD",
      "account_type": "virtual",
      "event_version": 1,
      "zeroFeePayout": false
    },
    "dueAmount": "22209.67741935483870967742",
    "createdAt": "2025-07-01T11:39:21.423Z",
    "updatedAt": "2025-07-25T07:45:05.491Z",
    "beneficiaries": [
      {
        "id": "8c6285e4-5218-4bc2-9495-2585e74ab366",
        "recipientId": "37508f5a-8d27-4e8e-bbef-51e3c5bfa1ec",
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "name": "John Doe",
        "displayName": "John Doe",
        "reference": "Invoice 123",
        "type": "INDIVIDUAL",
        "status": "ACTIVE",
        "assetType": "FIAT",
        "iban": "GB36SPPV23188447902930",
        "bicSwiftCode": "SPPVGB2LXXX",
        "correspondentBic": null,
        "bankingId": null,
        "bankingIdType": null,
        "accountNumber": null,
        "routingNumber": null,
        "currencyCode": "AED",
        "countryCode": null,
        "bankCountryCode": null,
        "transactionType": "INTERNATIONAL",
        "addressId": "1ff71d7d-9983-48b7-9cda-4410829ff4ca",
        "address": {
          "id": "1ff71d7d-9983-48b7-9cda-4410829ff4ca",
          "line1": "123 Street Name",
          "line2": "Apt 1",
          "line3": null,
          "line4": null,
          "countyState": null,
          "postCode": null,
          "country": "AD"
        },
        "cryptoWalletAddress": null,
        "networkId": null
      }
    ]
        "bicSwiftCode": "SPPVGB2LXXX",
        "correspondentBic": null,
        "bankingId": null,
        "bankingIdType": null,
        "accountNumber": null,
        "routingNumber": null,
        "currencyCode": "AED",
        "countryCode": null,
        "bankCountryCode": null,
        "transactionType": "INTERNATIONAL",
        "addressId": "e29c1f67-1b47-4ed4-9b48-66c34777170f",
        "address": {
          "id": "e29c1f67-1b47-4ed4-9b48-66c34777170f",
          "line1": "101 Road",
          "line2": null,
          "line3": null,
          "line4": null,
          "countyState": null,
          "postCode": null,
          "country": "GB"
        },
        "cryptoWalletAddress": null,
        "networkId": null
      },
      {
        "id": "01e17885-ee59-4f4e-99a4-739cb1c8e3f3",
        "recipientId": "0f624785-8dd1-4c6a-9a5d-7446e59e03a7",
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "name": "Charlie Brown",
        "displayName": "Charlie Brown",
        "reference": "Goods Payment",
        "type": "BUSINESS",
        "status": "ACTIVE",
        "assetType": "FIAT",
        "iban": "IB00000000AN000",
        "bicSwiftCode": "SWIFT0000",
        "correspondentBic": null,
        "bankingId": null,
        "bankingIdType": null,
        "accountNumber": null,
        "routingNumber": null,
        "currencyCode": "AED",
        "countryCode": null,
        "bankCountryCode": null,
        "transactionType": "INTERNATIONAL",
        "addressId": "34a355a6-55de-43c3-9938-dc11587b260e",
        "address": {
          "id": "34a355a6-55de-43c3-9938-dc11587b260e",
          "line1": "202 Lane",
          "line2": "",
          "line3": "",
          "line4": null,
          "countyState": null,
          "postCode": null,
          "country": "US"
        },
        "cryptoWalletAddress": null,
        "networkId": null
      },
      {
        "id": "1d50824b-ac32-4a6b-ab37-902e6ff4cfff",
        "recipientId": "da7e9262-49e3-4174-b86e-eb30741e1445",
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "name": "David Miller",
        "displayName": "David Miller",
        "reference": "Payment Ref",
        "type": "INDIVIDUAL",
        "status": "ACTIVE",
        "assetType": "FIAT",
        "iban": "GB29NWBK60161331926819",
        "bicSwiftCode": "NWBKGB2L",
        "correspondentBic": null,
        "bankingId": null,
        "bankingIdType": null,
        "accountNumber": null,
        "routingNumber": null,
        "currencyCode": "AED",
        "countryCode": null,
        "bankCountryCode": null,
        "transactionType": "INTERNATIONAL",
        "addressId": "1e434a9b-7d1f-4722-815e-d5ac6d3f394b",
        "address": {
          "id": "1e434a9b-7d1f-4722-815e-d5ac6d3f394b",
          "line1": "303 Drive",
          "line2": "Unit 5",
          "line3": null,
          "line4": null,
          "countyState": null,
          "postCode": null,
          "country": "GB"
        },
        "cryptoWalletAddress": null,
        "networkId": null
      },
      {
        "id": "39aa9cab-c45a-41f6-92d8-5aff67916fcf",
        "recipientId": "8a42e9ff-ac35-4b47-b605-5aca4ac0bc78",
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "name": "Eve Davis",
        "displayName": "Eve Davis",
        "reference": "Refund",
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
          "id": "f00e6da2-1d30-40ea-9593-7ecd3f9bb10e",
          "line1": "404 Place",
          "line2": "Building C",
          "line3": null,
          "line4": null,
          "countyState": null,
          "postCode": null,
          "country": "AG"
        },
        "cryptoWalletAddress": null,
        "networkId": null
      }
    ],
    "internalBeneficiaryId": null
  }
]
```

Each object in the array represents an **account** and includes:

- `id`: The unique identifier for the account.
- `customerId`: The unique identifier for the customer.
- `customer`: An object containing detailed customer information:
  - `id`: The unique identifier for the customer.
  - `customerType`: The type of customer (e.g., `"BUSINESS"`).
  - `customerAddress`: An object containing address details (`line1`, `postCode`, `country`, etc.).
  - `accountApplicationStatus`: The status of the customer’s account application.
  - `verificationResult`: The result of the customer verification process.
  - `providerVerificationResult`: The verification result from the provider.
  - `bankingEnabledAt`: Timestamp when banking was enabled.
  - `createdAt`, `updatedAt`: Timestamps for customer record.
  - `userId`: Associated user ID.
- `accountProvider`: The provider of the account (e.g., `"FUSE"`, `"FIREBLOCKS"`).
- `onboardingMode`: The mode of onboarding (e.g., `"AUTOMATED"`).
- `status`: The current status of the account (e.g., `"ACTIVE"`).
- `type`: The type of account (e.g., `"PERSONAL"`).
- `externalId`: An external reference ID for the account.
- `correlationId`: A correlation ID for tracking.
- `currencyId`: The ID of the base currency (can be `null`).
- `baseCurrency`: An object containing base currency details (can be `null` for crypto accounts).
- `accountCurrencies`: An array of objects, each representing a currency wallet associated with the account. Each item includes:
  - `id`: Unique identifier for the account currency.
  - `type`: The type of currency (`"FIAT"` or `"CRYPTO"`).
  - `balance`: Current balance.
  - `available`: Available balance.
  - `locked`: Locked balance.
  - `accountDetails`: (For **FIAT**) An object containing banking details:
    - `IBAN`, `bic_swift_code`, `routing_number`, `account_number`, `account_name`.
  - `cryptoDetails`: (For **CRYPTO**) An object containing wallet details:
    - `walletAddress`, `network` details, `label`.
  - `currency`: Detailed currency information (`currencyCode`, `currencySymbol`, `currencyType`, etc.).
- `metadata`: Additional metadata associated with the account.
- `dueAmount`: Any amount due on the account.
- `beneficiaries`: An array of beneficiaries associated with the account.
- `createdAt`: The timestamp when the account was created.
- `updatedAt`: The timestamp of the last update to the account.
