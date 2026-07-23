---
title: Manage Client Banking
layout: home
permalink: /partner/manage-client
parent: Partner API
nav_order: 2
has_children: true
---

# Manage Client Banking

These endpoints let a partner manage banking on behalf of a customer they own — reading accounts, enabling account currencies, managing beneficiaries, whitelisting deposit sources, and initiating payouts. Every action is performed in the customer's context and recorded against the partner in the customer's audit trail.

{: .note }
For running payroll on behalf of a customer, see the separate [Manage Client Payroll](/partner/manage-client-payroll) section.

## Base Path

```
{{baseUrl}}/v1/client
```

## Authentication

All endpoints in this section require a partner access token and one of the following roles:

```
Auth: PARTNER | PARTNER_ADMIN
```

The authenticated partner must **own** the customer referenced by `:customerId`. Requests for a customer that is not linked to the partner are rejected before the handler runs.

{: .note }
For account-scoped endpoints (any route containing `:accountId`), the account is resolved and validated against the customer up front. If the account does not exist, does not belong to the customer, or has no configured currencies, the request fails with `404 Account not found`.

## Audit Logging

Write actions (enabling a currency, creating/updating/confirming/removing a beneficiary, and whitelisting or removing a deposit source) are automatically written to the customer's audit log as a **partner action**, attributing the change to the acting partner user.

## Endpoints

- **[Client Customer](/partner/manage-client/customer)** — fetch the customer profile and company details.
- **[Client Accounts](/partner/manage-client/accounts)** — list accounts, fetch a single account, and manage account currencies.
- **[Client Beneficiaries](/partner/manage-client/beneficiaries)** — list, create, update, confirm, and remove beneficiaries, and read payout configuration.
- **[Client Whitelisting](/partner/manage-client/whitelisting)** — list whitelisted deposit sources and whitelist crypto wallets or fiat accounts.
- **[Client Payouts](/partner/manage-client/payouts)** — estimate payout fees, send the payout verification code, and create a payout to a beneficiary.
