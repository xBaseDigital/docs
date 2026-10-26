---
title: Client Payouts
layout: endpoint
try_it:
  - op: getClientPayoutFeeEstimate
    heading: "Estimate Payout Fee"
  - op: sendClientPayoutOtp
    heading: "Send Payout Verification Code"
  - op: createClientPayout
    heading: "Create Payout"
try_it_spec: /assets/openapi/partner.json
permalink: /partner/manage-client/payouts
parent: Manage Client Banking
nav_order: 5
---

# Client Payouts

Initiate single-beneficiary payouts on behalf of a customer you own. A payout is a
three-step flow: estimate the fee to obtain a `feeHash`, send a payout verification
code (OTP) to the customer, then create the payout supplying both the `feeHash` and the
`otp`. Creating a payout is recorded in the customer's audit log as a **partner action**.

{: .note }
All payout endpoints are account-scoped. The `:accountId` is resolved and validated against
the customer before the handler runs; an account that does not exist or does not belong to
the customer returns `404 Account not found`.

---

## Estimate Payout Fee

{: .endpoint-desc }
Calculates the estimated fee for a payout to a beneficiary and returns a `feeHash` that must
be supplied when creating the payout.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/payouts/estimate
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |
| `accountId` | string (UUID) | Yes | ID of the account. Must belong to the customer. |

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `amount` | number | Yes | Payout amount, `> 0`, max 2 decimal places. |
| `currency` | string | Yes | 3–5 character uppercase currency code. |
| `beneficiaryId` | string (UUID) | No | Beneficiary the payout will be sent to. |

### Response

```
Status: 200 OK
```

```json
{
  "success": true,
  "data": {
    "amount": 2,
    "currency": "AED",
    "fee": 30,
    "feeCurrency": "AED",
    "estimatedDate": "2026-07-23T12:00:12.684Z",
    "isEstimateAvailable": true,
    "totalAmount": 42,
    "internalFee": 10,
    "ruleSet": true,
    "totalFee": 40,
    "feeHash": "r750BpqEQ1ASH6/PCQzuxw==:zg10fJ5x8eian4W41Liuzw==:QsmcVo4dVXJlMwy1DNNL..."
  }
}
```

`feeHash` is required by the create-payout endpoint. Invalid input returns `400`; an unowned
customer returns `403`.

---

## Send Payout Verification Code

{: .endpoint-desc }
Sends a one-time payout verification code (OTP) to the customer. The returned `otp` must be
supplied when creating the payout.

### Request

```
Method:   POST
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/payout/two-factor
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |
| `accountId` | string (UUID) | Yes | ID of the account. Must belong to the customer. |

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `templateName` | string | No | Email template for the code: `partnerPayoutVerificationCode` (default) or `payoutVerificationCode`. |
| `hash` | string | No | Optional context hash associated with the verification. |

### Example Request

```json
{
  "templateName": "partnerPayoutVerificationCode"
}
```

### Response

```
Status: 200 OK
```

```json
{
  "success": true,
  "data": "Payout verification code sent via EMAIL"
}
```

`data` is a human-readable message describing the delivery mode (e.g. `EMAIL` or `SMS`).

---

## Create Payout

{: .endpoint-desc }
Creates a payout to a beneficiary from the customer's account. Requires a valid `feeHash`
(from the estimate) and a valid `otp` (from the verification step). Recorded as a partner
action in the customer's audit log.

### Request

```
Method:   POST
URL:      {{baseUrl}}/v1/client/:customerId/accounts/:accountId/payout
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |
| `accountId` | string (UUID) | Yes | ID of the account. Must belong to the customer. |

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `beneficiaryId` | string (UUID) | Yes | Beneficiary receiving the payout. |
| `amount` | string (decimal) | Yes | Payout amount, `> 0`, max 2 decimal places. |
| `currency` | string | Yes | Currency code (alphabetic). |
| `idempotencyKey` | string (UUID) | Yes | Unique key to make the request idempotent. |
| `otp` | string | Yes | 6-digit payout verification code from the two-factor step. |
| `feeHash` | string | No | Fee hash from the estimate; locks the quoted fee. |
| `purpose` | string | No | Transaction purpose code (see [Create Payout Request](/banking/endpoints/payout/create-payout-request) for the list). |
| `description` | string | Conditional | Required when `purpose` is `Other` (case-sensitive). |
| `reference` | string | No | Payment reference. Max 35 characters. |

### Example Request

```json
{
  "beneficiaryId": "0db9b611-9754-454d-951d-d691e1265148",
  "amount": "111.00",
  "currency": "GBP",
  "purpose": "salaries",
  "idempotencyKey": "89cd72f0-de8e-44af-b029-5647fef59036",
  "otp": "482913",
  "feeHash": "UMNZlYjrsYwLhcCrbGp+wQ==:pRejW8igJX4wJiptMVwT6Q==:RV5sgTjbYYVUSRgh1M14..."
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
    "id": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
    "idempotencyKey": "89cd72f0-de8e-44af-b029-5647fef59036",
    "status": "PENDING",
    "type": "DEBIT",
    "assetType": "FIAT",
    "accountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
    "amount": "111.00",
    "currency": {
      "currencyCode": "GBP",
      "currencyName": "Pound Sterling",
      "currencyType": "FIAT"
    },
    "recipient": {
      "id": "0db9b611-9754-454d-951d-d691e1265148",
      "name": "Beneficiary Name",
      "type": "INDIVIDUAL",
      "status": "ACTIVE",
      "currencyCode": "GBP"
    },
    "paymentMethod": "LOCAL",
    "feeAmount": "40",
    "totalAmount": "151.00",
    "netAmount": "111.00",
    "runningBalance": "76205.12",
    "runningAvailableBalance": "76054.12",
    "createdAt": "2026-07-23T12:15:05.245Z",
    "updatedAt": "2026-07-23T12:15:06.386Z"
  }
}
```

An invalid or missing `otp` returns `401`; an invalid or expired `feeHash`, insufficient
balance, or invalid input returns `400`; an unowned customer returns `403`.

## Possible values

The payout in the response is a transaction, with these values:

{% include enums/transaction-values.md %}
