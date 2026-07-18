---
title: Client Customer
layout: home
permalink: /partner/manage-client/customer
parent: Manage Client Banking
nav_order: 1
---

# Client Customer

## Get Client Customer

{: .endpoint-desc }
Returns the profile and company details for a customer owned by the authenticated partner.

### Request

```
Method:   GET
URL:      {{baseUrl}}/v1/client/:customerId
Auth:     PARTNER | PARTNER_ADMIN
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customerId` | string (UUID) | Yes | ID of the customer. Must be linked to the authenticated partner. |

### Response

```
Status: 200 OK
```

```json
{
  "success": true,
  "data": { }
}
```

`data` contains the customer record together with its associated company details. A request for a customer that cannot be found returns `404 Not Found`.
