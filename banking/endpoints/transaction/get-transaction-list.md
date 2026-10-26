---
title: Get Transaction List
layout: endpoint
try_it: getTransactionList
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
| `status` | String | No | Filter by transaction status. One of the [transaction statuses](#transaction-status) below. |
| `type` | String | No | Filter by transaction type: `CREDIT` (money in), `DEBIT` (money out), `FX` (currency exchanges), `WALLET_TRANSFER` (transfers between your wallets), or `ALL_WALLET_TRANSFERS` (wallet transfers and POS settlement transfers). Without a `type`, wallet transfers and POS settlement transfers are listed only once they are `COMPLETED`. |
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
        "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
        "balance": "4910.46",
        "available": "4673.46",
        "currency": {
          "currencyCode": "AED",
          "currencySymbol": "د.إ"
        }
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

### Response Fields

- `id`: Unique identifier for the transaction.
- `transactionReference`: Reference string for the transaction.
- `assetType`: Type of asset involved: `FIAT` or `CRYPTO`.
- `amount`: Transaction amount.
- `currency`: Object containing currency details (`currencyCode`, `currencySymbol`, etc.).
- `status`: Current status of the transaction. See [transaction statuses](#transaction-status).
- `type`: `CREDIT` (money in) or `DEBIT` (money out).
- `paymentMethod`: Method of payment: `LOCAL` or `SWIFT`.
- `paymentType`: Specific type of payment (e.g., `PAYMENT_TYPE_FX`).
- `settlementDate`: Date when the transaction was settled.
- `transactionCategory`: `FX` for a currency exchange, `PAYMENT` for everything else.
- `accountCurrency`: Details of the account currency involved.
- `additionalInfo`: Object containing extra details like exchange rates (if applicable).
- `createdAt`: Timestamp when the transaction was created.
- `updatedAt`: Timestamp when the transaction was last updated.

### Possible values

{% include enums/transaction-values.md %}
