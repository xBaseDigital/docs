---
title: MintPay Ltd
layout: home
permalink: /mintpay-ltd
nav_order: 200
---

## MintPay Ltd API Quick Start

This page is a simple guide for MintPay Ltd to start using the Xbase APIs.

## API Credentials

Use the following credentials in your API client:

- `keyId`: `00ed35180aa663a5`
- `publicKey`: `MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEgvEbX20rETqfjtc1sUOh6//d4hqy3/CsaC+v6aEKkl/6P3eNDjrvXOsOaWlQRDXbifAFB9ZbFYajAFBg2BI5GA==`
- `privateKey`: `MIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQgdErRxi76GHJkYiFUcl4opA/6uW3VC4zWHNDTfYySEE6hRANCAASC8RtfbSsROp+O1zWxQ6Hr/93iGrLf8KxoL6/poQqSX/o/d40OOu9c6w5paVBENduJ8AUH1lsVhqMAUGDYEjkY`

Keep the private key secure. Do not share it in chat, email, or frontend code.

## How To Use

1. Set up authentication using `keyId` and `privateKey`.
2. Generate the request signature for each API call.
3. Send requests to the required endpoints.
4. Validate response status and handle errors.

Authentication reference: [Add Authentication Guide Link](#)

## What You Can Do

With these credentials, MintPay Ltd can:

- Fetch customer accounts.
- Validate and manage beneficiaries.
- Estimate fees and create payout requests.
- Generate FX quotes and create exchange orders.
- Fetch transaction lists.
- Receive webhook event updates.

## Suggested Links To Add

- Accounts API: [Add Link](#)
- Beneficiary API: [Add Link](#)
- Payout API: [Add Link](#)
- Exchange API: [Add Link](#)
- Transactions API: [Add Link](#)
- Webhook Setup: [Add Link](#)
- Troubleshooting: [Add Link](#)

## Optional Test Checklist

- Confirm authentication works in sandbox.
- Test one read endpoint (for example: accounts list).
- Test one write endpoint (for example: create payout request).
- Verify webhook delivery and signature validation.
