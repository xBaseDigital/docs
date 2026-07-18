---
title: Cancel Payroll Request
layout: home
permalink: /payroll/endpoints/cancel-payroll-request
parent: Payroll API
nav_order: 6
---

## Cancel Payroll Request

{: .endpoint-desc }
This endpoint allows a customer to cancel a payroll request that has not yet been executed. Requests can only be cancelled in specific statuses. Once cancelled, the source funds are returned to the customer's account.

### Request

```
Method: DELETE
URL: {{baseUrl}}/v1/customers/payroll/requests/:requestId
Path Parameters: requestId - The unique identifier of the payroll request
Authentication: Requires Bearer token
Content-Type: application/json
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requestId` | UUID | ✅ | The unique identifier of the payroll request |

### Request Body

```json
{
  "cancellationReason": "Customer requested cancellation due to incorrect beneficiary details"
}
```

### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cancellationReason` | String | ❌ | Reason for cancellation (optional for customer, required for admin) |

### Example Request

```bash
curl --location --request DELETE \
  'https://sandbox.api.relm.co/v1/customers/payroll/requests/babe5f2d-7c44-4b83-90b9-f94856ed4643' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <your_access_token>' \
  --data '{
    "cancellationReason": "Customer requested cancellation due to incorrect beneficiary details"
  }'
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** On successful cancellation, returns the updated payroll request with status `CANCELLED`.

```json
{
  "success": true,
  "data": {
    "id": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
    "status": "CANCELLED",
    "cancellationReason": "Customer requested cancellation due to incorrect beneficiary details",
    "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
    "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
    "totalAmount": "5845.32",
    "estimatedReceivedAmount": "457892.50",
    "createdAt": "2026-06-05T09:15:30.123Z",
    "updatedAt": "2026-06-05T09:45:15.456Z"
  }
}
```

### Response Fields

- `success`: Boolean indicating request success
- `data`: Updated payroll request object
  - `id`: Payroll request UUID
  - `status`: Updated to `CANCELLED`
  - `cancellationReason`: Provided cancellation reason
  - _(other fields omitted for brevity - see [Get Payroll Request](get-payroll-request) for full schema)_

### Cancellable Statuses

Requests can be cancelled when in the following statuses:

| Status | Can Cancel | Notes |
|--------|------------|-------|
| `PENDING` | ✅ Yes | Before admin provides quote |
| `QUOTE_PROVIDED` | ✅ Yes | After quote provided, before acceptance |
| `QUOTE_ACCEPTED` | ✅ Yes | After acceptance, before execution starts |
| `EXECUTING` | ❌ No | Execution in progress |
| `PAYOUT_INITIATED` | ❌ No | Payouts already initiated |
| `COMPLETED` | ❌ No | Already completed |
| `PARTIALLY_COMPLETED` | ❌ No | Some payouts completed |
| `FAILED` | ❌ No | Already failed |
| `CANCELLED` | ❌ No | Already cancelled |

### Cancellation Process

When a request is successfully cancelled:

1. **Status Update**: Request status changed to `CANCELLED`
2. **Fund Return**: Source account funds are returned (reversal of initial debit)
3. **Transfer Updates**: All pending transfers are marked as cancelled
4. **No Payouts**: No beneficiary payouts are executed
5. **Audit Trail**: Cancellation reason recorded for compliance

### Error Cases

#### 400 Bad Request

**Invalid status for cancellation:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS",
    "message": "Cannot cancel request in EXECUTING status. Cancellation is only allowed in PENDING, QUOTE_PROVIDED, or QUOTE_ACCEPTED status."
  }
}
```

**Already cancelled:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS",
    "message": "Request is already cancelled"
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

#### Cancel Before Quote Acceptance

Customer reviews the admin-provided quote and decides not to proceed:

```bash
# Get request details to review quote
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/requests/babe5f2d-7c44-4b83-90b9-f94856ed4643' \
  --header 'Authorization: Bearer <your_access_token>'

# Cancel if quote is not acceptable
curl --location --request DELETE \
  'https://sandbox.api.relm.co/v1/customers/payroll/requests/babe5f2d-7c44-4b83-90b9-f94856ed4643' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <your_access_token>' \
  --data '{
    "cancellationReason": "Exchange rate not acceptable"
  }'
```

#### Cancel After Accepting Quote (Before Execution)

Customer accepted quote but needs to cancel before execution starts:

```bash
curl --location --request DELETE \
  'https://sandbox.api.relm.co/v1/customers/payroll/requests/babe5f2d-7c44-4b83-90b9-f94856ed4643' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <your_access_token>' \
  --data '{
    "cancellationReason": "Incorrect beneficiary information detected"
  }'
```

#### Cancel Pending Request

Cancel a request that's waiting for admin quote:

```bash
curl --location --request DELETE \
  'https://sandbox.api.relm.co/v1/customers/payroll/requests/babe5f2d-7c44-4b83-90b9-f94856ed4643' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <your_access_token>' \
  --data '{
    "cancellationReason": "Business requirements changed"
  }'
```

### Fund Return Timeline

After successful cancellation:

- **Immediate**: Request status updated to `CANCELLED`
- **Within 1-2 hours**: Source account balance restored
- **Within 24 hours**: Available balance updated (may vary by provider)

**Note**: Exact timing depends on the payment provider (Fuse) processing times.

### Cancellation vs. Failure

| Aspect | Cancellation | Failure |
|--------|--------------|---------|
| **Initiated By** | Customer or Admin | System or Provider |
| **When** | Before/during early execution | During execution |
| **Fund Return** | Automatic | May require manual intervention |
| **Status** | `CANCELLED` | `FAILED` |
| **Retry** | Create new request | May be retried by admin |

### Important Notes

- **Timing Matters**: Cancel as early as possible to avoid execution
- **Fund Return**: Funds are returned, but timing varies by provider
- **No Partial Cancel**: Cannot cancel individual beneficiaries - entire request is cancelled
- **Audit Trail**: Cancellation reason stored permanently
- **Quote Expiration**: If quote expires before acceptance, admin may cancel automatically
- **After Execution**: Cannot cancel once execution begins (`EXECUTING` status or later)

### Best Practices

1. **Verify Before Accept**: Review quote details carefully before acceptance
2. **Quick Cancellation**: Cancel immediately if issues detected
3. **Provide Reason**: Include detailed cancellation reason for audit trail
4. **Check Status First**: Verify request is in cancellable status before attempting
5. **Monitor Refund**: Track source account to confirm fund return

### Related Endpoints

- [Get Payroll Request](get-payroll-request) — Check current status before cancelling
- [List Payroll Requests](list-payroll-requests) — Find cancellable requests
- [Accept Payroll Quote](accept-payroll-quote) — Accept quote instead of cancelling
