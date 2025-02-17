---
title: Web SDK Setup
layout: home
permalink: /api-sdk-setup
parent: Plug-ins and SDKs
nav_order: 3
---

# Integrating checkout via Web SDK
To integrate XBD Checkout into your store, follow these steps.


## Prerequisites
XBD will provide you with the following details necessary for order creation to function, which must be kept confidential on your side:

- [x] Pos Client ID
- [x] Pos Client Secret


Sandbox URL – `https://pay-sandbox.xbase.digital/` <br />
Production URL – `https://pay.xbase.digital/`


## Integration Steps

<strong>Step 1.</strong> Install the package `%PACKAGE_NAME%`
Add the libary at the root of the app. For example main.tsx

```js
import { initGlobalSdk } from '../sdk/checkout-sdk.es'; 

window.MyCheckoutSDK = initGlobalSdk({
  "grant_type" : "client_credentials", 
  "client_id" : <POS Client Id which you received from XBD >, 
  "client_secret" : <POS Client Secret which you received from XBD >
  "merchantLocationId" : <Merchant Location Id which will be provided by XBD>, 
});
```


<strong>Step 2.</strong> On Checkout call the checkout method.

```js
 const checkoutResponse =  await window.MyCheckoutSDK.checkout({
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
  });
```


You will receive a <strong>paymentRedirectUrl</strong> in the response, which you need to redirect the user to.

With this <strong>paymentRedirectUrl</strong>, your store will be navigated to our Checkout solution which will further process the order and receive the payment.

### Our Sample Website For Demo:

- Ecommerce store: https://xkicks.store
- Repo: https://github.com/xBaseDigital/xkicks

