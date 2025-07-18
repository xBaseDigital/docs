---
title: Create Exchange Order
layout: home
permalink: /banking/endpoints/exchange/create-exchange-order
parent: Exchange
nav_order: 2
---

## Create Exchange Order

### Endpoint Description

This endpoint allows users to request a quote for a currency exchange order associated with a specific account.

### Request

```
Method: POST
URL: {{baseUrl}}/v1/accounts/:accountId/orders/exchange/trade
Path Parameters : accountId - The unique identifier of the account (e.g., 36abacac-2aa2-4eb7-b96e-870364065c05)
Authentication: Requires authentication.
```

### Request Body

```json
{
  "amountTo": 26.98,
  "amountFrom": 100,
  "currencyTo": "USD",
  "currencyFrom": "AED",
  "rate": 0.2698,
  "idempotencyKey": "e8c64777-2e97-472f-b015-5f78888b4402"
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
  "success": true,
  "data": {
    "highRisk": false,
    "refunded": false,
    "id": "ce81820d-1b46-4a19-b779-a5e856ed5811",
    "idempotencyKey": "e8c64777-2e97-472f-b015-5f78888b4402",
    "additionalInfo": {
      "provider": "FUSE",
      "exchangeTo": "USD",
      "toAccountId": "0197c5c8-cef6-7341-9c2e-c7b4effbe4d1",
      "exchangeRate": 0.2698,
      "fromAccountId": "0197d9d7-91f1-74b1-9398-fcf61a754815",
      "idempotencyKey": "e8c64777-2e97-472f-b015-5f78888b4402",
      "exchangeAmountTo": 26.98,
      "sourceAccountFuseId": "0197d9d7-91f1-74b1-9398-fcf61a754815",
      "targetAccountFuseId": "0197c5c8-cef6-7341-9c2e-c7b4effbe4d1"
    },
    "externalId": "01981c19-27ef-7b32-a830-1d93409a7a64",
    "transactionReference": "Fuse Exchange AED to USD",
    "assetType": "FIAT",
    "conversionDate": "2025-07-18T05:54:27.629Z",
    "conversionRate": 0.2698,
    "accountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
    "accountCurrency": {
      "id": "fae535c5-f64f-4737-82de-c12b88be0764",
      "banking_provider_account_id": "0197d9d7-91f1-74b1-9398-fcf61a754815",
      "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
      "balance": "4910.46",
      "available": "4773.46",
      "accountDetailsId": "df33fb5c-ab6f-4d28-a4db-11adf6798202",
      "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
      "account": {
        "id": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "customerId": "b10a855a-76a9-4b7d-9628-175a55326473",
        "accountProvider": "FUSE",
        "onboardingMode": "AUTOMATED",
        "status": "ACTIVE",
        "type": "PERSONAL",
        "externalId": "0197c5c8-cdcd-73d0-a517-09090bb28f14",
        "correlationId": "0197c5c8-cdcd-73d0-a517-09090bb28f14",
        "currencyId": "9110cbef-78e4-485a-b3f8-27e6b51b83c3",
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
}
```

- `success`: A boolean indicating the success of the request.
- `data`: An object containing quote details:
  - `orderId`: A unique identifier for the order.
  - `quoteRequestId`: A unique identifier for the quote request.
  - `from`: An object representing the source currency details:
    - `amount`: The amount in the source currency.
    - `currency`: The ISO currency code of the source (e.g., “GBP”).
  - `to`: An object representing the target currency details:
    - `amount`: The amount in the target currency.
    - `currency`: The ISO currency code of the target (e.g., “EUR”).
  - `exchangeRate`: The exchange rate applied for the conversion.
  - `inverseExchangeRate`: The inverse of the exchange rate.
  - `settlementDate`: The date of settlement.
  - `fee`: Any associated fee (can be 0).
  - `expiresAt`: The timestamp when the quote expires.
