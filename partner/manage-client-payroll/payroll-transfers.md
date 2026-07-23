---
title: Payroll Transfers
layout: home
permalink: /partner/manage-client-payroll/transfers
parent: Manage Client Payroll
nav_order: 3
---

# Payroll Transfers

## List Payroll Transfers

{: .endpoint-desc }
Returns a paginated list of the beneficiary transfers (`MCB_TO_BENEFICIARY`) produced by the
customer's payroll requests, each with its payout instruction, fee details, and the source
payroll request.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/payroll/transfers
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `search` | string | No | Search by transfer ID or beneficiary name. |
| `status` | string | No | Comma-separated `PayrollTransferStatus` values: `PENDING`, `INITIATED`, `PROCESSING`, `COMPLETED`, `FAILED`. |
| `startDate` | string (date-time) | No | Lower bound on created-at. |
| `endDate` | string (date-time) | No | Upper bound on created-at. |
| `page` | integer | No | Page number. Default `1`. |
| `limit` | integer | No | Page size. Default `20`. |
| `sort` | string | No | `asc` or `desc`. Default `desc`. |

### Response

```
Status: 200 OK
```

```json
{
  "success": true,
  "data": [
    {
      "id": "e4d3c2b1-0a9f-8e7d-6c5b-4a3f2e1d0c9b",
      "payrollRequestId": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
      "transferType": "MCB_TO_BENEFICIARY",
      "status": "COMPLETED",
      "externalId": "mcb_tx_987654321",
      "amount": "456062.50",
      "currencyCode": "PKR",
      "feeDetails": {
        "id": "j9i8h7g6-f5e4-d3c2-b1a0-9f8e7d6c5b4a",
        "amount": "100.00",
        "finalInternalFee": "100.00"
      },
      "failureReason": null,
      "metadata": {},
      "executedAt": "2026-07-23T12:40:10.000Z",
      "completedAt": "2026-07-23T12:41:02.000Z",
      "payoutInstruction": {
        "id": "d3c2b1a0-9f8e-7d6c-5b4a-3f2e1d0c9b8a",
        "beneficiaryId": "5b9d9177-2261-458d-b65b-c6722cc75a90",
        "beneficiarySnapshot": {
          "id": "5b9d9177-2261-458d-b65b-c6722cc75a90",
          "firstName": "Ahmed",
          "lastName": "Khan",
          "displayName": "Ahmed Khan",
          "iban": "PK36MUCB0000001234567890",
          "bankName": "MCB Bank",
          "type": "INDIVIDUAL"
        },
        "sourceCurrencyAmount": "5000.00",
        "amount": "456062.50",
        "sourceCurrency": { "currencyCode": "AED", "currencyName": "United Arab Emirates Dirham" }
      },
      "payrollRequest": {
        "id": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
        "status": "COMPLETED",
        "amount": "5845.32",
        "sourceAccountCurrency": {
          "id": "385dec3a-9bfe-4072-8733-7872ef350e71",
          "currency": { "currencyCode": "AED", "currencyName": "United Arab Emirates Dirham" }
        }
      },
      "createdAt": "2026-07-23T12:40:00.000Z",
      "updatedAt": "2026-07-23T12:41:02.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
}
```

{: .note }
`transferType` is always `MCB_TO_BENEFICIARY` for this endpoint — it lists the individual
beneficiary payouts, not the source-account debit. Use `payrollRequestId` to link a transfer
back to its [payroll request](/partner/manage-client-payroll/requests).
