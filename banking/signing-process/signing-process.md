---
title: Signing Process
layout: home
permalink: /banking/signing-process
parent: Banking API
nav_order: 2
---

## Canonical String

This guide explains how to construct a canonical string for authenticating API requests to the **XBD Money Banking API**. The canonical string is a critical component used in ECDSA signature generation for secure API authentication.

### Step 1 -- Build the Canonical String

The canonical string is formed by combining specific request components in a standardized format. This string is then signed using your private key (e.g., `apiSecret` from the API key pair) to authenticate requests.

### Format

The canonical string format depends on the HTTP method:

**For GET requests**

```
METHOD\nPATH\nTIMESTAMP
```

**For POST, PUT, or PATCH requests with a body**

```
METHOD\nPATH\nTIMESTAMP\nBODY_HASH\nCONTENT_TYPE
```

### Step 2 -- Sign the Canonical String

To authenticate your API requests, follow these steps to sign the canonical string:

1. **Hash the canonical string** using **SHA-256**.
2. **Sign the hash** using your **private key** (secp256k1 ECDSA).
3. **Encode the resulting signature** using **Base64**.

This signature is then used in the `Authorization` header:

### Step 3 -- Build Authorization Header

```
Authorization: Signature keyId:base64_signature:timestamp
```
