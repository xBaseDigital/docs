---
title: API SDK Setup
layout: home
permalink: /api-sdk-setup
parent: Plug-ins and SDKs
nav_order: 2
---

# Integrating checkout directly to our API

To integrate XBD Checkout into your store, follow these steps.


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


You will receive a <strong>paymentRedirectUrl</strong> in the response, which you need to redirect the user to.

With this <strong>paymentRedirectUrl</strong>, your store will be navigated to our Checkout solution which will further process the order and receive the payment.

### Our Sample Website For Demo:

- Ecommerce store: https://xkicks.store

- Repo: https://github.com/xBaseDigital/xkicks

