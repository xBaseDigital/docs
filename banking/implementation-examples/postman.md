---
title: Postman Pre-request Script
layout: home
permalink: /banking/implementation-examples/postman
parent: Implementation Examples
nav_order: 3
---

## Postman Pre-request Script

```js
new Promise((resolve, reject) => {
  // Load crypto-js for hashing
  pm.sendRequest(
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js",
    (err, res) => {
      if (err) return reject(err);

      // Evaluate crypto-js
      const sandbox = {};
      const cryptoJsLoader = new Function("window", "self", res.text());
      cryptoJsLoader.call(sandbox, sandbox, sandbox);

      // Load elliptic for ECDSA
      pm.sendRequest(
        "https://cdnjs.cloudflare.com/ajax/libs/elliptic/6.5.4/elliptic.min.js",
        (err, res) => {
          if (err) return reject(err);

          // Evaluate elliptic
          const ellipticLoader = new Function("window", "self", res.text());
          ellipticLoader.call(sandbox, sandbox, sandbox);

          try {
            const { CryptoJS, elliptic } = sandbox;

            // Get environment variables
            const base64PrivateKey = pm.environment.get("privateKey");
            const keyId = pm.environment.get("keyId");

            if (!base64PrivateKey || !keyId) {
              throw new Error("Missing privateKey or keyId in environment");
            }

            // Build request data
            const method = pm.request.method.toUpperCase();
            const path = pm.request.url.getPathWithQuery();
            const timestamp = Math.floor(Date.now() / 1000).toString();

            // Create canonical string
            const parts = [method, path, timestamp];

            if (["POST", "PUT", "PATCH"].includes(method)) {
              const body = pm.request.body ? pm.request.body.raw || "" : "";
              const bodyHash = CryptoJS.SHA256(body).toString(CryptoJS.enc.Hex);
              parts.push(bodyHash);

              const contentType = pm.request.headers.get("Content-Type");
              if (contentType) {
                parts.push(contentType);
              }
            }

            const canonicalString = parts.join("\n");
            console.log("Canonical string:", JSON.stringify(canonicalString));

            // Parse DER format to extract private key
            const derBuffer = CryptoJS.enc.Base64.parse(base64PrivateKey);
            const derBytes = [];
            for (let i = 0; i < derBuffer.sigBytes; i++) {
              derBytes.push(
                (derBuffer.words[Math.floor(i / 4)] >>> (24 - (i % 4) * 8)) &
                  0xff
              );
            }

            // Extract 32-byte private key from PKCS#8 DER structure
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

            // Convert to DER format and base64 encode
            const derSignature = signature.toDER();
            const signatureBase64 = btoa(
              String.fromCharCode.apply(null, derSignature)
            );

            // Set authorization header
            const authHeader = `Signature ${keyId}:${signatureBase64}:${timestamp}`;
            pm.request.headers.upsert({
              key: "Authorization",
              value: authHeader,
            });

            console.log("Auth header set:", authHeader);
            resolve();
          } catch (error) {
            console.error("Signing error:", error);
            reject(error);
          }
        }
      );
    }
  );
});
```

---

## How to Use the Postman Pre-request Script

Follow these steps to configure and use the pre-request script in Postman for authenticated API requests.

---

## Step-by-Step Instructions

1. **Open your Postman application.**

2. **Create a new collection** or select an existing one for your API requests.

3. **Click on the collection**, then go to the **Pre-request Scripts** tab.

4. **Copy and paste the provided pre-request script** into the editor.

5. **Set the required environment variables in Postman:**

   - `keyId`: Your API key ID  
     _Example_: `a1b2c3d4e5f6g7h8`

   - `privateKey`: Your **base64-encoded** private key  
     _Example_:
     ```
     MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg...
     ```

   > 💡 To set variables, go to **Environment > Edit**, add the variables, and click **Save**.

6. **Configure your API request** in the request editor:

   - Set the HTTP **method**
   - Provide the **URL**
   - Add any **headers**
   - Add the **request body** if needed

7. **Send the request**.  
   The pre-request script will automatically:

   - Generate the canonical string
   - Sign it using your private key
   - Construct the `Authorization` header in the format:

     ```
     Authorization: Signature keyId:signature:timestamp
     ```

---

## Required Environment Variables for Postman

| Variable     | Description                                  | Example                       |
| ------------ | -------------------------------------------- | ----------------------------- |
| `keyId`      | Your API key identifier                      | `a1b2c3d4e5f6g7h8`            |
| `privateKey` | Base64-encoded ECDSA private key (apiSecret) | `MIGHAgEAMBMGByqGSM49AwEH...` |
