<!-- Values verified against the Relm API (kubera) source. Edit here; Get Transaction List includes this file. -->

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
