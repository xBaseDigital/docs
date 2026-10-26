---
title: Estimate Payroll Fee
layout: endpoint
try_it: estimatePayrollFee
try_it_spec: /assets/openapi/payroll.json
permalink: /payroll/endpoints/estimate-payroll-fee
parent: Payroll API
nav_order: 1
---

## Estimate Payroll Fee

{: .endpoint-desc }
This endpoint calculates the estimated fees for a payroll distribution to multiple beneficiaries. It returns a `feeHash` which is required to create the actual payroll request. The fee hash expires after a configured time period (typically 10-15 minutes).

### Request

```
Method: POST
URL: {{baseUrl}}/v1/customers/payroll/estimate
Authentication: Requires Bearer token
Content-Type: application/json
```

### Request Body

```json
{
  "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
  "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
  "amountSplitDetails": [
    {
      "beneficiaryId": "5b9d9177-2261-458d-b65b-c6722cc75a90",
      "amount": "5000.00",
      "amountCurrencyType": "SOURCE"
    },
    {
      "beneficiaryId": "0db9b611-9754-454d-951d-d691e1265148",
      "amount": "150000.00",
      "amountCurrencyType": "PAYROLL"
    }
  ]
}
```

### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sourceAccountCurrencyId` | UUID | ✅ | The account currency ID from which funds will be debited |
| `payrollAccountCurrencyId` | UUID | ✅ | The payroll account currency ID (typically PKR for MCB) |
| `amountSplitDetails` | Array | ✅ | List of beneficiary payment details (must not be empty) |
| `amountSplitDetails[].beneficiaryId` | UUID | ✅ | The unique identifier of the beneficiary |
| `amountSplitDetails[].amount` | String (Decimal) | ✅ | Payment amount (max 8 decimal places for SOURCE, max 2 for PAYROLL) |
| `amountSplitDetails[].amountCurrencyType` | Enum | ❌ | Currency type: `SOURCE` or `PAYROLL` (defaults to `SOURCE`) |

### Validation Rules

- `amountSplitDetails` must contain at least one beneficiary
- Each `amount` must be greater than zero
- Maximum 8 decimal places for amounts in SOURCE currency
- Maximum 2 decimal places for amounts in PAYROLL currency
- No duplicate `beneficiaryId` values allowed
- All beneficiaries must exist and be active

### Example Request

```bash
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/estimate' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_access_token>' \
--data '{
  "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
  "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
  "amountSplitDetails": [
    {
      "beneficiaryId": "5b9d9177-2261-458d-b65b-c6722cc75a90",
      "amount": "5000.00",
      "amountCurrencyType": "SOURCE"
    },
    {
      "beneficiaryId": "0db9b611-9754-454d-951d-d691e1265148",
      "amount": "150000.00",
      "amountCurrencyType": "PAYROLL"
    }
  ]
}'
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 200 and a JSON object containing the fee estimation and the `feeHash`.

```json
{
  "success": true,
  "data": {
    "totalAmount": "5845.32",
    "sourceCurrencyAmount": "5000.00",
    "feeAmount": "845.32",
    "estimatedReceivedAmount": "457892.50",
    "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
    "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
    "feeHash": "a7c8f3d2-4b9e-4d1a-8f2c-9e7d6c5b4a3f",
    "expiresAt": "2026-06-05T10:30:00.000Z"
  }
}
```

### Response Fields

- `success`: Boolean indicating if the request was successful
- `data`: Contains the estimation details
  - `totalAmount`: Total amount to be debited from source account (source currency amount + all fees)
  - `sourceCurrencyAmount`: Base amount in source currency before fees
  - `feeAmount`: Total fees (spread fee + Fuse fee + MCB fee converted to source currency)
  - `estimatedReceivedAmount`: Total amount beneficiaries will receive in payroll currency
  - `sourceAccountCurrencyId`: Echo of the source account currency ID
  - `payrollAccountCurrencyId`: Echo of the payroll account currency ID
  - `feeHash`: **A unique hash representing this fee quote. Required for creating the payroll request.**
  - `expiresAt`: ISO 8601 timestamp when the fee hash expires

### Fee Calculation Breakdown

The total fee consists of three components:

#### 1. Spread Fee

The FX conversion markup applied to the exchange rate:

```
Spread Fee = Source Currency Total × (Spread BIPS / 10,000)
```

The spread BIPS is determined by the customer's fee profile. If no profile exists, the spread is 0.

#### 2. Fuse Fee

Payment processor fee for debiting the source account. This fee is estimated by the Fuse provider based on:
- Source account details
- Source currency
- Total transaction amount

#### 3. MCB Fee

Bank transfer fee charged per beneficiary by MCB (Mauritius Commercial Bank):

```
Total MCB Fee = Per-Beneficiary Fee × Number of Beneficiaries
```

The per-beneficiary fee is a fixed amount in PKR (configurable via `CONF_PAYROLL_MCB_B2C_FEE_PKR`), converted to the source currency using the RELM exchange rate.

### Exchange Rate Application

The system uses a two-step exchange rate process:

1. **Base Rate**: Retrieved from RELM for payroll currency → source currency conversion
2. **Effective Rate**: Base rate adjusted for spread:
   ```
   Effective Rate = Base Rate × (1 - Spread BIPS / 10,000)
   ```

All currency conversions use the effective rate to ensure consistent fee application.

### Fee Hash Mechanism

The `feeHash` serves several critical purposes:

- **Rate Lock**: Ensures the exchange rate and fees don't change between estimate and request creation
- **Security**: Prevents manipulation of fee calculations
- **Expiration**: Automatically expires to prevent stale rates from being used
- **One-Time Use**: Consumed immediately when creating a payroll request

**Important**: Store the `feeHash` securely and use it to create the payroll request before it expires.

### Error Cases

#### 400 Bad Request

**Invalid amount format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Amount must have maximum 2 decimal places for PAYROLL currency type"
  }
}
```

**Duplicate beneficiaries:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Duplicate beneficiary IDs are not allowed"
  }
}
```

**Exchange rate unavailable:**
```json
{
  "success": false,
  "error": {
    "code": "EXCHANGE_RATE_UNAVAILABLE",
    "message": "Unable to retrieve exchange rate for the selected currency pair"
  }
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token"
  }
}
```

#### 404 Not Found

**Beneficiary not found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "One or more beneficiaries not found"
  }
}
```

**Account currency not found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Source account currency not found or not accessible"
  }
}
```

### Notes

- The estimate is indicative and based on current exchange rates
- Actual exchange rate will be provided by admin in the quote after request creation
- Fee hash expires after the configured TTL to ensure rate freshness
- Amounts can be mixed: some beneficiaries in SOURCE currency, others in PAYROLL currency
- The system automatically handles currency conversion for mixed amount types
