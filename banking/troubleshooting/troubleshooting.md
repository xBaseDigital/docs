---
title: Troubleshooting
layout: home
permalink: /banking/troubleshooting
parent: Banking API
nav_order: 5
---

## Common Issues

### 1. Invalid Signature

- ✅ Verify the **canonical string** format.
- ⏱️ Check that the **timestamp is current** (within 5 minutes of the server time).
- 🔐 Ensure correct **private key extraction** from DER format.

### 2. Authentication Failed

- 🔑 Verify that the **keyId** matches your API key.
- 🔄 Check if the **API key is still active** (i.e., not revoked).
- 🧾 Ensure the **Authorization header** follows the correct format:

### 3. Timestamp Outside Tolerance

- 🕒 Synchronize your system clock with a trusted time source.
- 🪪 The request timestamp **must be within 5 minutes** of the server time.
