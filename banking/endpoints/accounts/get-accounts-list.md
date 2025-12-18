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
      },
      {
        "id": "fae535c5-f64f-4737-82de-c12b88be0764",
        "banking_provider_account_id": "0197d9d7-91f1-74b1-9398-fcf61a754815",
        "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
        "type": "FIAT",
        "balance": "76205.12590174783646269006",
        "available": "75263.85590174783646269006",
        "locked": "0",
        "accountDetailsId": "df33fb5c-ab6f-4d28-a4db-11adf6798202",
        "cryptoDetailsId": null,
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "accountDetails": {
          "id": "df33fb5c-ab6f-4d28-a4db-11adf6798202",
          "IBAN": "AE629475036342300954347",
          "bic_swift_code": null,
          "correspondent_bic": null,
          "beneficiary": null,
          "sort_code": null,
          "routing_number": null,
          "account_number": null,
          "account_name": "Business Account AED",
          "addressId": null
        },
        "currency": {
          "id": "0ff5db18-ad57-4703-a031-08907aa814f1",
          "currencyCode": "AED",
          "currencyName": null,
          "currencySymbol": "د.إ",
          "currencyFlag": "https://statics.xbd.money/images/flags/aed.png",
          "currencyType": "FIAT",
          "enabled": true,
          "externalId": null,
          "fiatDetailsId": "fiat-AED",
          "createdAt": "2025-07-08T05:15:22.312Z",
          "updatedAt": "2025-12-03T15:31:47.513Z"
        },
        "status": "ENABLED",
        "createdAt": "2025-10-29T09:06:16.148Z",
        "updatedAt": "2025-12-12T13:37:11.882Z"
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
      },
      {
        "id": "e7bc993d-39b1-4954-9740-7094050a8315",
        "recipientId": "a43629e9-290a-4d6a-a134-9d9ea2a08e5e",
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "name": "Jane Smith",
        "displayName": "Jane Smith",
        "reference": "Payment Ref",
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
        "addressId": "50fb8e88-3ac2-4528-a6ec-882ae3f733d2",
        "address": {
          "id": "50fb8e88-3ac2-4528-a6ec-882ae3f733d2",
          "line1": "456 Avenue",
          "line2": "Suite 200",
          "line3": null,
          "line4": null,
          "countyState": null,
          "postCode": null,
          "country": "AD"
        },
        "cryptoWalletAddress": null,
        "networkId": null
      },
      {
        "id": "f5532b43-a3a7-4f89-8421-309f3daaa32d",
        "recipientId": "a627f3ec-b0b6-44e3-b4bc-4a8dcb23080e",
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "name": "Alice Johnson",
        "displayName": "Alice Johnson",
        "reference": "Consulting Fee",
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
        "currencyCode": "USD",
        "countryCode": null,
        "bankCountryCode": null,
        "transactionType": "INTERNATIONAL",
        "addressId": "fa226fd4-355d-423a-98de-680c73aa3398",
        "address": {
          "id": "fa226fd4-355d-423a-98de-680c73aa3398",
          "line1": "789 Boulevard",
          "line2": "Floor 3",
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
        "id": "8192f6f0-5cda-404f-a879-f51fd5c87b02",
        "recipientId": "9cf6508c-e193-4ce5-a6b9-45c3e5a80138",
        "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "name": "Bob Williams",
        "displayName": "Bob Williams",
        "reference": "Service Charge",
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
  },
  {
    "id": "e9408527-9b51-489e-82de-41a1f4571c7a",
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
    "accountProvider": "6",
    "onboardingMode": "AUTOMATED",
    "status": "ACTIVE",
    "type": "PERSONAL",
    "externalId": "63",
    "correlationId": "63",
    "currencyId": null,
    "accountCurrencies": [
      {
        "id": "9119edb5-089b-49f1-8cc9-67f0b169aadc",
        "banking_provider_account_id": "63:USDT",
        "currencyId": "cd6a2c1c-d62c-4ea5-983b-82fae5395b2d",
        "type": "CRYPTO",
        "balance": "0",
        "available": "0",
        "locked": "0",
        "accountDetailsId": null,
        "cryptoDetailsId": "b04e74c0-9d17-492a-ae77-428f77cc5353",
        "accountId": "e9408527-9b51-489e-82de-41a1f4571c7a",
        "cryptoDetails": {
          "id": "b04e74c0-9d17-492a-ae77-428f77cc5353",
          "networkId": "133eb35a-7bda-4179-96a7-c639d3eab75e",
          "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
          "label": "USDT wallet for customer",
          "externalWalletId": null,
          "createdAt": "2025-12-18T04:59:36.336Z",
          "updatedAt": "2025-12-18T04:59:36.336Z",
          "network": {
            "id": "133eb35a-7bda-4179-96a7-c639d3eab75e",
            "code": "BNB_TEST",
            "name": "BNB Smart Chain Testnet",
            "chainId": "97",
            "nativeCurrency": "BNB",
            "isTestnet": true,
            "enabled": true,
            "externalId": null,
            "metadata": null,
            "createdAt": "2025-11-20T15:14:03.533Z",
            "updatedAt": "2025-12-03T15:31:48.140Z"
          }
        },
        "currency": {
          "id": "cd6a2c1c-d62c-4ea5-983b-82fae5395b2d",
          "currencyCode": "USDT",
          "currencyName": "Tether",
          "currencySymbol": "₮",
          "currencyFlag": "https://statics.xbd.money/images/flags/crypto/usdt.svg",
          "currencyType": "CRYPTO",
          "enabled": true,
          "externalId": null,
          "fiatDetailsId": "fiat-USDT",
          "createdAt": "2025-11-13T05:07:36.544Z",
          "updatedAt": "2025-12-03T15:31:48.205Z"
        },
        "status": "ENABLED",
        "createdAt": "2025-12-18T04:59:36.347Z",
        "updatedAt": "2025-12-18T04:59:36.372Z"
      }
    ],
    "dueAmount": "0",
    "createdAt": "2025-12-18T04:59:15.581Z",
    "updatedAt": "2025-12-18T04:59:29.222Z",
    "beneficiaries": [],
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
