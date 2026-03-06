---
title: Technical Details
layout: home
permalink: /auth/technical-details
parent: API Authentication
nav_order: 6
---

## Technical Details

- **Curve**: `secp256k1` (same as Bitcoin)
- **Hash Algorithm**: `SHA-256`
- **Key Format**: `DER → Base64 (storage) → DER Buffer (crypto operations)`
- **Signature Format**: Base64-encoded **ECDSA** signature in **DER** format
- **Timestamp Tolerance**: `300 seconds (5 minutes)`
- **Authorization Prefix**: `Signature` (case-insensitive)
