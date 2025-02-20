---
title: Custom Checkout UI
layout: home
permalink: /xbd-ui-api
parent: Plug-ins and SDKs
nav_order: 4
---

# Build custom UI
To build your own XBD Checkout into your store, follow these steps.
Currenty you can do it via interacting with our API directly, but soon we will have an SDK to help you to interact via JS.


## Prerequisites
XBD will provide you with the following details necessary for order creation to function, which must be kept confidential on your side:

- [x] Pos Client ID
- [x] Pos Client Secret


Sandbox URL – `https://pay-sandbox.xbase.digital/` <br />
Production URL – `https://pay.xbase.digital/`

## Integration Steps

<strong>Step 1.</strong> Call the <strong>Token API</strong> to obtain access token to authenticate the further apis
Endpoint – <strong>identity/api/Authentication/connect/token</strong>

Method – <strong>`POST`</strong>

```js
{ 
  "grant_type" : "client_credentials", 
  "client_id" : <POS Client Id which you received from XBD >, 
  "client_secret" : <POS Client Secret which you received from XBD >
}
```
The above api will return access token which is needed for further api to function

<strong>Step 2.</strong> Call the <strong>Authorise API</strong> to create an order on XBD System
Endpoint – `api/orders/authorize`

Method – <strong>`PUT`</strong>

```js
header : {
  "Content-Type" : "application/json"
  "Authorization" : "Bearer <access_token from Step 1>"
}
```

```js
body : { 
  "merchantLocationId" : <Merchant Location Id which will be provided by XBD>, 
  "merchantOrderId" : <Order ID which you will generate from your side>, 
  "title" : <Your Business Name>,
  "description" : <Description of the Cart>,
  "amount" : <Cart Amount>,
  "currency" : <Currency of the Cart>,
  "email" : <Customer Email ID>,
  "acceptUrl" : <Your Accept Url>,
  "cancelUrl" : <Your Cancel Url>,
  "callbackUrl" : <Your Callback Url>,
}
```


You will receive a <strong>paymentRedirectUrl</strong> in the response,but you don't need to redirect the user.


3. <strong>Step 3.</strong> To fetch currencies
Method - <strong>`Get`<strong>
Endpoint  - `/External/pos/currencies`



4. <strong>Step 4.</strong> To fetch payment QR code
Method - <strong>`Get`<strong>
Endpoint - `/External/pos/purchase/generate/qr`

Payload Interaface

```
interface QrPayloadData {
  orderId: string;
  data: ICheckoutPayload;
}

interface ICheckoutPayload {
  cryptoCurrency: string;
  platformId: number;
  lightningNetwork?: boolean;
  customerEmail?: string;
}
```