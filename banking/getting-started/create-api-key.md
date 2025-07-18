---
title: Create API Key
layout: home
permalink: /banking/create-api-key
parent: Getting Started
nav_order: 1
---

## Create API Key

This guide explains how to generate a new API key pair for authenticating requests to the **XBD PAY Banking API**. The API key pair consists of a `keyId` (public key) and an `apiSecret` (private key), which must be securely stored.

### Generate API Key

Make a **POST** request to the `/api/keys` endpoint to create a new API key pair.

**Endpoint**: `/api/keys`  
**Method**: `POST`

**Request Headers**:

```bash
curl -X POST /api/keys \
-H "Authorization: Bearer <your-jwt-token>" \
-H "Content-Type: application/json" \
-d '{"name": "My API Key"}'
```

**Response**:

```json
{
  "success": true,
  "data": {
    "keyId": "a1b2c3d4e5f6g7h8",
    "apiSecret": "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg..."
  }
}
```

**Important**: Save both `keyId` and `apiSecret` securely. The apiSecret is your private key and cannot be retrieved again.
