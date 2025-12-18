---
title: Get Transaction List
layout: home
permalink: /banking/endpoints/transaction/get-transaction-list
parent: Transaction
nav_order: 1
---

## Get Transaction List

{: .endpoint-desc }
This endpoint retrieves detailed information about all transactions.

### Request

```
Method: GET
URL: {{baseUrl}}/v1/accounts/transactions
Authentication: Requires authentication.
```

### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | String | No | Filter by transaction status. |
| `type` | String | No | Filter by transaction type. |
| `highRisk` | Boolean | No | Filter by high risk status (`true` or `false`). |
| `currencyCode` | String | No | Filter by currency code (e.g., USD, EUR). Must be uppercase. |
| `fromDate` | Date | No | Filter transactions from this date (YYYY-MM-DD). |
| `toDate` | Date | No | Filter transactions up to this date (YYYY-MM-DD). |

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
  "data": [
    {
      "highRisk": false,
      "refunded": false,
      "id": "ce81820d-1b46-4a19-b779-a5e856ed5811",
      "idempotencyKey": "e8c64777-2e97-472f-b015-5f78888b4402",
      "additionalInfo": {
        "exchangeTo": "USD",
        "toAccountId": "0197c5c8-cef6-7341-9c2e-c7b4effbe4d1",
        "exchangeRate": 0.2698,
        "fromAccountId": "0197d9d7-91f1-74b1-9398-fcf61a754815",
        "idempotencyKey": "e8c64777-2e97-472f-b015-5f78888b4402",
        "exchangeAmountTo": 26.98
      },
      "externalId": "01981c19-27ef-7b32-a830-1d93409a7a64",
      "transactionReference": "Exchange AED to USD",
      "assetType": "FIAT",
      "conversionDate": "2025-07-18T05:54:27.629Z",
      "conversionRate": 0.2698,
      "accountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
      "accountCurrency": {
        "id": "fae535c5-f64f-4737-82de-c12b88be0764",
        "banking_provider_account_id": "0197d9d7-91f1-74b1-9398-fcf61a754815",
        "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
        "balance": "4910.46",
        "available": "4673.46",
        "accountDetailsId": "df33fb5c-ab6f-4d28-a4db-11adf6798202",
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
          "account_name": "Suzuki AED",
          "addressId": null
        },
        "currency": {
          "id": "0ff5db18-ad57-4703-a031-08907aa814f1",
          "currencyCode": "AED",
          "currencySymbol": "د.إ",
          "currencyFlag": "https://statics.xbd.money/images/flags/aed.png",
          "enabled": true,
          "createdAt": "2025-07-08T05:15:22.312Z",
          "updatedAt": "2025-07-17T14:59:36.993Z"
        },
        "account": {
          "id": "385dec3a-9bfe-4072-8733-7872ef350e71",
          "customerId": "b10a855a-76a9-4b7d-9628-175a55326473",
          "customer": {
            "id": "b10a855a-76a9-4b7d-9628-175a55326473",
            "customerType": "BUSINESS",
            "customerAddressId": "98cc9162-180d-480f-8509-6c4b79515108",
            "customerAddress": {
              "id": "98cc9162-180d-480f-8509-6c4b79515108",
              "line1": "32323",
              "line2": null,
              "line3": "3232",
              "line4": null,
              "countyState": "",
              "postCode": "560102",
              "country": "ALB"
            },
            "terms": true,
            "privacyPolicy": true,
            "accountApplicationStatus": "APPROVED",
            "verificationResult": "APPROVED",
            "riskEvaluation": null,
            "riskLevel": null,
            "createdAt": "2025-06-28T08:24:52.566Z",
            "updatedAt": "2025-06-30T06:10:23.414Z",
            "lastLogin": null,
            "feeProfileId": null,
            "user": {
              "loginAttempts": 0,
              "id": "fdda84df-588f-49bf-856c-fb3d23ef7f7f",
              "email": "alex@gmail.com",
              "firstName": "Dilip",
              "lastName": "Sarath",
              "emailVerified": true,
              "dateOfBirth": null,
              "phone": "2333232233",
              "isStaff": false,
              "lastLoginAt": "2025-07-18T05:50:39.084Z",
              "authMode": "EMAIL",
              "status": "ACTIVE",
              "mfaEnabled": false,
              "createdAt": "2025-06-28T08:24:52.545Z",
              "updatedAt": "2025-07-18T05:50:39.085Z",
              "roles": ["CUSTOMER"],
              "registrationOrigin": "BANKING",
              "passcodeSet": true
            },
            "productActivations": {}
          },
          "onboardingMode": "AUTOMATED",
          "status": "ACTIVE",
          "type": "PERSONAL",
          "externalId": "0197c5c8-cdcd-73d0-a517-09090bb28f14",
          "correlationId": "0197c5c8-cdcd-73d0-a517-09090bb28f14",
          "currencyId": "9110cbef-78e4-485a-b3f8-27e6b51b83c3",
          "baseCurrency": {
            "id": "9110cbef-78e4-485a-b3f8-27e6b51b83c3",
            "currencyCode": "USD",
            "currencySymbol": "$",
            "currencyFlag": "https://statics.xbd.money/images/flags/usd.png",
            "enabled": true,
            "createdAt": "2025-07-08T05:15:22.312Z",
            "updatedAt": "2025-07-17T14:59:37.003Z"
          },
          "metadata": "{\"event_id\":\"0197c5c8-cef6-7341-9c2e-c7b4effbe4d1\",\"event_version\":1,\"account_name\":\"Suzuki USD\",\"currency\":\"USD\",\"account_type\":\"virtual\",\"customer_id\":\"0197c5c8-cdcd-73d0-a517-09090bb28f14\"}",
          "createdAt": "2025-07-01T11:39:21.423Z",
          "updatedAt": "2025-07-01T11:39:24.349Z"
        },
        "status": "ENABLED"
      },
      "amount": "100",
      "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
      "currency": {
        "id": "0ff5db18-ad57-4703-a031-08907aa814f1",
        "currencyCode": "AED",
        "currencySymbol": "د.إ",
        "currencyFlag": "https://statics.xbd.money/images/flags/aed.png",
        "enabled": true,
        "createdAt": "2025-07-08T05:15:22.312Z",
        "updatedAt": "2025-07-17T14:59:36.993Z"
      },
      "status": "PROCESSING",
      "type": "DEBIT",
      "paymentMethod": "LOCAL",
      "paymentType": "PAYMENT_TYPE_FX",
      "settlementDate": "2025-07-18T05:54:27.629Z",
      "riskScore": 0,
      "createdAt": "2025-07-18T05:54:27.632Z",
      "updatedAt": "2025-07-18T05:54:27.632Z",
      "transactionCategory": "FX"
    }
  ],
  "pagination": {
    "total": 34,
    "page": 1,
    "limit": 10,
    "totalPages": 4
  }
}
```

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
