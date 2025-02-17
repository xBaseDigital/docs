---
title: Checkout
layout: home
permalink: /checkout
nav_order: 2
---

# Web SDK 

## PHP SDK - How to use XBD with PHP SDK to intergrate into OpenCart or directly.
<i>This is a technical guide for developers and it requires programming experience to follow through the guide.<i>

### Prerequisite:
1. An approved XBD Merchant Account


## How to Install PHP Plugin in OpenCart

```
git clone https://github.com/xBaseDigital/open-cart-plugin
```

## Directly


### Usage Examples
For every call that we do we re-authenticate and then do the following calls.


```js
$auth_Data = array(
    'grant_type'            => 'client_credentials',
    'client_id'             => $this->config->get($this::CONFIG_XBDPAY_CLIENT_ID),
    'client_secret'         => $this->config->get($this::CONFIG_XBDPAY_SECRET),
);
```
```
"https://pay-sandbox.xbase.digital/identity/api/Authentication/connect/token"
```


1.  Confirm / Create in xbase, return redirect

```
"https://pay-sandbox.xbase.digital/api/orders/authorize"
```


```
    /**
    *  PUT creat order in xbase, return redirect
    */
    $paymentData = array(
        'merchantLocationId' => $this->config->get($this::CONFIG_XBDPAY_MERCHANT_ID),
        'merchantOrderId' => $order['order_id'],
        'title' => $this->config->get('config_name'),
        'description' => 'Order#' . $order['order_id'],
        'amount' => $order['total'],
        'currency' => $order['currency_code'],
        'email' => $order['email'],
        'acceptUrl' => HTTPS_SERVER . $this::ACCEPT_URL . '/&order_id=' . $order['order_id'],
        'cancelUrl' => HTTPS_SERVER . $this::CANCEL_URL,
        'callbackUrl' => 'http://172.16.1.150:8080/' . $this::CALLBACK_URL . '/&order_id=' . $order['order_id'],
    );
```


2.callback 

```
"https://pay-sandbox.xbase.digital/api/orders/".$order['order_id']."/status"
```

repsonse: 
Order status:  'Paid'

