---
title: Python
layout: home
permalink: /banking/implementation-examples/python
parent: Implementation Examples
nav_order: 2
---

## Python

```bash
import hashlib
import base64
import time
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import load_der_private_key

def sign_request(method, path, body=None, content_type=None, key_id=None, private_key_base64=None):
    timestamp = str(int(time.time()))

    # Build canonical string
    parts = [method.upper(), path, timestamp]

    if method.upper() in ['POST', 'PUT', 'PATCH'] and body:
        body_hash = hashlib.sha256(body.encode()).hexdigest()
        parts.append(body_hash)

        if content_type:
            parts.append(content_type)

    canonical_string = '\n'.join(parts)

    # Load private key from DER format
    private_key_der = base64.b64decode(private_key_base64)
    private_key = load_der_private_key(private_key_der, password=None)

    # Sign the canonical string
    canonical_bytes = canonical_string.encode('utf-8')
    signature = private_key.sign(canonical_bytes, ec.ECDSA(hashes.SHA256()))
    signature_base64 = base64.b64encode(signature).decode('ascii')

    return f"Signature {key_id}:{signature_base64}:{timestamp}"

# Usage
import requests

auth_header = sign_request(
    'GET',
    '/api/users',
    None,
    None,
    'your-key-id',
    'your-private-key-base64'
)

response = requests.get(
    'https://api.example.com/api/users',
    headers={'Authorization': authHeader}
)
```
