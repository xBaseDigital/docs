---
title: Estimate Payout Fees
layout: home
permalink: /banking/endpoints/payout/estimate-payout-fees
parent: Payout
nav_order: 1
---

## Estimate Payout Fees

{: .endpoint-desc }
This endpoint calculates the estimated fees for a payout transaction. It returns a `feeHash` which is required to initiate the actual payout request.

### Request

```
Method: GET
URL: {{baseUrl}}/v1/accounts/:accountId/payouts/estimate
Path Parameters: accountId - The unique identifier of the account.
Query Parameters:
  - amount: The amount to be paid out.
  - currency: The currency code (e.g., AED, USD).
  - beneficiaryId: The unique identifier of the beneficiary.
Authentication: Requires authentication.
```

### Example Request

```bash
curl --location 'https://sandbox.api.xbd.dev/v1/accounts/385dec3a-9bfe-4072-8733-7872ef350e71/payouts/estimate?amount=2&currency=AED&beneficiaryId=5b9d9177-2261-458d-b65b-c6722cc75a90'
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 200 and a JSON object containing the fee estimation and the `feeHash`.

```json
{
    "success": true,
    "data": {
        "amount": 2,
        "currency": "AED",
        "fee": 30,
        "feeCurrency": "AED",
        "estimatedDate": "2025-12-18T12:00:12.684Z",
        "isEstimateAvailable": true,
        "totalAmount": 42,
        "internalFee": 10,
        "ruleSet": true,
        "totalFee": 40,
        "feeHash": "r750BpqEQ1ASH6/PCQzuxw==:zg10fJ5x8eian4W41Liuzw==:QsmcVo4dVXJlMwy1DNNLooY5faIIcpR+5/YDNyUmbgk6VHOzhQYfxH4L3DLByaCavZ6yuZ0nPQb1OPMniUMWY1RgZyPLCiJ5v+C1qr386kybT4jIVmm8BgKTE6jJcvzujvNF2WYSAVKG6GuQQVmCuqG8KO/GgcGQdjno8+OHBRKh41HrWE1gQxv16qarA9lxmwk="
    }
}
```

- `success`: Indicates if the request was successful.
- `data`: Contains the estimation details.
  - `amount`: The requested payout amount.
  - `currency`: The currency of the payout.
  - `fee`: The estimated fee amount.
  - `feeCurrency`: The currency of the fee.
  - `estimatedDate`: The estimated date of completion.
  - `isEstimateAvailable`: Boolean indicating if estimate is available.
  - `totalAmount`: The total amount including fees.
  - `internalFee`: Internal processing fee.
  - `ruleSet`: Boolean indicating if a rule set was applied.
  - `totalFee`: The total fee calculated.
  - `feeHash`: A hash string representing the fee quote. **This is required for the Create Payout Request endpoint.**
