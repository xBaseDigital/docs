---
title: Create Beneficiary
layout: home
permalink: /banking/endpoints/beneficiary/create-beneficiary
parent: Beneficiary
nav_order: 2
---

## Create Beneficiary

{: .endpoint-desc }
This endpoint allows you to add a new beneficiary to a specified account. The validation logic includes complex interdependencies between fields based on transaction type and payment method.

### Request

```
Method: POST
URL: /v1/accounts/:accountId/beneficiary
Path Parameters: accountId - The unique identifier of the account (e.g., 36abacac-2aa2-4eb7-b96e-870364065c05)
Authentication: Requires authentication.
Content-Type: application/json
```

### Response

```
Status Code: 201 CREATED
Content-Type: application/json
```

### Request Body

The request body is a JSON object with the following fields:

| Field              | Type   | Requirement     | Description                                              | Validation Rules                                                                                                                                                                                                          | Examples                                             |
| ------------------ | ------ | --------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `name`             | string | **Required**    | Full name of the beneficiary account holder              | • Max length: 100 characters<br>• Leading/trailing whitespace trimmed<br>• Must not be empty after trimming                                                                                                               | `"John Smith"`, `"ABC Corporation Ltd"`              |
| `reference`        | string | **Required**    | Payment reference or description for the transaction     | • Max length: 200 characters<br>• Leading/trailing whitespace trimmed<br>• Must not be empty after trimming                                                                                                               | `"Invoice INV-2024-001"`, `"Monthly Salary Payment"` |
| `type`             | enum   | **Required**    | Type of beneficiary entity                               | • Possible values: `INDIVIDUAL`, `BUSINESS`<br>• Use `INDIVIDUAL` for personal accounts<br>• Use `BUSINESS` for corporate accounts                                                                                        | `"INDIVIDUAL"`, `"BUSINESS"`                         |
| `transactionType`  | enum   | **Required**    | Determines payment routing and validation requirements   | • Possible values: `LOCAL`, `INTERNATIONAL`<br>• `LOCAL`: Domestic payments within same country<br>• `INTERNATIONAL`: Cross-border payments via SWIFT<br>• **Affects validation of other fields**                         | `"LOCAL"`, `"INTERNATIONAL"`                         |
| `currencyCode`     | string | **Required**    | ISO 4217 currency code for beneficiary account           | • Must be exactly 3 alphabetic characters<br>• Must be uppercase<br>• Must be valid ISO 4217 currency code                                                                                                                | `"GBP"`, `"USD"`, `"EUR"`                            |
| `iban`             | string | **Conditional** | International Bank Account Number                        | • **Required when**: `transactionType` is `INTERNATIONAL`<br>• **Optional when**: `transactionType` is `LOCAL`<br>• When provided for local, `accountNumber` and `sortCode` become optional                               | `"GB29NWBK60161331926819"`                           |
| `accountNumber`    | string | **Conditional** | Bank account number for the beneficiary                  | • **Required when**: `transactionType` is `LOCAL` and `iban` not provided<br>• **Optional when**: `transactionType` is `INTERNATIONAL` or `iban` provided<br>• When provided without `iban`, `sortCode` becomes mandatory | `"12345678"`, `"33264517"`                           |
| `sortCode`         | string | **Conditional** | Bank sort code or routing number                         | • **Required when**: `accountNumber` provided and `iban` not provided<br>• **Optional when**: `iban` provided or international transactions<br>• Format varies by country                                                 | `"20-14-53"`, `"302414"`                             |
| `bicSwiftCode`     | string | **Conditional** | BIC/SWIFT code for beneficiary's bank                    | • **Required when**: `iban` is provided (local and international)<br>• **Optional when**: Only `accountNumber` and `sortCode` for local<br>• 8 or 11 character alphanumeric code                                          | `"NWBKGB2L"`, `"CHASUS33"`                           |
| `countryCode`      | string | **Required**    | ISO 3166-1 Alpha-2 country code for beneficiary location | • Must be exactly 2 alphabetic characters<br>• Must be uppercase<br>• Must be valid ISO 3166-1 Alpha-2 code                                                                                                               | `"GB"`, `"US"`, `"DE"`                               |
| `bankCountryCode`  | string | **Required**    | ISO 3166-1 Alpha-2 country code for bank location        | • Must be exactly 2 alphabetic characters<br>• Must be uppercase<br>• Must be valid ISO 3166-1 Alpha-2 code                                                                                                               | `"GB"`, `"US"`, `"DE"`                               |
| `correspondentBic` | string | **Optional**    | BIC code for correspondent bank in payment chain         | • Used for complex international payment routing<br>• 8 or 11 character alphanumeric code                                                                                                                                 | `"DEUTDEFF"`, `"CITIUS33"`                           |
| `address`          | object | **Conditional** | Physical address of the beneficiary                      | • **Required when**: `transactionType` is `INTERNATIONAL` and address provided (must include `line1` and `country`)<br>• **Optional when**: `transactionType` is `LOCAL`                                                  | See Address Object Fields below                      |

#### Address Object Fields

| Field                 | Type   | Requirement                                        | Description                                     | Validation Rules                                                                                                               | Examples                                |
| --------------------- | ------ | -------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| `address.line1`       | string | **Required if address provided for international** | Primary address line                            | • Required when `address` provided and `transactionType` is `INTERNATIONAL`                                                    | `"123 Business Street"`, `"Flat 4B"`    |
| `address.line2`       | string | **Optional**                                       | Secondary address line                          | • No specific validation rules                                                                                                 | `"Suite 100"`, `"Building A"`           |
| `address.line3`       | string | **Optional**                                       | Additional address line for extended addressing | • No specific validation rules                                                                                                 | `"Industrial Estate"`                   |
| `address.line4`       | string | **Optional**                                       | Fourth address line for complex addressing      | • No specific validation rules                                                                                                 | `"North Wing"`                          |
| `address.countyState` | string | **Optional**                                       | County, state, or province                      | • No specific validation rules                                                                                                 | `"London"`, `"California"`, `"Ontario"` |
| `address.postCode`    | string | **Optional**                                       | Postal or ZIP code                              | • No specific validation rules                                                                                                 | `"SW1A 1AA"`, `"10001"`, `"M1 1AA"`     |
| `address.country`     | string | **Required if address provided for international** | Country code for beneficiary's address          | • Required when `address` provided and `transactionType` is `INTERNATIONAL`<br>• Must be valid ISO 3166-1 Alpha-2 country code | `"GB"`, `"US"`, `"DE"`                  |

## Validation Rules Summary

### Payment Method Validation Matrix

| Transaction Type | IBAN     | Account Number | Sort Code   | Validation Rule                                      |
| ---------------- | -------- | -------------- | ----------- | ---------------------------------------------------- |
| INTERNATIONAL    | Required | Optional       | Optional    | IBAN must be provided                                |
| LOCAL            | Optional | Optional       | Conditional | Either IBAN OR (Account Number + Sort Code) required |

### Field Format Requirements

- **Currency Code**: Must be alphabetic, ISO 4217 compliant, and uppercase
- **Country Codes**: Must be ISO 3166-1 Alpha-2 format and uppercase
- **Name/Reference**: Trimmed of whitespace, non-empty after trimming

## Request Examples

### International Transaction with IBAN

```json
{
  "name": "John Smith Ltd",
  "reference": "Invoice INV-2024-001",
  "iban": "GB29NWBK60161331926819",
  "type": "BUSINESS",
  "transactionType": "INTERNATIONAL",
  "currencyCode": "GBP",
  "countryCode": "GB",
  "bankCountryCode": "GB",
  "bicSwiftCode": "NWBKGB2L",
  "address": {
    "line1": "123 Business Street",
    "line2": "Suite 100",
    "countyState": "London",
    "postCode": "SW1A 1AA",
    "country": "GB"
  }
}
```

### Local Transaction with Account Number

```json
{
  "name": "Jane Doe",
  "reference": "Monthly Payment",
  "sortCode": "20-14-53",
  "accountNumber": "12345678",
  "type": "INDIVIDUAL",
  "transactionType": "LOCAL",
  "currencyCode": "GBP",
  "countryCode": "GB"
}
```

### Local Transaction with IBAN (Alternative)

```json
{
  "name": "Local Business",
  "reference": "Donation",
  "iban": "GB29NWBK60161331926819",
  "type": "BUSINESS",
  "transactionType": "LOCAL",
  "currencyCode": "GBP"
}
```

### Response Body

**Response Description:** On a successful request, the server responds with a status code of 201 and a JSON object containing the following structure:

```json
{
  "success": true,
  "data": {
    "beneficiary": {
      "id": "01e17885-ee59-4f4e-99a4-739cb1c8e3f3",
      "recipientId": "0f624785-8dd1-4c6a-9a5d-7446e59e03a7",
      "accountId": "385dec3a-9bfe-4072-8733-7872ef350e71",
      "name": "John Smith Ltd",
      "displayName": "John Smith Ltd",
      "reference": "Invoice INV-2024-001",
      "iban": "GB29NWBK60161331926819",
      "bicSwiftCode": "NWBKGB2L",
      "correspondentBic": null,
      "sortCode": null,
      "accountNumber": null,
      "type": "BUSINESS",
      "currencyCode": "GBP",
      "countryCode": "GB",
      "bankCountryCode": "GB",
      "status": "PENDING",
      "createdAt": "2025-07-29T06:11:55.717Z",
      "updatedAt": "2025-07-29T06:11:55.717Z",
      "transactionType": "INTERNATIONAL",
      "addressId": "34a355a6-55de-43c3-9938-dc11587b260e",
      "address": {
        "id": "34a355a6-55de-43c3-9938-dc11587b260e",
        "line1": "123 Business Street",
        "line2": "Suite 100",
        "line3": null,
        "line4": null,
        "countyState": "London",
        "postCode": "SW1A 1AA",
        "country": "GB"
      }
    },
    "validation": {
      "reasonCode": "",
      "nameMatch": true
    }
  }
}
```

#### Response Fields

- `success`: A boolean indicating the success of the request.
- `data`: An object containing beneficiary details:
  - `beneficiary`: The created beneficiary object with all fields
  - `validation`: An object containing validation results:
    - `reasonCode`: Additional validation information
    - `nameMatch`: Boolean indicating if name validation passed

## Detailed Validation Rules

### Validation Errors (400 Bad Request)

The API returns detailed validation errors for each field that fails validation:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "iban",
        "message": "IBAN is required for international transactions"
      },
      {
        "field": "currencyCode",
        "message": "Currency code must be uppercase"
      }
    ]
  }
}
```

### Common Validation Error Messages

| Error Message                                                                                  | Cause                                                          |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| "Beneficiary name is required"                                                                 | Name field is empty or whitespace only                         |
| "Beneficiary name must not exceed 100 characters"                                              | Name exceeds character limit                                   |
| "Reference is required"                                                                        | Reference field is empty                                       |
| "Reference must not exceed 200 characters"                                                     | Reference exceeds character limit                              |
| "IBAN is required for international transactions"                                              | Missing IBAN for international transaction                     |
| "Either iban or accountNumber is required"                                                     | Neither IBAN nor account number provided for local transaction |
| "sortCode is required"                                                                         | Account number provided without sort code (and no IBAN)        |
| "Type must be one of INDIVIDUAL, BUSINESS"                                                     | Invalid beneficiary type                                       |
| "Transaction type must be one of LOCAL, INTERNATIONAL"                                         | Invalid transaction type                                       |
| "Invalid currency code"                                                                        | Currency code not ISO 4217 compliant                           |
| "Currency code must be uppercase"                                                              | Currency code not in uppercase                                 |
| "Invalid beneficiary country code"                                                             | Country code not ISO 3166-1 Alpha-2                            |
| "Country code must be uppercase"                                                               | Country code not in uppercase                                  |
| "Address line1, countyState, postCode and country are required for international transactions" | Missing required address fields for international transaction  |

## Error Responses

1. **Transaction Type Logic**: The choice between `LOCAL` and `INTERNATIONAL` significantly affects validation requirements
2. **Payment Method Flexibility**: Local transactions support both IBAN and traditional account number + sort code
3. **Address Requirements**: Address details are only mandatory for international transactions when an address is provided
4. **Status Flow**: All beneficiaries start with `PENDING` status and require confirmation
5. **Unique Constraints**: The system generates a unique `recipientId` for each beneficiary

## Business Rules and Implementation Notes

### Payment Method Selection Logic

```
transactionType == "INTERNATIONAL"
├── YES: IBAN is REQUIRED
└── NO (LOCAL):
    ├── IBAN provided? → Valid ✓
    └── IBAN not provided?
        ├── accountNumber provided?
        │   ├── YES: sortCode is REQUIRED
        │   └── NO: ERROR - Either IBAN or accountNumber required
        └── accountNumber not provided? → ERROR
```

### Address Validation Logic

```
transactionType == "INTERNATIONAL" AND address provided?
├── YES:
│   ├── line1 provided? → Required ✓
│   └── country provided? → Required ✓
└── NO: Address is optional
```

## Implementation Notes

### Validator Chain Execution

The validation occurs in the following order:

1. **Basic Field Validation**: Required fields, length limits, format validation
2. **Enum Validation**: Transaction type and beneficiary type validation
3. **Custom Cross-Field Validation**: IBAN/account number logic, address requirements
4. **Format Validation**: Currency codes, country codes, uppercase requirements

### Error Handling

- Validation errors are collected and returned as an array
- Each error includes the field name and specific error message
- Multiple validation errors can occur simultaneously
- The API uses express-validator for comprehensive validation

## Best Practices

1. **Always validate currency codes** against ISO 4217 standards before sending
2. **Ensure country codes** follow ISO 3166-1 Alpha-2 format and are uppercase
3. **For international transactions**, provide complete address information when available
4. **Use meaningful references** for easier transaction tracking and reconciliation
5. **Consider the beneficiary type** when setting up payment workflows and compliance checks
6. **Test edge cases** such as providing both IBAN and account number for local transactions

## Testing Scenarios

### Valid Test Cases

1. **International with IBAN only**
2. **Local with IBAN only**
3. **Local with account number + sort code**
4. **International with complete address**
5. **Local without address**

### Invalid Test Cases

1. **International without IBAN**
2. **Local without IBAN or account number**
3. **Local with account number but no sort code**
4. **Invalid currency code format**
5. **International with incomplete address**
6. **Uppercase violations on country codes**

This comprehensive documentation should help API consumers understand all the validation nuances and successfully integrate with your beneficiary creation endpoint.
