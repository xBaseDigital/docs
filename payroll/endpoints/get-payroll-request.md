---
title: Get Payroll Request
layout: home
permalink: /payroll/endpoints/get-payroll-request
parent: Payroll API
nav_order: 4
---

## Get Payroll Request

{: .endpoint-desc }
This endpoint retrieves detailed information about a specific payroll request, including account details, beneficiary snapshots, transfer status, FX exchange details, and complete fee breakdown. Use this to monitor the progress of a payroll distribution.

### Request

```
Method: GET
URL: {{baseUrl}}/v1/customers/payroll/requests/:requestId
Path Parameters: requestId - The unique identifier of the payroll request
Authentication: Requires Bearer token
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requestId` | UUID | ✅ | The unique identifier of the payroll request |

### Example Request

```bash
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/requests/babe5f2d-7c44-4b83-90b9-f94856ed4643' \
  --header 'Authorization: Bearer <your_access_token>'
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** Returns complete payroll request details with all related entities.

```json
{
  "success": true,
  "data": {
    "id": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
    "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
    "sourceAccountCurrency": {
      "id": "385dec3a-9bfe-4072-8733-7872ef350e71",
      "accountId": "fae535c5-f64f-4737-82de-c12b88be0764",
      "currency": {
        "id": "0ff5db18-ad57-4703-a031-08907aa814f1",
        "currencyCode": "AED",
        "currencyName": "United Arab Emirates Dirham",
        "currencySymbol": "د.إ"
      },
      "balance": "50000.00",
      "available": "44154.68",
      "account": {
        "id": "fae535c5-f64f-4737-82de-c12b88be0764",
        "accountProvider": "FUSE",
        "customerId": "c9a8b7d6-5e4f-3d2c-1b0a-9f8e7d6c5b4a"
      }
    },
    "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
    "payrollAccountCurrency": {
      "id": "fae535c5-f64f-4737-82de-c12b88be0764",
      "currency": {
        "currencyCode": "PKR",
        "currencyName": "Pakistani Rupee"
      },
      "account": {
        "accountProvider": "MCB"
      }
    },
    "totalAmount": "5845.32",
    "status": "QUOTE_ACCEPTED",
    "estimatedFxRate": "91.2450",
    "estimatedReceivedAmount": "457892.50",
    "sourceAmountForExchange": "5730.12",
    "quoteExpiresAt": "2026-06-05T18:00:00.000Z",
    "quotedByUserId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "quotedByUser": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@relm.co"
    },
    "quotedAt": "2026-06-05T10:00:00.000Z",
    "acceptedByCustomerAt": "2026-06-05T10:25:30.123Z",
    "cancellationReason": null,
    "failureReason": null,
    "metadata": {
      "feeBreakdown": {
        "sourceCurrencyAmount": "5000.00",
        "spreadFee": "75.00",
        "fuseFee": "40.20",
        "mcbFee": "730.12",
        "totalFee": "845.32",
        "estimatedReceivedAmount": "457892.50",
        "payrollCurrencyCode": "PKR",
        "feeCurrencyCode": "AED",
        "exchangeRate": "91.2450",
        "baseRate": "92.6210"
      }
    },
    "amountSplitDetails": [
      {
        "id": "d3c2b1a0-9f8e-7d6c-5b4a-3f2e1d0c9b8a",
        "payrollRequestId": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
        "beneficiaryId": "5b9d9177-2261-458d-b65b-c6722cc75a90",
        "beneficiarySnapshot": {
          "id": "5b9d9177-2261-458d-b65b-c6722cc75a90",
          "firstName": "Ahmed",
          "lastName": "Khan",
          "displayName": "Ahmed Khan",
          "type": "INDIVIDUAL",
          "iban": "PK36MUCB0000001234567890",
          "bankName": "MCB Bank",
          "nationality": "PK",
          "reference": "Freelancer Payment"
        },
        "sourceCurrencyAmount": "5000.00",
        "amount": "456062.50",
        "purposeCode": "FCISS",
        "payoutTransferId": "e4d3c2b1-0a9f-8e7d-6c5b-4a3f2e1d0c9b",
        "createdAt": "2026-06-05T09:15:30.123Z"
      },
      {
        "id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c",
        "payrollRequestId": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
        "beneficiaryId": "0db9b611-9754-454d-951d-d691e1265148",
        "beneficiarySnapshot": {
          "id": "0db9b611-9754-454d-951d-d691e1265148",
          "firstName": "Fatima",
          "lastName": "Ali",
          "displayName": "Fatima Ali",
          "type": "INDIVIDUAL",
          "accountNumber": "0987654321",
          "bankName": "MCB Bank",
          "nationality": "PK"
        },
        "sourceCurrencyAmount": "1644.12",
        "amount": "150000.00",
        "purposeCode": "PEN",
        "payoutTransferId": "g6f5e4d3-c2b1-a0a9-f8e7-d6c5b4a3f2e1",
        "createdAt": "2026-06-05T09:15:30.123Z"
      }
    ],
    "transfers": [
      {
        "id": "h7g6f5e4-d3c2-b1a0-9f8e-7d6c5b4a3f2e",
        "payrollRequestId": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
        "transferType": "FUSE_INTERNAL_DEBIT",
        "status": "COMPLETED",
        "externalId": "fuse_tx_123456789",
        "amount": "5845.32",
        "currencyCode": "AED",
        "feeDetails": {
          "id": "j9i8h7g6-f5e4-d3c2-b1a0-9f8e7d6c5b4a",
          "amount": "40.20",
          "finalInternalFee": "40.20"
        },
        "executedAt": "2026-06-05T09:15:35.000Z",
        "completedAt": "2026-06-05T09:15:40.000Z",
        "createdAt": "2026-06-05T09:15:30.456Z"
      },
      {
        "id": "i8h7g6f5-e4d3-c2b1-a0a9-f8e7d6c5b4a3",
        "payrollRequestId": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
        "transferType": "FUSE_TO_MCB",
        "status": "COMPLETED",
        "externalId": "fuse_tx_987654321",
        "amount": "5730.12",
        "currencyCode": "AED",
        "executedAt": "2026-06-05T10:30:00.000Z",
        "completedAt": "2026-06-05T10:30:15.000Z",
        "createdAt": "2026-06-05T10:29:55.000Z"
      },
      {
        "id": "e4d3c2b1-0a9f-8e7d-6c5b-4a3f2e1d0c9b",
        "payrollRequestId": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
        "transferType": "MCB_TO_BENEFICIARY",
        "status": "PROCESSING",
        "amount": "456062.50",
        "currencyCode": "PKR",
        "payoutInstruction": {
          "id": "d3c2b1a0-9f8e-7d6c-5b4a-3f2e1d0c9b8a",
          "beneficiaryId": "5b9d9177-2261-458d-b65b-c6722cc75a90",
          "beneficiarySnapshot": {
            "id": "5b9d9177-2261-458d-b65b-c6722cc75a90",
            "firstName": "Ahmed",
            "lastName": "Khan",
            "displayName": "Ahmed Khan"
          },
          "sourceCurrencyAmount": "5000.00",
          "amount": "456062.50"
        },
        "executedAt": "2026-06-05T10:35:00.000Z",
        "createdAt": "2026-06-05T09:15:30.567Z"
      },
      {
        "id": "g6f5e4d3-c2b1-a0a9-f8e7-d6c5b4a3f2e1",
        "payrollRequestId": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
        "transferType": "MCB_TO_BENEFICIARY",
        "status": "PENDING",
        "amount": "150000.00",
        "currencyCode": "PKR",
        "payoutInstruction": {
          "id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c",
          "beneficiaryId": "0db9b611-9754-454d-951d-d691e1265148",
          "beneficiarySnapshot": {
            "id": "0db9b611-9754-454d-951d-d691e1265148",
            "firstName": "Fatima",
            "lastName": "Ali",
            "displayName": "Fatima Ali"
          },
          "sourceCurrencyAmount": "1644.12",
          "amount": "150000.00"
        },
        "createdAt": "2026-06-05T09:15:30.678Z"
      }
    ],
    "fxExchange": {
      "id": "f9e8d7c6-b5a4-3f2e-1d0c-9b8a7f6e5d4c",
      "payrollRequestId": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
      "fromCurrencyCode": "AED",
      "toCurrencyCode": "PKR",
      "fromAmount": "5730.12",
      "toAmount": "460000.00",
      "exchangeRate": "80.2850",
      "feeDetails": {
        "id": "k0j9i8h7-g6f5-e4d3-c2b1-a0a9f8e7d6c5",
        "amount": "25.00",
        "finalInternalFee": "25.00"
      },
      "recordedByUserId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "recordedByUser": {
        "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@relm.co"
      },
      "recordedAt": "2026-06-05T10:00:00.000Z",
      "createdAt": "2026-06-05T10:00:00.123Z"
    },
    "customer": {
      "id": "c9a8b7d6-5e4f-3d2c-1b0a-9f8e7d6c5b4a",
      "firstName": "Business",
      "lastName": "Owner",
      "company": {
        "legalName": "Tech Innovations Ltd"
      }
    },
    "createdAt": "2026-06-05T09:15:30.123Z",
    "updatedAt": "2026-06-05T10:35:00.789Z"
  }
}
```

### Response Structure

The response contains comprehensive information organized into the following sections:

#### Core Request Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier for the payroll request |
| `status` | Enum | Current request status (see [Status Workflow](#status-workflow)) |
| `totalAmount` | Decimal | Total amount debited from source account |
| `estimatedFxRate` | Decimal | Estimated exchange rate from initial calculation |
| `estimatedReceivedAmount` | Decimal | Total estimated amount beneficiaries will receive |
| `sourceAmountForExchange` | Decimal | Amount available for FX conversion (total - fees) |
| `createdAt` | ISO8601 | Request creation timestamp |
| `updatedAt` | ISO8601 | Last update timestamp |

#### Quote-Related Fields

| Field | Type | Description |
|-------|------|-------------|
| `quoteExpiresAt` | ISO8601 | When the admin-provided quote expires |
| `quotedAt` | ISO8601 | When the quote was provided |
| `quotedByUserId` | UUID | Admin user ID who provided the quote |
| `quotedByUser` | Object | Admin user details (name, email) |
| `acceptedByCustomerAt` | ISO8601 | When customer accepted the quote |

#### Account Information

| Field | Type | Description |
|-------|------|-------------|
| `sourceAccountCurrency` | Object | Complete source account details with balance and currency |
| `payrollAccountCurrency` | Object | Payroll account details (typically MCB PKR account) |

#### Fee Breakdown (metadata.feeBreakdown)

| Field | Type | Description |
|-------|------|-------------|
| `sourceCurrencyAmount` | Decimal | Base amount in source currency |
| `spreadFee` | Decimal | FX spread fee |
| `fuseFee` | Decimal | Payment processor fee |
| `mcbFee` | Decimal | Bank transfer fees (per beneficiary) |
| `totalFee` | Decimal | Sum of all fees |
| `exchangeRate` | Decimal | Effective exchange rate (with spread applied) |
| `baseRate` | Decimal | Base exchange rate before spread |
| `payrollCurrencyCode` | String | Payroll currency code |
| `feeCurrencyCode` | String | Fee currency code |

#### Amount Split Details

Each entry in `amountSplitDetails` contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Amount split unique identifier |
| `beneficiaryId` | UUID | Reference to beneficiary |
| `beneficiarySnapshot` | Object | Immutable copy of beneficiary details |
| `sourceCurrencyAmount` | Decimal | Amount in source currency |
| `amount` | Decimal | Amount in payroll currency |
| `purposeCode` | String | MCB purpose code (FCISS, PEN, OFS) |
| `payoutTransferId` | UUID | Linked MCB_TO_BENEFICIARY transfer ID |

#### Transfers

Each entry in `transfers` contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Transfer unique identifier |
| `transferType` | Enum | FUSE_INTERNAL_DEBIT, FUSE_TO_MCB, or MCB_TO_BENEFICIARY |
| `status` | Enum | PENDING, INITIATED, PROCESSING, COMPLETED, or FAILED |
| `externalId` | String | External system transaction ID |
| `amount` | Decimal | Transfer amount |
| `currencyCode` | String | Currency code |
| `feeDetails` | Object | Fee information (if applicable) |
| `payoutInstruction` | Object | Linked amount split details (for MCB_TO_BENEFICIARY only) |
| `executedAt` | ISO8601 | When transfer execution started |
| `completedAt` | ISO8601 | When transfer completed |
| `failureReason` | String | Failure reason (if status is FAILED) |

#### FX Exchange

The `fxExchange` object contains actual exchange details provided by admin:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | FX exchange record ID |
| `fromCurrencyCode` | String | Source currency |
| `toCurrencyCode` | String | Target currency |
| `fromAmount` | Decimal | Amount exchanged from source |
| `toAmount` | Decimal | Amount received in target |
| `exchangeRate` | Decimal | Actual exchange rate used |
| `recordedByUser` | Object | Admin who recorded the exchange |
| `recordedAt` | ISO8601 | When exchange was recorded |

### Status Workflow

Understanding the status progression helps interpret the request state:

| Status | Description | Next Actions |
|--------|-------------|--------------|
| `PENDING` | Source funds debited, awaiting admin quote | Wait for admin to provide quote |
| `QUOTE_PROVIDED` | Admin provided FX quote | Accept quote or cancel |
| `QUOTE_ACCEPTED` | Customer accepted quote | System executes transfers |
| `EXECUTING` | Currency conversion in progress | Monitor transfers |
| `PAYOUT_INITIATED` | Individual payouts started | Monitor individual transfers |
| `COMPLETED` | All beneficiaries paid | Review final amounts |
| `PARTIALLY_COMPLETED` | Some payouts succeeded, some failed | Check failed transfers |
| `FAILED` | Request failed | Contact support |
| `CANCELLED` | Request cancelled | No further action |

### Error Cases

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

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Payroll request not found or access denied"
  }
}
```

### Use Cases

#### Monitoring Request Progress

Poll this endpoint periodically to track status changes:

```bash
# Check every 30 seconds while status is EXECUTING or PAYOUT_INITIATED
while true; do
  curl -s 'https://sandbox.api.relm.co/v1/customers/payroll/requests/babe5f2d-7c44-4b83-90b9-f94856ed4643' \
    -H 'Authorization: Bearer <token>' | jq '.data.status'
  sleep 30
done
```

#### Reviewing Quote Before Acceptance

Before accepting the quote, compare estimated vs. actual rates:

```json
{
  "estimatedFxRate": "91.2450"
}
```

#### Tracking Individual Beneficiary Payouts

Filter `transfers` array for `MCB_TO_BENEFICIARY` type to monitor individual payouts:

```javascript
const beneficiaryPayouts = data.transfers.filter(
  t => t.transferType === 'MCB_TO_BENEFICIARY'
);

beneficiaryPayouts.forEach(payout => {
  console.log(
    `${payout.payoutInstruction.beneficiarySnapshot.displayName}: ${payout.status}`
  );
});
```

### Important Notes

- **Real-Time Updates**: Status and transfer information reflect the current state
- **Beneficiary Snapshots**: Immutable copies preserved for audit purposes
- **Fee Transparency**: Complete fee breakdown available in `metadata.feeBreakdown`
- **Transfer Tracking**: Use `payoutTransferId` to link amount splits with their corresponding transfers
- **Quote Comparison**: Compare `estimatedFxRate` with `fxExchange.exchangeRate` to understand rate differences

### Related Endpoints

- [Accept Payroll Quote](accept-payroll-quote) — Accept the admin-provided quote
- [Cancel Payroll Request](cancel-payroll-request) — Cancel the request
- [List Payroll Transfers](list-payroll-transfers) — View all beneficiary payouts
