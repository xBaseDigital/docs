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
{
  "success": true,
  "data": [
    {
      "id": "a7c2ba15-d8a2-455b-b832-84c0dc6b3154",
      "currencyCode": "USD",
      "currencyName": "United States Dollar",
      "currencySymbol": "$",
      "currencyFlag": "https://statics.xbd.money/images/flags/usd.png",
      "currencyType": "FIAT",
      "enabled": true,
      "externalId": null,
      "fiatDetailsId": "fiat-USD",
      "fiatDetails": {
        "id": "fiat-USD",
        "decimals": 2,
        "countries": [],
        "isReserveCurrency": true
      },
      "providers": [
        "4"
      ]
    }
  ]
}
```

### Response Fields

- `id`: Unique identifier for the currency.
- `currencyCode`: ISO currency code (e.g., `USD`, `USDC`).
- `currencyName`: Full name of the currency.
- `currencyType`: Type of currency (`FIAT` or `CRYPTO`).
- `currencyFlag`: URL to the currency's flag image.
- `enabled`: Boolean indicating if the currency is currently supported.
- `fiatDetails`: Specific details for Fiat currencies (decimals, etc.).
- `cryptoNetworks`: Specific details for Crypto currencies (network ID, contract address, etc.).

- `success`: Indicates if the request was successful.
- `data`: An array of currency objects, where each object includes:
  - `id`: The unique identifier for the currency.
  - `currencyCode`: The ISO currency code (e.g., "USD").
  - `currencyName`: The name of the currency.
  - `currencySymbol`: The currency symbol (e.g., "$").
  - `currencyFlag`: A URL pointing to the currency flag image.
  - `currencyType`: The type of currency ("FIAT" or "CRYPTO").
  - `enabled`: Boolean indicating if the currency is enabled.
  - `fiatDetails`: Object containing details specific to FIAT currencies (if applicable).
  - `cryptoNetworks`: Array of network objects for CRYPTO currencies (if applicable).
    - `network`: Details about the blockchain network.
