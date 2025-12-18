---
title: Get Beneficiary List
layout: home
permalink: /banking/endpoints/beneficiary/get-beneficiary-list
parent: Beneficiary
nav_order: 1
---

## Get Beneficiary List

{: .endpoint-desc }
This endpoint retrieves a list of beneficiaries associated with a specific account. It returns details for both FIAT and CRYPTO beneficiaries.

### Request

```
Method: GET
URL: {{baseUrl}}/v1/accounts/:accountId/beneficiary
Authentication: Requires authentication.
```

### Response

```
Status Code: 200 OK
Content-Type: application/json
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 200 and a JSON object containing a list of beneficiaries.

#### Example Response (Fiat Beneficiaries)

```json
{
    "success": true,
    "data": [
        {
            "id": "39aa9cab-c45a-41f6-92d8-5aff67916fcf",
            "recipientId": "8a42e9ff-ac35-4b47-b605-5aca4ac0bc78",
            "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
            "name": "Acme Corp",
            "displayName": "Acme Corp",
            "reference": "Invoice#123",
            "type": "BUSINESS",
            "status": "ACTIVE",
            "assetType": "FIAT",
            "iban": "GB29NWBK60161331926812",
            "bicSwiftCode": "NWBKGB2L",
            "correspondentBic": null,
            "bankingId": null,
            "bankingIdType": null,
            "accountNumber": null,
            "routingNumber": null,
            "currencyCode": "AED",
            "countryCode": null,
            "bankCountryCode": null,
            "transactionType": "LOCAL",
            "addressId": "f00e6da2-1d30-40ea-9593-7ecd3f9bb10e",
            "address": {
                "id": "f00e6da2-1d30-40ea-9593-7ecd3f9bb10e",
                "line1": "123 Business Rd",
                "line2": "Suite 100",
                "line3": "Business Park",
                "line4": null,
                "countyState": null,
                "postCode": null,
                "country": "AG"
            },
            "cryptoWalletAddress": null,
            "networkId": null
        },
        {
            "id": "1d50824b-ac32-4a6b-ab37-902e6ff4cfff",
            "recipientId": "da7e9262-49e3-4174-b86e-eb30741e1445",
            "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
            "name": "John Doe",
            "displayName": "John Doe",
            "reference": "Payment Ref",
            "type": "INDIVIDUAL",
            "status": "ACTIVE",
            "assetType": "FIAT",
            "iban": "GB29NWBK60161331926819",
            "bicSwiftCode": "NWBKGB2L",
            "correspondentBic": null,
            "bankingId": null,
            "bankingIdType": null,
            "accountNumber": null,
            "routingNumber": null,
            "currencyCode": "AED",
            "countryCode": null,
            "bankCountryCode": null,
            "transactionType": "INTERNATIONAL",
            "addressId": "1e434a9b-7d1f-4722-815e-d5ac6d3f394b",
            "address": {
                "id": "1e434a9b-7d1f-4722-815e-d5ac6d3f394b",
                "line1": "456 Residential St",
                "line2": "Apt 2B",
                "line3": null,
                "line4": null,
                "countyState": null,
                "postCode": null,
                "country": "GB"
            },
            "cryptoWalletAddress": null,
            "networkId": null
        }
    ]
}
```

#### Example Response (Crypto Beneficiary)

For beneficiaries with `assetType: "CRYPTO"`, the response includes `cryptoWalletAddress` and `networkId`.

```json
{
    "success": true,
    "data": [
        {
            "id": "3e40596b-60fd-48e0-bc81-6485bf9f007a",
            "recipientId": "bc82e671-f021-431c-b13a-be12948e5a90",
            "accountId": "13d8c230-71c7-4c2b-ad3e-8a25b35981c8",
            "name": "Jane Smith",
            "displayName": "Jane Smith",
            "reference": "Crypto Transfer",
            "type": "INDIVIDUAL",
            "status": "ACTIVE",
            "assetType": "CRYPTO",
            "iban": null,
            "bicSwiftCode": null,
            "correspondentBic": null,
            "bankingId": null,
            "bankingIdType": null,
            "accountNumber": null,
            "routingNumber": null,
            "currencyCode": "ETH",
            "countryCode": null,
            "bankCountryCode": null,
            "transactionType": "LOCAL",
            "addressId": null,
            "address": null,
            "cryptoWalletAddress": "0xdf5274da75a9d55e886baa68091a3ae74a78fc48",
            "networkId": "6a48b281-c3c4-4a78-aa1f-f153d6b5ae71"
        }
    ]
}
```
