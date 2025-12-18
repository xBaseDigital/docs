---
title: Create Payout Request
layout: home
permalink: /banking/endpoints/payout/create-payout-request
parent: Payout
nav_order: 2
---

## Create Payout Request

{: .endpoint-desc }
This endpoint initiates a payout to a specified beneficiary from a given account. It requires a `feeHash` obtained from the **Estimate Payout Fees** endpoint.

### Request

```
Method: POST
URL: {{baseUrl}}/v1/accounts/:accountId/payout
Path Parameters : accountId - The unique identifier of the account (e.g., 36abacac-2aa2-4eb7-b96e-870364065c05)
Authentication: Requires authentication.
```

### Request Body

```json
{
    "beneficiaryId": "0db9b611-9754-454d-951d-d691e1265148",
    "amount": "111",
    "currency": "GBP",
    "purpose": "Other",
    "idempotencyKey": "89cd72f0-de8e-44af-b029-5647fef59036",
    "feeHash": "UMNZlYjrsYwLhcCrbGp+wQ==:pRejW8igJX4wJiptMVwT6Q==:RV5sgTjbYYVUSRgh1M14yOb+V0QNJ/2HlhUE+vzMnZpL6aewVTws7tQxTgYgbs9PQl3gE3Ab+VcVcc8VQOCGB0qZMkb52QypfuiBhdWuSu7HfaM0uEOsAP1xn1SpBSl6+UGP"
}
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
        "highRisk": false,
        "refunded": false,
        "systemInitiated": false,
        "id": "babe5f2d-7c44-4b83-90b9-f94856ed4643",
        "idempotencyKey": "89cd72f0-de8e-44af-b029-5647fef59037",
        "additionalInfo": {
            "purpose": "charity",
            "feeRuleSet": true
        },
        "assetType": "FIAT",
        "accountCurrencyId": "fae535c5-f64f-4737-82de-c12b88be0764",
        "accountCurrency": {
            "id": "fae535c5-f64f-4737-82de-c12b88be0764",
            "banking_provider_account_id": "0197d9d7-91f1-74b1-9398-fcf61a754815",
            "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
            "type": "FIAT",
            "balance": "76205.12590174783646269006",
            "available": "75221.85590174783646269006",
            "locked": "0",
            "accountDetailsId": "df33fb5c-ab6f-4d28-a4db-11adf6798202",
            "cryptoDetailsId": null,
            "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
            "accountDetails": {
                "id": "df33fb5c-ab6f-4d28-a4db-11adf6798202",
                "IBAN": "AE629475036342300954347",
                "bic_swift_code": null,
                "correspondent_bic": null,
                "beneficiary": null,
                "sort_code": null,
                "routing_number": null,
                "account_number": null,
                "account_name": "Suzuki AED",
                "addressId": null
            },
            "currency": {
                "id": "0ff5db18-ad57-4703-a031-08907aa814f1",
                "currencyCode": "AED",
                "currencyName": null,
                "currencySymbol": "د.إ",
                "currencyFlag": "https://statics.xbd.money/images/flags/aed.png",
                "currencyType": "FIAT",
                "enabled": true,
                "externalId": null,
                "fiatDetailsId": "fiat-AED",
                "createdAt": "2025-07-08T05:15:22.312Z",
                "updatedAt": "2025-12-03T15:31:47.513Z"
            },
            "status": "ENABLED",
            "createdAt": "2025-10-29T09:06:16.148Z",
            "updatedAt": "2025-12-18T12:15:05.314Z"
        },
        "recipient": {
            "id": "5b9d9177-2261-458d-b65b-c6722cc75a90",
            "iban": "iban",
            "name": "Beneficiary Name *",
            "type": "INDIVIDUAL",
            "status": "ACTIVE",
            "address": {
                "id": "bcff5a81-1ccb-466e-88c7-63d5e27ca596",
                "line1": "line1",
                "line2": "line2",
                "line3": "line3",
                "line4": null,
                "country": "AD",
                "postCode": null,
                "countyState": null
            },
            "accountId": "35bbc515-8290-4749-9ddf-4fe1478d9f9e",
            "addressId": "bcff5a81-1ccb-466e-88c7-63d5e27ca596",
            "assetType": "FIAT",
            "bankingId": null,
            "networkId": null,
            "reference": "reff",
            "countryCode": null,
            "displayName": "Beneficiary Name *",
            "recipientId": "cc562af0-0a11-42e6-bb99-aac99d170605",
            "bicSwiftCode": "bic",
            "currencyCode": "AED",
            "accountNumber": null,
            "bankingIdType": null,
            "routingNumber": null,
            "bankCountryCode": null,
            "transactionType": "INTERNATIONAL",
            "correspondentBic": null,
            "cryptoWalletAddress": null
        },
        "amount": "2",
        "currencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
        "currency": {
            "id": "0ff5db18-ad57-4703-a031-08907aa814f1",
            "currencyCode": "AED",
            "currencyName": null,
            "currencySymbol": "د.إ",
            "currencyFlag": "https://statics.xbd.money/images/flags/aed.png",
            "currencyType": "FIAT",
            "enabled": true,
            "externalId": null,
            "fiatDetailsId": "fiat-AED",
            "createdAt": "2025-07-08T05:15:22.312Z",
            "updatedAt": "2025-12-03T15:31:47.513Z"
        },
        "status": "PENDING",
        "type": "DEBIT",
        "paymentMethod": "LOCAL",
        "paymentType": "PAYMENT_TYPE_UK_FASTERPAYMENTS",
        "riskScore": 0,
        "feeAmount": "40",
        "internalTransferStatus": "NA",
        "feeCurrencyId": "0ff5db18-ad57-4703-a031-08907aa814f1",
        "feeCurrency": {
            "id": "0ff5db18-ad57-4703-a031-08907aa814f1",
            "currencyCode": "AED",
            "currencyName": null,
            "currencySymbol": "د.إ",
            "currencyFlag": "https://statics.xbd.money/images/flags/aed.png",
            "currencyType": "FIAT",
            "enabled": true,
            "externalId": null,
            "fiatDetailsId": "fiat-AED",
            "createdAt": "2025-07-08T05:15:22.312Z",
            "updatedAt": "2025-12-03T15:31:47.513Z"
        },
        "createdAt": "2025-12-18T12:15:05.245Z",
        "updatedAt": "2025-12-18T12:15:06.386Z",
        "runningBalance": "76205.12590174783646269006",
        "runningAvailableBalance": "75261.85590174783646269006",
        "transactionCategory": "PAYMENT",
        "totalAmount": "42",
        "netAmount": "42"
    }
}
```

- `success`: Indicates if the request was successful.
- `data`: An object containing payout request details:
  - `highRisk`: A boolean indicating if the transaction is high risk.
  - `refunded`: A boolean indicating if the transaction has been refunded.
  - `systemInitiated`: Boolean indicating if system initiated.
  - `id`: The unique identifier for the payout request.
  - `idempotencyKey`: The idempotency key used.
  - `additionalInfo`: Object containing additional info like `purpose` and `feeRuleSet`.
  - `assetType`: The type of asset (e.g., “FIAT”).
  - `accountCurrencyId`: The identifier for the account currency.
  - `accountCurrency`: Detailed account currency object.
  - `recipient`: Detailed recipient object.
  - `amount`: The amount of the payout.
  - `currencyId`: The identifier for the currency.
  - `currency`: Detailed currency object.
  - `status`: The current status of the payout (e.g., “PENDING”).
  - `type`: The type of transaction (e.g., “DEBIT”).
  - `paymentMethod`: The payment method (e.g., “LOCAL”).
  - `paymentType`: The specific payment type.
  - `riskScore`: The risk score.
  - `feeAmount`: The fee amount.
  - `internalTransferStatus`: Status of internal transfer.
  - `feeCurrencyId`: ID of fee currency.
  - `feeCurrency`: Detailed fee currency object.
  - `createdAt`: Creation timestamp.
  - `updatedAt`: Update timestamp.
  - `runningBalance`: Running balance after transaction.
  - `runningAvailableBalance`: Running available balance.
  - `transactionCategory`: Category of transaction.
  - `totalAmount`: Total amount including fees.
  - `netAmount`: Net amount.

### Transaction Purpose Enums

The `purpose` field in the request body can take one of the following values:

**TxPurpose:**
- `charity`
- `commercial_investment`
- `corporate_card`
- `credit_card`
- `dividend`
- `family`
- `financial_services`
- `goods_sold`
- `goods_bought`
- `government`
- `insurance`
- `intergroup_transfer`
- `intra_group_dividends`
- `information_technology`
- `leasing`
- `loan_charges`
- `merchant_settlement`
- `mobile_wallet`
- `non_resident_transfer_between_accounts`
- `pension`
- `personal_expenses`
- `prepaid_cards`
- `professional`
- `rental`
- `resident_transfer_between_accounts`
- `salaries`
- `telecommunications`
- `travel`
- `utility_bill`
- `none`

**FreemarketTxPurpose:**
- `Transferring_Funds_To_Own_Account`
- `Repatriating_Overseas_Earnings`
- `Investment_Property_Purchase`
- `Overseas_Purchase`
- `Investing_Abroad`
- `Speculative_Trading`
- `Sales_From_Commerce_Site`
- `Paying_Overseas_Suppliers`
- `Other`
