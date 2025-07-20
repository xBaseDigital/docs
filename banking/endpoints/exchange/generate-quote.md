---
title: Generate Quote
layout: home
permalink: /banking/endpoints/exchange/generate-quote
parent: Exchange
nav_order: 1
---

## Generate Quote

{: .endpoint-desc }
This endpoint allows users to request a currency exchange quote for a specified account. It provides details about source and target currencies, settlement date, and transaction type.

### Request

```
Method: POST
URL: {{baseUrl}}/accounts/:accountId/orders/quote
Path Parameters : accountId - The unique identifier of the account (e.g., 36abacac-2aa2-4eb7-b96e-870364065c05)
Authentication: Requires authentication.
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Request Body

```json
{
  "sourceCurrency": {
    "currency": "AED",
    "amount": 1
  },
  "targetCurrency": {
    "currency": "USD"
  },
  "settlementDate": "20250718",
  "type": {
    "from": "balance",
    "to": "balance"
  }
}
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 200 and a JSON object containing the following structure:

```json
{
  "success": true,
  "data": {
    "from": {
      "amount": 1,
      "currency": "AED"
    },
    "to": {
      "amount": 0.27,
      "currency": "USD"
    },
    "exchangeRate": 0.2698
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
