---
title: Payroll Fee Estimate
layout: endpoint
try_it:
  - op: clientEstimatePayrollFee
    heading: "Estimate Payroll Fee"
try_it_spec: /assets/openapi/partner.json
permalink: /partner/manage-client-payroll/fee-estimate
parent: Manage Client Payroll
nav_order: 1
---

# Payroll Fee Estimate

## Estimate Payroll Fee

{: .endpoint-desc }
Estimates the total amount, fee, and FX for a payroll run across one or more beneficiaries, and
returns a short-lived `feeHash` that must be supplied when creating the payroll request.

### Request

```
Method:   POST
URL:      {{baseUrl}}/v1/client/:customerId/payroll/estimate
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `sourceAccountCurrencyId` | string (UUID) | Yes | Account-currency the payroll is funded from. |
| `payrollAccountCurrencyId` | string (UUID) | Yes | Payroll account-currency the funds are converted into. |
| `amountSplitDetails` | array | Yes | Non-empty list of per-beneficiary splits (no duplicate `beneficiaryId`). |
| `amountSplitDetails[].beneficiaryId` | string (UUID) | Yes | Beneficiary receiving this portion. |
| `amountSplitDetails[].amount` | string (decimal) | Yes | Amount, `> 0`. Max 8 decimal places for `SOURCE`, max 2 for `PAYROLL`. |
| `amountSplitDetails[].amountCurrencyType` | string | No | `SOURCE` (default) or `PAYROLL` — which currency `amount` is denominated in. |

### Example Request

```json
{
  "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
  "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
  "amountSplitDetails": [
    { "beneficiaryId": "5b9d9177-2261-458d-b65b-c6722cc75a90", "amount": "5000.00", "amountCurrencyType": "SOURCE" },
    { "beneficiaryId": "0db9b611-9754-454d-951d-d691e1265148", "amount": "150000.00", "amountCurrencyType": "PAYROLL" }
  ]
}
```

### Response

```
Status: 200 OK
```

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
    "expiresAt": "2026-07-23T12:34:56.000Z"
  }
}
```

`feeHash` is valid until `expiresAt` and is consumed when the payroll request is created; a
create request with an expired or mismatched hash fails with `400`. Invalid input returns `400`;
an unowned customer returns `403`.
