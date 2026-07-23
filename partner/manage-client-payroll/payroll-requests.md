---
title: Payroll Requests
layout: home
permalink: /partner/manage-client-payroll/requests
parent: Manage Client Payroll
nav_order: 2
---

# Payroll Requests

## Shared: Payroll Request Object

The object returned by create / get / accept / cancel, and in each item of the list response:

```json
{
  "id": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
  "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
  "sourceAccountCurrency": {
    "id": "385dec3a-9bfe-4072-8733-7872ef350e71",
    "balance": "50000.00",
    "available": "44154.68",
    "currency": {
      "currencyCode": "AED",
      "currencyName": "United Arab Emirates Dirham",
      "currencySymbol": "د.إ"
    }
  },
  "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
  "payrollAccountCurrency": {
    "id": "fae535c5-f64f-4737-82de-c12b88be0764",
    "currency": { "currencyCode": "PKR", "currencyName": "Pakistani Rupee" }
  },
  "totalAmount": "5845.32",
  "status": "QUOTE_PROVIDED",
  "estimatedFxRate": "91.2450",
  "estimatedReceivedAmount": "457892.50",
  "quoteExpiresAt": "2026-07-23T12:39:56.000Z",
  "acceptedByCustomerAt": null,
  "cancellationReason": null,
  "failureReason": null,
  "sourceAmountForExchange": "5730.12",
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
        "bankName": "MCB Bank"
      },
      "sourceCurrencyAmount": "5000.00",
      "amount": "456062.50",
      "purposeCode": "FCISS",
      "payoutTransferId": "e4d3c2b1-0a9f-8e7d-6c5b-4a3f2e1d0c9b",
      "createdAt": "2026-07-23T12:34:56.000Z",
      "updatedAt": "2026-07-23T12:34:56.000Z"
    }
  ],
  "transfers": [],
  "createdAt": "2026-07-23T12:34:56.000Z",
  "updatedAt": "2026-07-23T12:34:56.000Z"
}
```

`status` is one of: `PENDING`, `QUOTE_PROVIDED`, `QUOTE_ACCEPTED`, `EXECUTING`,
`PAYOUT_INITIATED`, `COMPLETED`, `PARTIALLY_COMPLETED`, `FAILED`, `CANCELLED`.

{: .note }
`estimatedReceivedAmount` and `sourceAmountForExchange` are derived from `metadata.feeBreakdown`
and appear once a fee breakdown is present on the request.

---

## Create Payroll Request

{: .endpoint-desc }
Creates a payroll request from a previously estimated `feeHash`. Funds are debited from the
source account and the request enters `PENDING` awaiting a quote. Recorded as a partner action
in the customer's audit log.

### Request

```
Method:   POST
URL:      {{baseUrl}}/v1/client/:customerId/payroll/requests
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `sourceAccountCurrencyId` | string (UUID) | Yes | Must match the estimate behind `feeHash`. |
| `payrollAccountCurrencyId` | string (UUID) | Yes | Must match the estimate behind `feeHash`. |
| `feeHash` | string | Yes | Hash returned by the fee estimate; must be unexpired and unused. |
| `amountSplitDetails` | array | Yes | Per-beneficiary splits. |
| `amountSplitDetails[].beneficiaryId` | string (UUID) | Yes | Beneficiary receiving this portion. |
| `amountSplitDetails[].amount` | string (decimal) | Yes | Amount, `> 0`. |
| `amountSplitDetails[].purpose` | string | Yes | Valid MCB purpose code. |
| `amountSplitDetails[].amountCurrencyType` | string | No | `SOURCE` (default) or `PAYROLL`. |

### Example Request

```json
{
  "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
  "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
  "feeHash": "a7c8f3d2-4b9e-4d1a-8f2c-9e7d6c5b4a3f",
  "amountSplitDetails": [
    { "beneficiaryId": "5b9d9177-2261-458d-b65b-c6722cc75a90", "amount": "5000.00", "purpose": "FCISS" },
    { "beneficiaryId": "0db9b611-9754-454d-951d-d691e1265148", "amount": "150000.00", "purpose": "PEN", "amountCurrencyType": "PAYROLL" }
  ]
}
```

### Response

```
Status: 201 Created
```

Returns the [payroll request object](#shared-payroll-request-object) with status `PENDING`.

```json
{ "success": true, "data": { "...payroll request object..." } }
```

Invalid input or an expired/mismatched `feeHash` returns `400`; an unowned customer returns `403`.

---

## List Payroll Requests

{: .endpoint-desc }
Returns a paginated list of the customer's payroll requests, most recent first by default.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/payroll/requests
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `status` | string | No | Filter by `PayrollRequestStatus`. |
| `startDate` | string (date-time) | No | Filter by created-at lower bound. |
| `endDate` | string (date-time) | No | Filter by created-at upper bound. |
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
  "data": [ { "...payroll request object..." } ],
  "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
}
```

---

## Get Payroll Request by ID

{: .endpoint-desc }
Returns a single payroll request owned by the customer, including its amount splits and transfers.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/payroll/requests/:requestId
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |
| `requestId` | string (UUID) | Yes | ID of the payroll request. |

### Response

```
Status: 200 OK
```

```json
{ "success": true, "data": { "...payroll request object..." } }
```

A request that does not exist or does not belong to the customer returns `404 Not Found`.

---

## Accept Payroll Quote

{: .endpoint-desc }
Accepts the quote on a payroll request in `QUOTE_PROVIDED` status, moving it toward execution.
Recorded as a partner action in the customer's audit log.

### Request

```
Method:   PATCH
URL:      {{baseUrl}}/v1/client/:customerId/payroll/requests/:requestId/accept
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |
| `requestId` | string (UUID) | Yes | ID of the payroll request. |

### Response

```
Status: 200 OK
```

Returns the [payroll request object](#shared-payroll-request-object) with status `QUOTE_ACCEPTED`.

```json
{ "success": true, "data": { "...payroll request object (status QUOTE_ACCEPTED)..." } }
```

An invalid status transition or an expired quote returns `400`.

---

## Cancel Payroll Request

{: .endpoint-desc }
Cancels a payroll request that has not yet been executed. Recorded as a partner action in the
customer's audit log.

### Request

```
Method:   DELETE
URL:      {{baseUrl}}/v1/client/:customerId/payroll/requests/:requestId
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |
| `requestId` | string (UUID) | Yes | ID of the payroll request. |

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `cancellationReason` | string | No | Optional free-text reason stored on the request. |

### Response

```
Status: 200 OK
```

Returns the [payroll request object](#shared-payroll-request-object) with status `CANCELLED`.

```json
{ "success": true, "data": { "...payroll request object (status CANCELLED)..." } }
```

Cancelling a request that is already executing or completed returns `400`.
