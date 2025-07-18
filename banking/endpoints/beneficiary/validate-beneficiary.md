---
title: Validate Beneficiary Details
layout: home
permalink: /banking/endpoints/beneficiary/validate-beneficiary-details
parent: Beneficiary
nav_order: 1
---

## Validate Beneficiary Details

### Endpoint Description

This endpoint allows you to add a new beneficiary to a specified account. The request requires the account ID as part of the URL and a JSON payload containing the beneficiary's details.

### Request

```
Method: POST
URL: /v1/accounts/:accountId/beneficiary
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
  "name": "Mr Lance Henry",
  "reference": "Equals Ben",
  "iban": null,
  "sortCode": "302414",
  "accountNumber": "33264517",
  "type": "INDIVIDUAL", "INDIVIDUAL | BUSINESS | CHARITY"
  "currencyCode": "GBP",
  "countryCode": "GB",
  "bankCountryCode": "rr"
}
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 200 and a JSON object containing the following structure:

```json

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
