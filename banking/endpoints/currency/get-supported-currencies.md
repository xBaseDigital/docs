---
title: Get Supported Currencies
layout: home
permalink: /banking/endpoints/currency/get-supported-currencies
parent: Currency
nav_order: 1
---

## Get Currencies

{: .endpoint-desc }
This endpoint retrieves a list of available currencies. It provides information about currency codes, symbols, and associated flags, useful for applications needing to display currency options or perform currency-related operations.

### Request

```
Method: GET
URL: {{baseUrl}}/v1/currencies
Request Body: None required for this GET request.
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
    "id": "a7c2ba15-d8a2-455b-b832-84c0dc6b3154",
    "currencyCode": "USD",
    "currencySymbol": "$",
    "currencyFlag": "https://statics.xbd.money/images/flags/usd.png"
  },
  {
    "id": "6afe5048-9981-4dff-96a4-9cc0668d4a88",
    "currencyCode": "EUR",
    "currencySymbol": "€",
    "currencyFlag": "https://statics.xbd.money/images/flags/eur.png"
  }
]
```

Each object in the array represents a currency and includes:

- `id`: The unique identifier for the currency.
- `currencyCode`: The ISO currency code (e.g., "USD").
- `currencySymbol`: The currency symbol (e.g., "$").
- `currencyFlag`: A URL pointing to the currency flag image
