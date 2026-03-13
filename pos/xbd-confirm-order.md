---
title: How to Test Order Confirmation on Sandbox
layout: home
permalink: /pos/confirm-order
parent: POS API
nav_order: 2
---

## How to Test Order Confirmation on Sandbox

This guide walks you through how to confirm a RELM order and collect a crypto payment address so your customer can complete their payment.

## Prerequisites

Before confirming an order, ensure that you have:

- Created an order and received a **token** as described in the [Order Creation](https://docs.relm.co/pos/checkout) guide
- Decided on the **crypto currency** you want the customer to pay in (e.g. `USDT`, `USDC`, `ETH`)

## Integration Steps

<strong>Step 1.</strong> Generate an order token

When you create an order via the Order Creation API, the response includes a `token` field. This is a short-lived JWT that authorises subsequent actions on that specific order.

Refer to the [Order Creation guide](https://docs.relm.co/pos/checkout) for full details on creating an order and retrieving this token.

---

<strong>Step 2.</strong> Call the <strong>Order confirmation API</strong> to lock in the payment currency and receive a wallet address

Endpoint – `/v1/pos/app/order/confirm`

Method – <strong>`POST`</strong>

Headers

```json
"header" : {
  "Content-Type"  : "application/json",
  "Authorization" : "Bearer {token from order creation response}"
}
```

Request

```json
{
  "currencyCode": "USDT"
}
```

Response

```json
{
    "success": true,
    "data": {
        "orderId": "6207f830-25da-4297-90b3-69bdb762b2c2",
        "clientOrderId": "e-119114",
        "orderAmount": "105",
        "orderCurrency": "USD",
        "recipientEmail": "engineering@xbdgroup.com",
        "status": "PROCESSING",
        "orderType": "EPOS",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmRlcklkIjoiNjIwN2Y4MzAtMjVkYS00Mjk3LTkwYjMtNjliZGI3NjJiMmMyIiwiY3VzdG9tZXJJZCI6ImM3MDlmZjRkLWQzODQtNDI5Mi05ZjQ5LThhNGM0ZjQ2NzEyYiIsImlhdCI6MTc3MzQxNjM4MCwiZXhwIjoxNzczNDE5OTgwfQ.j3lm9c5KNZf8M9y-D_Sm82S5TEjG5lvXnjxVBd5l7vg",
        "paymentCurrency": "USDC",
        "paymentAmount": "108.171",
        "payerRemainingAmount": "108.171",
        "payerEmail": "engineering@xbdgroup.com",
        "paymentWalletAddress": "0xc6A9da4519cFA90d53638B9F10bD83c7b91f3fa9",
        "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATbSURBVO3BQY4cSRIEQdNA/f/Lujz6KYBEejXZsyaCf6RqyUnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXok5eA/CQ1E5A31ExAJjUTkEnNBGRScwNkUjMB+Ulq3jipWnRSteikatEny9RsAnKj5gkgTwCZ1ExAJjUTkBs1T6jZBGTTSdWik6pFJ1WLPvkyIE+oeQPIE0AmNROQCcgNkEnNBGQTkCfUfNNJ1aKTqkUnVYs++eWAvKFmAnKj5gbIBGRSMwGZ1PxmJ1WLTqoWnVQt+uQ/Rs0EZFIzAXkCyKRmUjMB+X9yUrXopGrRSdWiT75Mzb9MzSYgN0A2qfmXnFQtOqladFK16JNlQH4TIJOaCcikZgIyqZmATGomIE8A+ZedVC06qVp0UrUI/8gvBmSTmieA3KiZgNyo+c1OqhadVC06qVr0yUtAJjVPAJnUTED+JiCTmknNBGQCcqNmArJJzQ2QSc0bJ1WLTqoWnVQt+mQZkEnNjZoJyKRmAjKpmYDcqLkBMqmZgDyh5gbIpGYC8oSaCchPOqladFK16KRq0ScvqZmAvKFmAjKpmYA8AWSTmgnIG0Bu1PzLTqoWnVQtOqla9MlLQCY1N0AmNROQSc0E5A01TwCZ1DwB5EbNE0CeUPOTTqoWnVQtOqla9MlLam6APKFmAjKpeQLIDZBJzaTmBsik5gbIDZBJzY2aCcgEZFLzTSdVi06qFp1ULfpkGZAbNTdAJjUTkEnNE0BugDyh5gbIpGYCMqm5UTMBeQPIpOaNk6pFJ1WLTqoWffISkEnNBGQCcqNmAjKpuQFyo2YC8i8DMqmZ1ExAJjU/6aRq0UnVopOqRfhHFgGZ1ExAJjVvAJnUTEAmNZuA3Ki5AXKjZgIyqXkCyI2aN06qFp1ULTqpWvTJlwF5A8ik5gbIpOab1ExAJiA3aiYg36RmArLppGrRSdWik6pFn7wEZFLzBJBJzaTmDSCTmgnIJjVPAJnU3KiZgNyomYB800nVopOqRSdVi/CPfBGQSc0NkCfUPAHkRs0NkEnNBGRS8wSQGzU3QCY1N0AmNW+cVC06qVp0UrXok3+MmhsgE5BJzQTkRs0NkEnNBOQGyKRmAjKpmYBsAvJNJ1WLTqoWnVQt+uQlIE8AmdTcANmkZgIyqfkmIDdAboC8oeabTqoWnVQtOqlahH/kFwPyhJo3gExqngByo+YJIJOaCcgTat44qVp0UrXopGrRJy8B+UlqnlAzAZnUvAHkRs0bQCY1T6iZgHzTSdWik6pFJ1WLPlmmZhOQGzUTkBs1E5BJzQTkb1LzBJBJzY2aTSdVi06qFp1ULfrky4A8oeYJIJOaCciNmgnI3wTkm9RMQCY1b5xULTqpWnRSteiTX07NBGRSMwG5UTMBuVFzA+QJNTdAJjUTkAnIpOabTqoWnVQtOqla9Ml/HJBJzQRkUvMEkEnNpOZvUjMB+aaTqkUnVYtOqhZ98mVq/iY1E5BJzRtqJiCTmgnIE2qeUPM3nVQtOqladFK16JNlQH4SkBsgk5oJyBNqbtT8JCCTmifUbDqpWnRSteikahH+kaolJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aL/AQQCIHw9/K9HAAAAAElFTkSuQmCC",
        "paymentLink": "https://sandbox.checkout.relm.co/?t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmRlcklkIjoiNjIwN2Y4MzAtMjVkYS00Mjk3LTkwYjMtNjliZGI3NjJiMmMyIiwiY3VzdG9tZXJJZCI6ImM3MDlmZjRkLWQzODQtNDI5Mi05ZjQ5LThhNGM0ZjQ2NzEyYiIsImlhdCI6MTc3MzQxNjM4MCwiZXhwIjoxNzczNDE5OTgwfQ.j3lm9c5KNZf8M9y-D_Sm82S5TEjG5lvXnjxVBd5l7vg",
        "company": {
            "id": "d1abec21-8d0c-475c-9c3d-98d7d6757175",
            "customerId": "c709ff4d-d384-4292-9f49-8a4c4f46712b",
            "name": "xKicks Sandbox",
            "displayName": "xKicks Sandbox",
            "email": null,
            "phone": null,
            "website": "test",
            "registrationNumber": "323232",
            "registeredAddress": "test, test, testa, 1111221, IND",
            "companyAddressId": "d5ddbb41-9c5d-4c22-a02c-5b3172d6d88b",
            "industryName": "Antiques",
            "industryDetail": null,
            "createdAt": "2026-02-12T10:42:03.666Z",
            "updatedAt": "2026-02-12T10:42:04.015Z"
        },
        "network": {
            "id": "6a48b281-c3c4-4a78-aa1f-f153d6b5ae71",
            "code": "ETH_TEST5",
            "name": "Ethereum Sepolia (Sandbox)",
            "chainId": "11155111",
            "nativeCurrency": "ETH",
            "isTestnet": true,
            "enabled": true,
            "externalId": null,
            "metadata": null,
            "createdAt": "2025-11-28T05:18:12.150Z",
            "updatedAt": "2025-12-03T15:31:48.089Z"
        },
        "createdAt": "2026-03-13T15:39:40.120Z",
        "expiresAt": "2026-03-13T16:39:40.120Z",
        "additionalInfo": {
            "redirectUrl": {
                "accept": "https://sandbox.xkicks.store/success",
                "cancel": "https://sandbox.xkicks.store/cancel",
                "failed": "https://sandbox.xkicks.store/failure"
            }
        },
        "payerConversionRate": "1.030200"
    }
}
```

Once confirmed, the response provides everything you need to collect payment:

- **`paymentWalletAddress`** — the crypto wallet address the customer must send funds to
- **`paymentAmount`** — the exact amount to be paid in the selected crypto currency
- **`qrCode`** — a base64-encoded QR code image you can display on your POS or checkout screen
- **`paymentLink`** — a hosted checkout URL you can redirect the customer to for a guided payment experience
- **`expiresAt`** — the time at which this order and wallet address expire; a new order must be created after this time

---

## Making a Test Payment (Sandbox)

In sandbox mode, the `paymentWalletAddress` returned is a real address on the **Ethereum Sepolia** testnet — a public blockchain used exclusively for testing. No real money is involved.

To simulate a payment in the sandbox:

1. **Get a Sepolia wallet** — install a browser wallet such as [MetaMask](https://metamask.io) and switch it to the **Sepolia test network**.
2. **Fund your wallet with testnet ETH** — visit a Sepolia faucet (e.g. [https://sepoliafaucet.com](https://sepoliafaucet.com)) and request free test ETH. This ETH has no real-world value and is only usable on Sepolia.
3. **Send the payment** — transfer the exact `paymentAmount` in the specified `paymentCurrency` to the `paymentWalletAddress` returned in the response.
4. **Check the order status** — once the transaction is confirmed on-chain, the order status will update automatically.

> Testnet transactions can take a few minutes to confirm depending on network conditions.

---

## After Payment — Order Status

Once the payment is received on-chain, the order moves to a **`Completed`** status. This indicates that the payment has been successfully received and the order is ready for settlement.

You can view the full order details and payment information in the **customer dashboard**.

---

## Triggering a Settlement (Sandbox Only)

In the sandbox environment, settlements do not happen automatically. You can manually trigger a settlement for a completed order to simulate the full payment flow.

This uses the same API signature method as described in the [Authentication & Signing Guide](https://docs.relm.co/auth).

Endpoint – `/v1/pos/client/settlements/trigger`

Method – <strong>`POST`</strong>

Headers

```json
"header" : {
  "Content-Type" : "application/json",
  "Authorization" : "Signature {Generated Signature}"
}
```

Response

```json
{
  "success": true
}
```

> Settlement triggering is only available in the sandbox environment. In production, settlements are processed automatically.
