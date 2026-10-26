---
title: List Payroll Requests
layout: endpoint
try_it: listPayrollRequests
try_it_spec: /assets/openapi/payroll.json
permalink: /payroll/endpoints/list-payroll-requests
parent: Payroll API
nav_order: 5
---

## List Payroll Requests

{: .endpoint-desc }
This endpoint retrieves a paginated list of all payroll requests for the authenticated customer. Supports filtering by status and pagination parameters.

### Request

```
Method: GET
URL: {{baseUrl}}/v1/customers/payroll/requests
Authentication: Requires Bearer token
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | String | ❌ | Filter by request status (case-sensitive) |
| `page` | Integer | ❌ | Page number (default: 1) |
| `limit` | Integer | ❌ | Results per page (default: 20, max: 100) |

### Status Filter Values

Filter by one of the following status values:
- `PENDING`
- `QUOTE_PROVIDED`
- `QUOTE_ACCEPTED`
- `EXECUTING`
- `PAYOUT_INITIATED`
- `COMPLETED`
- `PARTIALLY_COMPLETED`
- `FAILED`
- `CANCELLED`

For detailed status descriptions, see [Enums & Types](enums-and-types#payroll-request-status).

### Example Requests

**List all requests:**
```bash
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/requests' \
  --header 'Authorization: Bearer <your_access_token>'
```

**Filter by status:**
```bash
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/requests?status=COMPLETED' \
  --header 'Authorization: Bearer <your_access_token>'
```

**With pagination:**
```bash
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/requests?page=2&limit=10' \
  --header 'Authorization: Bearer <your_access_token>'
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** Returns a paginated list of payroll requests with summary information.

```json
{
  "success": true,
  "data": [
    {
      "id": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
      "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
      "sourceAccountCurrency": {
        "id": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "currency": {
          "currencyCode": "AED",
          "currencyName": "United Arab Emirates Dirham"
        }
      },
      "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
      "payrollAccountCurrency": {
        "id": "fae535c5-f64f-4737-82de-c12b88be0764",
        "currency": {
          "currencyCode": "PKR",
          "currencyName": "Pakistani Rupee"
        }
      },
      "totalAmount": "5845.32",
      "status": "COMPLETED",
      "estimatedReceivedAmount": "460000.00",
      "metadata": {
        "feeBreakdown": {
          "totalFee": "845.32"
        }
      },
      "createdAt": "2026-06-05T09:15:30.123Z",
      "updatedAt": "2026-06-05T11:45:20.789Z"
    },
    {
      "id": "c8d7e6f5-4a3b-2c1d-0e9f-8a7b6c5d4e3f",
      "sourceAccountCurrencyId": "385dec3a-9bfe-4072-8733-7872ef350e71",
      "sourceAccountCurrency": {
        "id": "385dec3a-9bfe-4072-8733-7872ef350e71",
        "currency": {
          "currencyCode": "AED",
          "currencyName": "United Arab Emirates Dirham"
        }
      },
      "payrollAccountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
      "payrollAccountCurrency": {
        "id": "fae535c5-f64f-4737-82de-c12b88be0764",
        "currency": {
          "currencyCode": "PKR",
          "currencyName": "Pakistani Rupee"
        }
      },
      "totalAmount": "3250.00",
      "status": "QUOTE_PROVIDED",
      "estimatedReceivedAmount": "275000.00",
      "quoteExpiresAt": "2026-06-05T18:00:00.000Z",
      "metadata": {
        "feeBreakdown": {
          "totalFee": "250.00"
        }
      },
      "createdAt": "2026-06-04T14:20:15.456Z",
      "updatedAt": "2026-06-04T15:00:00.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Response Fields

#### Data Array

Each payroll request in the `data` array contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier for the payroll request |
| `sourceAccountCurrencyId` | UUID | Source account currency ID |
| `sourceAccountCurrency` | Object | Source account currency details |
| `payrollAccountCurrencyId` | UUID | Payroll account currency ID |
| `payrollAccountCurrency` | Object | Payroll account currency details |
| `totalAmount` | Decimal | Total amount debited (including fees) |
| `status` | Enum | Current request status |
| `estimatedReceivedAmount` | Decimal | Total amount beneficiaries will receive |
| `quoteExpiresAt` | ISO8601 | Quote expiration (if status is QUOTE_PROVIDED) |
| `metadata` | Object | Contains fee breakdown summary |
| `createdAt` | ISO8601 | Request creation timestamp |
| `updatedAt` | ISO8601 | Last update timestamp |

#### Pagination Object

| Field | Type | Description |
|-------|------|-------------|
| `page` | Integer | Current page number |
| `limit` | Integer | Results per page |
| `total` | Integer | Total number of requests matching filter |
| `totalPages` | Integer | Total number of pages |
| `hasNextPage` | Boolean | Whether there are more results |
| `hasPreviousPage` | Boolean | Whether there are previous results |

### Sorting

Results are sorted by `createdAt` in descending order (newest first).

### Error Cases

#### 400 Bad Request

**Invalid status value:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid status value. Must be one of: PENDING, QUOTE_PROVIDED, QUOTE_ACCEPTED, EXECUTING, PAYOUT_INITIATED, COMPLETED, PARTIALLY_COMPLETED, FAILED, CANCELLED"
  }
}
```

**Invalid pagination parameters:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Page must be a positive integer"
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

### Use Cases

#### Dashboard Overview

Get recent payroll requests for display on a dashboard:

```bash
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/requests?limit=5' \
  --header 'Authorization: Bearer <your_access_token>'
```

#### Pending Actions

Find requests awaiting customer action (quote acceptance):

```bash
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/requests?status=QUOTE_PROVIDED' \
  --header 'Authorization: Bearer <your_access_token>'
```

#### Historical Records

Retrieve completed payroll requests for reconciliation:

```bash
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/requests?status=COMPLETED&limit=50' \
  --header 'Authorization: Bearer <your_access_token>'
```

#### Failed Requests Investigation

Identify failed requests for support investigation:

```bash
curl --location 'https://sandbox.api.relm.co/v1/customers/payroll/requests?status=FAILED' \
  --header 'Authorization: Bearer <your_access_token>'
```

### Pagination Navigation

Example of navigating through pages:

```javascript
let page = 1;
let allRequests = [];

async function fetchAllRequests() {
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(
      `https://sandbox.api.relm.co/v1/customers/payroll/requests?page=${page}&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    const { data, pagination } = await response.json();
    allRequests = allRequests.concat(data);
    
    hasMore = pagination.hasNextPage;
    page++;
  }
  
  return allRequests;
}
```

### Performance Considerations

- **Default Limit**: 20 results per page for optimal performance
- **Maximum Limit**: 100 results per page (higher values will be capped)
- **Filtering**: Using status filter reduces result set and improves response time
- **Caching**: Consider caching results on the client side for frequently accessed pages

### Important Notes

- **Customer Scope**: Only returns requests belonging to the authenticated customer
- **Status Filtering**: Must match exact enum values (case-sensitive)
- **Sort Order**: Always newest first (cannot be changed)
- **Summary Information**: For complete details, use [Get Payroll Request](get-payroll-request)
- **Real-Time Updates**: Status reflects current state at query time

### Related Endpoints

- [Get Payroll Request](get-payroll-request) — Get detailed information for a specific request
- [Create Payroll Request](create-payroll-request) — Create a new payroll request
- [List Payroll Transfers](list-payroll-transfers) — View individual beneficiary payouts across all requests
