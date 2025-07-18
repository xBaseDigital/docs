---
title: Authentication Format
layout: home
permalink: /banking/auth-format
parent: Getting Started
nav_order: 2
---

## Authentication Format

All authenticated requests must include an `Authorization` header:

### Where:

- `keyId` – Your API key identifier
- `signature` – Base64-encoded ECDSA signature
- `timestamp` – Unix timestamp (seconds since epoch)
