---
title: Getting Started
layout: home
permalink: /auth/getting-started
parent: API Authentication
nav_order: 1
---

# Getting Started with RELM API

This guide will help you get started with integrating RELM's payment and banking services into your application.

## Environment URLs

RELM provides two environments for integration and testing. Use the appropriate base URL depending on the environment you are working in.

| Environment | Base URL                      | Purpose                                                      |
| ----------- | ----------------------------- | ------------------------------------------------------------ |
| Sandbox     | `https://sandbox.api.relm.co` | For development and testing. Use this environment to integrate and test your application without affecting real transactions. |
| Production  | `https://api.relm.co`         | For live transactions. Switch to this environment once your integration is complete and tested. |

### Important Notes

- **Always start with Sandbox**: Begin your integration in the Sandbox environment to test your implementation safely.
- **Separate API Keys**: You will need different API keys for Sandbox and Production environments.
- **Base URL Usage**: Append the API endpoint path to the base URL. For example:
  - Sandbox: `https://sandbox.api.relm.co/v1/pos/client/order/create`
  - Production: `https://api.relm.co/v1/pos/client/order/create`