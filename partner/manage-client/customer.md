---
title: Client Customer
layout: endpoint
try_it:
  - op: getClientCustomer
    heading: "Get Client Customer"
try_it_spec: /assets/openapi/partner.json
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
  "data": {
    "id": "eed9d8fd-b35b-4e8f-b08f-6efe26126976",
    "customerType": "BUSINESS",
    "customerAddressId": null,
    "terms": true,
    "privacyPolicy": true,
    "accountApplicationStatus": "APPROVED",
    "verificationResult": "APPROVED",
    "createdAt": "2026-04-02T06:32:56.678Z",
    "updatedAt": "2026-06-05T11:04:00.929Z",
    "productActivations": {
      "XBD_BANKING": "APPROVED",
      "XBD_PAYROLL": "APPROVED"
    },
    "company": {
      "id": "4887a903-5678-47e5-845f-35edb9b996d0",
      "customerId": "eed9d8fd-b35b-4e8f-b08f-6efe26126976",
      "name": "CompanyCo",
      "displayName": null,
      "registrationNumber": null,
      "registeredAddress": null,
      "industryName": null,
      "createdAt": "2026-04-02T06:32:56.695Z",
      "updatedAt": "2026-04-02T06:32:56.695Z"
    },
    "user": {
      "id": "092f4680-1dea-4186-b404-96505eb28b55",
      "email": "owner@companyco.com",
      "firstName": "Business",
      "lastName": "Owner",
      "emailVerified": true,
      "phone": null,
      "status": "ACTIVE",
      "createdAt": "2026-04-02T06:32:56.658Z",
      "updatedAt": "2026-07-15T12:01:02.479Z",
      "roles": ["MERCHANT_ADMIN", "CUSTOMER"]
    },
    "questionnaireStatus": "COMPLETED"
  }
}
```

`data` contains the customer record together with its associated `company` and `user` details. A request for a customer that cannot be found returns `404 Not Found`.
