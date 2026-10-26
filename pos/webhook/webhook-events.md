---
title: Order Events
layout: home
permalink: /pos/webhook/events
parent: Webhook
nav_order: 2
---

Webhooks for POS orders notify your system about important events during the order lifecycle. Webhooks are sent for `EPOS` orders only. Each payload carries the order's `status`; no webhook is sent when an order becomes `EXPIRED` or `FAILED`.

| Event | `status` | When |
| :--- | :--- | :--- |
| Payment received | `COMPLETED` or `PARTIAL_FILLED` | Sent each time a payment for the order is received. `COMPLETED` means the order is fully paid; `PARTIAL_FILLED` means the payer has paid less than the full amount so far. |
| Order cancelled | `CANCELLED` | Sent when the order is cancelled. |

### Payment Received Event

Sent each time a payment for the order arrives, so a partly paid order can send more than one. `payerPaidAmount` is the amount the payer has paid.

**Sample Payload:**

```json
{
  "orderId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "clientOrderId": "f7e6d5c4-b3a2-1098-7654-3210fedcba98",
  "orderAmount": "100.00",
  "orderCurrency": "USD",
  "recipientEmail": "user@example.com",
  "status": "COMPLETED",
  "orderType": "EPOS",
  "paymentCurrency": "USDC",
  "paymentAmount": "100.00",
  "payerPaidAmount": "100.00",
  "paymentWalletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

### Order Cancellation Event

Sent when an order is cancelled. The payload has the same fields, with `status` set to `CANCELLED`.

**Sample Payload:**

```json
{
  "orderId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "clientOrderId": "f7e6d5c4-b3a2-1098-7654-3210fedcba98",
  "orderAmount": "100.00",
  "orderCurrency": "USD",
  "recipientEmail": "user@example.com",
  "status": "CANCELLED",
  "orderType": "EPOS",
  "paymentCurrency": "USDC",
  "paymentAmount": "100.00",
  "payerPaidAmount": "0.00",
  "paymentWalletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```
