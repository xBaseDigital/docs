---
title: Get Account Details
layout: home
permalink: /banking/endpoints/accounts/get-account-details
parent: Accounts
nav_order: 2
---

## Get Account Details

### Endpoint Description

{: .note }
This endpoint retrieves detailed information about a specific account identified by the accountId. It provides customer details, account status, and currency information for the specified account.

{: .Endpoint Description }
This endpoint retrieves detailed information about a specific account identified by the accountId. It provides customer details, account status, and currency information for the specified account.

### Request

```
Method: GET
URL: {{baseUrl}}/v1/accounts/:accountId
Path Parameters: accountId - The unique identifier of the account (e.g., 7fb7c416-4526-44c2-8e57-30b6198af5e3)
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
  "id": "7fb7c416-4526-44c2-8e57-30b6198af5e3",
  "externalId": "F53292",
  "customer": {
    "id": "eed9d8fd-b35b-4e8f-b08f-6efe26126976",
    "customerType": "BUSINESS",
    "customerAddressId": null,
    "loginAttempts": 0,
    "terms": true,
    "privacyPolicy": true,
    "accountApplicationStatus": "APPROVED",
    "verificationResult": "APPROVED",
    "riskEvaluation": null,
    "riskLevel": null,
    "createdAt": "2025-04-02T06:32:56.678Z",
    "updatedAt": "2025-04-24T18:53:36.599Z",
    "lastLogin": "2025-04-24T18:53:36.598Z",
    "productActivations": {},
    "firstName": "rahul",
    "lastName": "sivaji",
    "dateOfBirth": null,
    "email": "rahulsivaji921@gmail.com",
    "phone": null,
    "emailVerified": true
  },
  "type": "PERSONAL",
  "status": "ACTIVE",
  "baseCurrency": {
    "id": "561ddd4b-3016-4ef1-8db0-1d3ac8ff4d96",
    "currencyCode": "GBP",
    "currencySymbol": "£",
    "currencyFlag": "https://statics.xbd.money/images/flags/gbp.png"
  },
  "accountCurrencies": [
    {
      "id": "e45d8f69-cbcf-455d-8512-b0017d4e3941",
      "banking_provider_account_id": "b01fb443-bc0e-4d4a-abec-6bef3497ac95",
      "currency": {
        "id": "e45d8f69-cbcf-455d-8512-b0017d4e3941",
        "currencyCode": "GBP",
        "currencySymbol": "£",
        "currencyFlag": "https://statics.xbd.money/images/flags/gbp.png"
      },
      "balance": 19985,
      "available": 19886,
      "accountDetails": {
        "IBAN": "dummyIban",
        "bicSwiftCode": "",
        "correspondentBic": "",
        "beneficiary": null,
        "sortCode": "12-12-12",
        "accountNumber": "dummyAccountNumber",
        "address": null
      }
    }
  ],
  "createdAt": "2025-04-14T04:17:24.927Z",
  "updatedAt": "2025-04-14T05:24:40.183Z"
}
```

Each object in the array represents an **account** and includes:

- `id`: The unique identifier for the account.
- `externalId`: An external reference ID for the account.
- `customer`: An object containing customer details:

  - `id`: The unique identifier for the customer.
  - `customerType`: The type of customer (e.g., `"BUSINESS"`).
  - `customerAddressId`: The identifier for the customer’s address (can be `null`).
  - `loginAttempts`: The number of login attempts (e.g., `0`).
  - `terms`: A boolean indicating acceptance of terms.
  - `privacyPolicy`: A boolean indicating acceptance of the privacy policy.
  - `accountApplicationStatus`: The status of the customer’s account application.
  - `verificationResult`: The result of the customer verification process.
  - `riskEvaluation`: The risk evaluation result (can be `null`).
  - `riskLevel`: The risk level (can be `null`).
  - `createdAt`: The timestamp when the customer was created.
  - `updatedAt`: The timestamp of the last update to the customer profile.
  - `lastLogin`: The timestamp of the customer’s last login.
  - `productActivations`: An object detailing the activation status of various products (can be empty).
  - `firstName`: The customer’s first name.
  - `lastName`: The customer’s last name.
  - `dateOfBirth`: The customer’s date of birth (can be `null`).
  - `email`: The customer’s email address.
  - `phone`: The customer’s phone number (can be `null`).
  - `emailVerified`: A boolean indicating if the customer’s email has been verified.

- `type`: The type of account (e.g., `"PERSONAL"`).
- `status`: The current status of the account (e.g., `"ACTIVE"`).
- `baseCurrency`: An object containing base currency details:
  - `id`: The unique identifier for the currency.
  - `currencyCode`: The ISO currency code (e.g., `"GBP"`).
  - `currencySymbol`: The currency symbol (e.g., `"£"`).
  - `currencyFlag`: A URL pointing to the currency flag image.

#### `accountCurrencies`: Array of Currency Objects

Each item includes:

- `id`: The unique identifier for the account currency.
- `banking_provider_account_id`: The identifier for the banking provider account.
- `currency`: An object containing:
  - `id`: The unique identifier for the currency.
  - `currencyCode`: The ISO currency code.
  - `currencySymbol`: The currency symbol.
  - `currencyFlag`: The flag image URL.
- `balance`: The current balance of the account in the currency.
- `available`: The available balance of the account in the currency.
- `accountDetails`: An object that may include:
  - `IBAN`
  - `bicSwiftCode`
  - `correspondentBic`
  - `beneficiary`
  - `sortCode`
  - `accountNumber`
  - `address` (can be `null`)
- `createdAt`: The timestamp when the account was created.
- `updatedAt`: The timestamp of the last update to the account.
