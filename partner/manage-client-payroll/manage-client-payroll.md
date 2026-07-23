---
title: Manage Client Payroll
layout: home
permalink: /partner/manage-client-payroll
parent: Partner API
nav_order: 3
has_children: true
---

# Manage Client Payroll

These endpoints let a partner run payroll on behalf of a customer they own — estimating fees,
creating and managing multi-beneficiary payroll requests, accepting quotes, and tracking the
resulting beneficiary transfers. Every action is performed in the customer's context and, for
write actions, recorded against the partner in the customer's audit trail.

This is the partner-facing variant of the standalone [Payroll API](/payroll/api); the request
and response bodies are identical, but calls are scoped to a customer the partner owns rather
than the authenticated customer.

## Base Path

```
{{baseUrl}}/v1/client
```

## Authentication

All endpoints in this section require a partner access token and one of the following roles:

```
Auth: PARTNER | PARTNER_ADMIN
```

The authenticated partner must **own** the customer referenced by `:customerId`. Requests for a
customer that is not linked to the partner are rejected with `403 Forbidden` before the handler
runs.

## Payroll Request Lifecycle

A payroll request moves through the following statuses:

```
PENDING → QUOTE_PROVIDED → QUOTE_ACCEPTED → EXECUTING → PAYOUT_INITIATED → COMPLETED
```

Other terminal / branch states: `PARTIALLY_COMPLETED`, `FAILED`, `CANCELLED`.

## Audit Logging

Write actions (creating a payroll request, accepting a quote, and cancelling a request) are
automatically written to the customer's audit log as a **partner action**, attributing the
change to the acting partner user.

## Endpoints

- **[Payroll Fee Estimate](/partner/manage-client-payroll/fee-estimate)** — estimate the fee and FX for a payroll run and obtain a `feeHash`.
- **[Payroll Requests](/partner/manage-client-payroll/requests)** — create, list, fetch, accept, and cancel payroll requests.
- **[Payroll Transfers](/partner/manage-client-payroll/transfers)** — list the beneficiary transfers produced by payroll requests.
