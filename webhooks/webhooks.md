---
title: Webhooks
layout: home
nav_order: 4
---

# Webhooks

This section explains how to use webhooks with the RELM API. Webhooks allow your application to receive real-time notifications about events such as order status changes, payment confirmations, and more.

## Setting Up Webhooks

To receive webhook notifications, provide a publicly accessible endpoint URL when configuring your integration. RELM will send POST requests to this URL whenever relevant events occur.

### Example Webhook Payload

```json
{
  "event": "order.completed",
  "orderId": "string",
  "clientOrderId": "string",
  "status": "completed",
  "paymentAmount": "string",
  "paymentCurrency": "string",
  "timestamp": "Date"
}
```

## Security

- Validate incoming requests using the provided signature header.
- Use HTTPS for your webhook endpoint.

## Common Events

- `order.created`
- `order.completed`
- `order.failed`
- `payment.received`

## Troubleshooting

- Ensure your endpoint is reachable from the internet.
- Log all incoming webhook requests for debugging.

For more details, contact RELM support or refer to the API documentation.