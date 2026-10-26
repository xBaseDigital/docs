<!-- Values verified against the Relm API (kubera) source. Edit here; every transaction page includes this file. -->

#### Transaction `status`

| Value | Meaning |
| :--- | :--- |
| `PENDING` | Created and not yet sent for processing. |
| `UNDER_REVIEW` | Held for a compliance review by Relm. If approved it continues (a payout moves to `PROCESSING`, a deposit is credited); if not, it becomes `DECLINED`. |
| `PROCESSING` | Sent to the payment network and in progress. This includes a transaction Relm is resolving after a delivery problem. |
| `COMPLETED` | Funds delivered (payouts) or credited (deposits). |
| `FAILED` | Could not be completed. Reserved funds are released and no fee is charged. |
| `DECLINED` | Rejected after review. No fee is charged. |
| `CANCELED` | Cancelled before it was processed. No fee is charged. |
| `REVERSED` | Funds were returned by the payment network after the transaction was processed. |
| `AWAITING_FUNDS` | Waiting for funds to arrive before it can continue. |
| `ACTION_REQUIRED` | More information is needed from you before it can continue. It returns to `PROCESSING` once resolved. |

#### Other transaction fields

| Field | Possible values |
| :--- | :--- |
| `type` | `CREDIT` (money in), `DEBIT` (money out) |
| `transactionCategory` | `FX` (a currency exchange), `PAYMENT` (everything else) |
| `assetType` | `FIAT`, `CRYPTO` |
| `paymentMethod` | `LOCAL`, `SWIFT` |
| `internalTransferStatus` | `NA`, `PENDING`, `AWAITING_FUNDS`, `COMPLETED`, `FAILED` |
| `paymentType` | `PAYMENT_TYPE_FX`, `PAYMENT_TYPE_FX_INTER_LEDGER`, `PAYMENT_TYPE_FX_OFFLINE_TRANSFER`, `PAYMENT_TYPE_INTER_LEDGER`, `PAYMENT_TYPE_WALLET_TRANSFER`, `PAYMENT_TYPE_BLOCKCHAIN_TRANSFER`, `PAYMENT_TYPE_OTC_TRANSFER`, `PAYMENT_TYPE_INVOICE_TRANSFER`, `PAYMENT_TYPE_POS_SETTLEMENT_TRANSFER`, `PAYMENT_TYPE_CARD`, `PAYMENT_TYPE_VIRTUAL_DEBIT_CARD_DEBIT`, `PAYMENT_TYPE_GLOBAL_SWIFT`, `PAYMENT_TYPE_UK_FASTERPAYMENTS`, `PAYMENT_TYPE_UK_FASTERPAYMENTS_POO`, `PAYMENT_TYPE_UK_BACS`, `PAYMENT_TYPE_UK_CHAPS`, `PAYMENT_TYPE_EU_SEPA_INSTANT`, `PAYMENT_TYPE_EU_SEPA_STEP2`, `PAYMENT_TYPE_EU_TARGET2`, `PAYMENT_TYPE_US_ACH`, `PAYMENT_TYPE_US_WIRES`, `PAYMENT_TYPE_AU_NPP`, `PAYMENT_TYPE_AU_DE`, `PAYMENT_TYPE_AU_BPAY`, `PAYMENT_TYPE_SG_FAST`, `PAYMENT_TYPE_SG_GIRO`, `PAYMENT_TYPE_SG_MEPS`, `PAYMENT_TYPE_SG_PAYNOW` |
