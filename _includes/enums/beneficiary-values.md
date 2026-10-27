<!-- Values verified against the Relm API (kubera) source. -->

| Field | Possible values |
| :--- | :--- |
| `type` | `INDIVIDUAL`, `BUSINESS`, `CHARITY` |
| `assetType` | `FIAT`, `CRYPTO` |
| `transactionType` | `LOCAL`, `INTERNATIONAL` |
| `status` | `PENDING` (added, not yet confirmed), `ACTIVE` (ready for payouts). Fiat beneficiaries become `ACTIVE` when you confirm them; crypto beneficiaries after blockchain verification. |
| `bankingIdType` | `IBAN`, `SORT_CODE`, `ROUTING_TRANSIT_NUMBER`, `TRANSIT_NUMBER`, `BANK_STATE_BRANCH`, `IFSC`, `BIC` |
