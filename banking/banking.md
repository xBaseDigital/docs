---
title: Banking API
layout: home
permalink: /banking
parent: Get Started
nav_order: 1
---

# Banking API Documentation

This guide provides comprehensive details for integrating with the **Relm Banking API**. It covers endpoints for managing customer details, currencies, accounts, transactions, and beneficiaries, including endpoint descriptions, request formats, and response structures.

## Overview

The Relm Banking API enables secure and efficient management of financial operations, leveraging advanced cryptographic authentication for enhanced security.

## API Key Authentication with ECDSA Signatures

The API uses **ECDSA (Elliptic Curve Digital Signature Algorithm)** with the **secp256k1 curve** for secure request authentication. This ensures that all API calls are verified and protected against unauthorized access.

### Authentication Process

- **Client Responsibilities**:
  - Sign API requests using your **private key**.
  - Include the signature in the request headers.
- **Server Responsibilities**:
  - Verify signatures using the corresponding **public key**.
- **Key Storage**:
  - All keys are stored in **DER format** and encoded as **base64 strings**.

### Authentication Steps

1. Generate an ECDSA key pair (private and public keys) using the secp256k1 curve.
2. Securely store your private key and share the public key with RELM.
3. Sign each API request with your private key.
4. Include the base64-encoded signature in the request headers.
5. The server validates the signature against your public key to authenticate the request.

## Getting Started

- **Obtain API Keys**: Sign up at [RELM](https://portal.relm.co/) and finish your onboarding to generate your ECDSA key pair.
- **Contact Support**: Reach out to [support@relm.co](mailto:support@relm.co) for assistance.
