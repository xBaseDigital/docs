---
title: Order Events
layout: home
permalink: /pos/webhook/events
parent: Webhook
nav_order: 2
---

Webhooks for POS orders notify your system about important events during the order lifecycle. Below are the main events:

### Order Confirmation Event

This event is triggered when a user confirms an order on the Relm checkout website. At this stage, a payment address is generated for the user, and the webhook sends the order details to your endpoint. The `status` field in the payload will be set to `COMPLETED`.

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
  "paymentWalletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

### Order Cancellation Event

This event is sent when an order is cancelled. The webhook payload is similar to the confirmation event, but the `status` field will be set to `CANCELLED`.

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
  "paymentWalletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```
