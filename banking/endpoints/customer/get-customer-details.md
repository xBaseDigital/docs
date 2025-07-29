---
title: Get Customer Details
layout: home
permalink: /banking/endpoints/customer/get-customer-details
parent: Customer
nav_order: 1
---

## Get Customer Details

{: .endpoint-desc }
This endpoint retrieves the details of the currently authenticated customer. It provides information about the customer’s profile, account status, and associated company details.

### Request

```
Method: GET
URL: {{baseUrl}}/v1/customers/me
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 200 and a JSON object containing the following structure:

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
    "createdAt": "2025-04-02T06:32:56.678Z",
    "updatedAt": "2025-06-05T11:04:00.929Z",
    "productActivations": {
      "XBD_BANKING": "APPROVED",
      "XBD_OTC": "REJECTED",
      "XBD_POS": "APPROVED"
    },
    "company": {
      "id": "4887a903-5678-47e5-845f-35edb9b996d0",
      "customerId": "eed9d8fd-b35b-4e8f-b08f-6efe26126976",
      "name": "CompanyCo",
      "displayName": null,
      "registrationNumber": null,
      "registeredAddress": null,
      "industryName": null,
      "createdAt": "2025-04-02T06:32:56.695Z",
      "updatedAt": "2025-04-02T06:32:56.695Z"
    },
    "user": {
      "id": "092f4680-1dea-4186-b404-96505eb28b55",
      "email": "rahul@gmail.com",
      "firstName": "rahul",
      "lastName": "sivaji",
      "emailVerified": true,
      "phone": null,
      "lastLoginAt": "2025-07-15T12:01:02.478Z",
      "status": "ACTIVE",
      "createdAt": "2025-04-02T06:32:56.658Z",
      "updatedAt": "2025-07-15T12:01:02.479Z",
      "roles": ["MERCHANT_ADMIN", "CUSTOMER"],
      "passcodeSet": true
    },
    "questionnaireStatus": "COMPLETED"
  }
}
```

- `success`: A boolean indicating the success of the request.
- `data`: An object containing customer details:
  - `id`: The unique identifier for the customer.
  - `customerType`: The type of customer (e.g., individual, business).
  - `customerAddressId`: The identifier for the customer’s address (can be null).
  - `terms`: A boolean indicating acceptance of terms.
  - `privacyPolicy`: A boolean indicating acceptance of the privacy policy.
  - `accountApplicationStatus`: The status of the customer’s account application.
  - `verificationResult`: The result of the customer verification process.
  - `createdAt`: The timestamp when the customer was created.
  - `updatedAt`: The timestamp of the last update to the customer profile.
  - `productActivations`: An object detailing the activation status of various products:
    - `XBD_BANKING`: Status of banking product activation.
    - `XBD_OTC`: Status of over-the-counter product activation.
    - `XBD_POS`: Status of point-of-sale product activation.
  - `company`: An object containing details about the customer’s associated company:
    - `id`: The unique identifier for the company.
    - `customerId`: The identifier linking the company to the customer.
    - `name`: The name of the company.
    - `displayName`: A display name for the company (can be null).
    - `registrationNumber`: The company’s registration number (can be null).
    - `registeredAddress`: The registered address of the company (can be null).
    - `industryName`: The industry in which the company operates (can be null).
    - `createdAt`: The timestamp when the company was created.
    - `updatedAt`: The timestamp of the last update to the company profile.
  - `user`: An object containing user-specific details:
    - `id`: The unique identifier for the user.
    - `email`: The user’s email address.
    - `firstName`: The user’s first name.
    - `lastName`: The user’s last name.
    - `emailVerified`: A boolean indicating if the user’s email has been verified.
    - `phone`: The user’s phone number (can be null).
    - `lastLoginAt`: The timestamp of the user’s last login.
    - `status`: The current status of the user account.
    - `createdAt`: The timestamp when the user was created.
    - `updatedAt`: The timestamp of the last update to the user profile.
    - `roles`: An array of roles assigned to the user.
    - `passcodeSet`: A boolean indicating if a passcode has been set for the user.
  - `questionnaireStatus`: The status of any questionnaires associated with the customer.
