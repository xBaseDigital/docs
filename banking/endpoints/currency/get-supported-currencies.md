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
    },
    {
      "id": "d7ff70ba-87ac-4128-8e54-155bb148f4db",
      "currencyCode": "USDC",
      "currencyName": "USD Coin",
      "currencySymbol": "USDC",
      "currencyFlag": "https://statics.xbd.money/images/flags/crypto/usdc.svg",
      "currencyType": "CRYPTO",
      "enabled": true,
      "externalId": null,
      "fiatDetailsId": null,
      "cryptoNetworks": [
        {
          "id": "70c8ff18-2503-48dd-b299-2ade5c6ea994",
          "currencyId": "d7ff70ba-87ac-4128-8e54-155bb148f4db",
          "networkId": "ba4bd30b-c1c9-4747-b280-b8a6fa5ba5fa",
          "decimals": 6,
          "isNative": true,
          "contractAddress": null,
          "tokenStandard": null,
          "enabled": true,
          "externalId": "USDC_NOBLE",
          "metadata": null,
          "network": {
            "id": "ba4bd30b-c1c9-4747-b280-b8a6fa5ba5fa",
            "code": "NOBLE",
            "name": "Noble",
            "chainId": "grand-1",
            "nativeCurrency": "USDC",
            "isTestnet": false,
            "enabled": true,
            "externalId": null,
            "metadata": null
          }
        }
      ],
      "providers": [
        "6"
      ]
    }
  ]
}
```

The response object contains:

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
