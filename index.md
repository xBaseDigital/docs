---
title: Get Started
layout: home
nav_order: 1
has_children: true
has_toc: false
---

<div class="home-hero" markdown="0">
  <div class="home-hero-copy">
    <h1 id="build-with-the-relm-api">Build with the Relm API</h1>
    <p class="home-lede">Accounts, payouts, currency exchange, payroll and checkout payments, for your business and the customers you onboard. Every call goes through one signed API.</p>
    <div class="home-actions">
      <a class="btn btn-primary" href="{{ '/auth/getting-started' | relative_url }}">Set up authentication</a>
      <button type="button" class="btn home-ask" data-ask-ai-open hidden>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5l1.9 5.1a4 4 0 0 0 2.5 2.5l5.1 1.9-5.1 1.9a4 4 0 0 0-2.5 2.5L12 21.5l-1.9-5.1a4 4 0 0 0-2.5-2.5L2.5 12l5.1-1.9a4 4 0 0 0 2.5-2.5z"/></svg>
        Ask a question
      </button>
    </div>
  </div>
  <figure class="home-request">
    <figcaption>Every request carries a signature made with your private key</figcaption>
<pre><code><span class="hr-method">POST</span> /v1/accounts/:accountId/payout
<span class="hr-name">Authorization:</span> <span class="hr-value">Signature keyId:</span><span class="hr-sig">base64_signature</span><span class="hr-value">:timestamp</span>
<span class="hr-name">Content-Type:</span> <span class="hr-value">application/json</span></code></pre>
    <a class="home-request-link" href="{{ '/auth/signing-process' | relative_url }}">How request signing works</a>
  </figure>
</div>

<section class="home-directory" aria-labelledby="apis-and-sdks" markdown="0">
  <h2 id="apis-and-sdks">APIs and SDKs</h2>
  <p>Start with authentication, then go to the product you're building with.</p>
  <ul class="home-products">
    <li>
      <a class="home-product-name" href="{{ '/auth' | relative_url }}">API Authentication</a>
      <div>
        <p>Create API keys and sign each request with an ECDSA (secp256k1) signature. Every other API needs this.</p>
        <div class="home-product-links">
          <a href="{{ '/auth/create-api-key' | relative_url }}">Create an API key</a>
          <a href="{{ '/auth/signing-process' | relative_url }}">Sign a request</a>
          <a href="{{ '/auth/troubleshooting' | relative_url }}">Fix signature errors</a>
        </div>
      </div>
    </li>
    <li>
      <a class="home-product-name" href="{{ '/banking' | relative_url }}">Banking API</a>
      <div>
        <p>Work with your own business accounts: currencies, beneficiaries, payouts, currency exchange and transaction history.</p>
        <div class="home-product-links">
          <a href="{{ '/banking/endpoints/payout/create-payout-request' | relative_url }}">Send a payout</a>
          <a href="{{ '/banking/endpoints/exchange/generate-quote' | relative_url }}">Get an exchange quote</a>
          <a href="{{ '/banking/endpoints/transaction/get-transaction-list' | relative_url }}">List transactions</a>
        </div>
      </div>
    </li>
    <li>
      <a class="home-product-name" href="{{ '/partner' | relative_url }}">Partner API</a>
      <div>
        <p>Create customers under your partner account, then run their banking and payroll for them.</p>
        <div class="home-product-links">
          <a href="{{ '/partner/onboard-customer' | relative_url }}">Onboard a customer</a>
          <a href="{{ '/partner/manage-client/payouts' | relative_url }}">Pay out for a client</a>
          <a href="{{ '/partner/manage-client-payroll' | relative_url }}">Run client payroll</a>
        </div>
      </div>
    </li>
    <li>
      <a class="home-product-name" href="{{ '/payroll' | relative_url }}">Payroll</a>
      <div>
        <p>Pay many beneficiaries in different currencies from one source account, with fees shown up front and a quote to approve.</p>
        <div class="home-product-links">
          <a href="{{ '/payroll/api' | relative_url }}">Payroll API</a>
          <a href="{{ '/payroll/widget' | relative_url }}">Payroll widget</a>
          <a href="{{ '/payroll/endpoints/estimate-payroll-fee' | relative_url }}">Estimate fees</a>
        </div>
      </div>
    </li>
    <li>
      <a class="home-product-name" href="{{ '/pos' | relative_url }}">POS API</a>
      <div>
        <p>Accept payments at checkout: create orders, look them up, and receive order events by webhook.</p>
        <div class="home-product-links">
          <a href="{{ '/pos/checkout' | relative_url }}">Create an order</a>
          <a href="{{ '/pos/fetch-orders' | relative_url }}">Fetch orders</a>
          <a href="{{ '/pos/webhook/events' | relative_url }}">Order events</a>
        </div>
      </div>
    </li>
    <li>
      <a class="home-product-name" href="{{ '/sdk-integration' | relative_url }}">SDK Integration</a>
      <div>
        <p>Embed Relm's onboarding flow and Sumsub KYC/KYB verification in your own app.</p>
        <div class="home-product-links">
          <a href="{{ '/onboarding-sdk' | relative_url }}">Onboarding SDK</a>
          <a href="{{ '/sumsub-sdk' | relative_url }}">Sumsub SDK</a>
        </div>
      </div>
    </li>
  </ul>
</section>
