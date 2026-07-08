---
title: Onboard Customer
layout: home
permalink: /partner/onboard-customer
parent: Partner API
nav_order: 1
---

# Onboard Customer

This flow lets a partner create a new customer on the Relm platform and then launch the [Onboarding SDK](/onboarding-sdk) for that customer.

There are two steps:

1. **Create the customer** — call the partner onboarding endpoint. The customer is automatically linked to your authenticated partner account.
2. **Log in as the customer** — call the login endpoint to obtain `token` and `refreshToken`, then pass them into the Onboarding SDK.

---

## Step 1 — Create Customer

{: .endpoint-desc }
Creates a new customer and links them to the authenticated partner. MFA is disabled and notifications are suppressed for all partner-created customers.

### Request

```
Method:   POST
Endpoint: /partners/customers/onboard
Auth:     PARTNER | PARTNER_ADMIN
```

### Payload

```json
{
  "email":       "string",
  "password":    "string",
  "firstName":   "string",
  "lastName":    "string",
  "type":        "INDIVIDUAL | BUSINESS",
  "phone":       "string",
  "ipAddress":   "string",
  "countryCode": "string",
  "companyName": "string"
}
```

### Field Description

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Min 8 chars — must contain uppercase, lowercase, number, and special character |
| `firstName` | string | Yes | Max 50 characters |
| `lastName` | string | Yes | Max 50 characters |
| `type` | string | Yes | `INDIVIDUAL` or `BUSINESS` |
| `phone` | string | Yes | Customer phone number |
| `ipAddress` | string | Yes | Customer IP address |
| `countryCode` | string | Yes | ISO 3166-1 alpha-2 country code (e.g. `"GB"`, `"US"`) |
| `companyName` | string | If `type=BUSINESS` | Max 50 characters |

### Response

```
Status: 201 Created
```

```json
{
  "success": true,
  "data": { }
}
```

`data` contains the created `CustomerDTO`.

---

## Step 2 — Log In as the Customer

Once the customer is created, log them in to obtain the tokens needed for the Onboarding SDK.

### Request

```
Method:   POST
Endpoint: /v1/auth/login
```

```bash
curl 'https://sandbox.api.relm.co/v1/auth/login' \
  -X POST \
  --data-raw '{"email":"customer@example.com","password":"CustomerPassword@1"}'
```

### Response

```json
{
  "success": true,
  "data": {
    "token": "<access-token>",
    "refreshToken": "<refresh-token>",
    "customer": {
      "id": "b10a855a-76a9-4b7d-9628-175a55326473",
      "email": "customer@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "emailVerified": true,
      "accountApplicationStatus": "APPROVED",
      "customerType": "BUSINESS",
      "productActivations": {
        "XBD_BANKING": "APPROVED"
      },
      "roles": ["CUSTOMER", "ACCOUNT_ADMIN"]
    }
  }
}
```

{: .note }
Because partner-created customers have `mfaEnabled: false`, the login response always returns `token` and `refreshToken` directly — there is no OTP step.

---

## Step 3 — Launch the Onboarding SDK

Pass `token` as `providerAccessToken` and `refreshToken` as `providerRefreshToken` into the SDK.

Continue with the **[Onboarding SDK](/onboarding-sdk)** docs to complete the integration.
