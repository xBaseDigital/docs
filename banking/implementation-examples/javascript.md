---
title: JavaScript - Browser/Node.js
layout: home
permalink: /banking/implementation-examples/javascript
parent: Implementation Examples
nav_order: 1
---

## JavaScript - Browser/Node.js

```js
// Using crypto-js and elliptic libraries
async function signRequest(
  method,
  path,
  body,
  contentType,
  keyId,
  privateKeyBase64
) {
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Build canonical string
  const parts = [method.toUpperCase(), path, timestamp];

  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && body) {
    const bodyHash = CryptoJS.SHA256(body).toString(CryptoJS.enc.Hex);
    parts.push(bodyHash);

    if (contentType) {
      parts.push(contentType);
    }
  }

  const canonicalString = parts.join("\n");

  // Extract private key from DER format
  const derBuffer = CryptoJS.enc.Base64.parse(privateKeyBase64);
  const derBytes = [];
  for (let i = 0; i < derBuffer.sigBytes; i++) {
    derBytes.push(
      (derBuffer.words[Math.floor(i / 4)] >>> (24 - (i % 4) * 8)) & 0xff
    );
  }

  // Find the 32-byte private key in PKCS#8 DER structure
  let privateKeyHex;
  for (let i = 0; i < derBytes.length - 32; i++) {
    if (derBytes[i] === 0x04 && derBytes[i + 1] === 0x20) {
      const candidateKey = derBytes.slice(i + 2, i + 34);
      privateKeyHex = candidateKey
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      break;
    }
  }

  if (!privateKeyHex) {
    privateKeyHex = derBytes
      .slice(-32)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Create signature
  const ec = new elliptic.ec("secp256k1");
  const keyPair = ec.keyFromPrivate(privateKeyHex, "hex");
  const messageHash = CryptoJS.SHA256(canonicalString).toString(
    CryptoJS.enc.Hex
  );
  const signature = keyPair.sign(messageHash, { canonical: true });

  // Convert to base64
  const derSignature = signature.toDER();
  const signatureBase64 = btoa(String.fromCharCode.apply(null, derSignature));

  return `Signature ${keyId}:${signatureBase64}:${timestamp}`;
}

// Usage
const authHeader = await signRequest(
  "GET",
  "/api/users",
  null,
  null,
  "your-key-id",
  "your-private-key-base64"
);

fetch("/api/users", {
  headers: {
    Authorization: authHeader,
  },
});
```
