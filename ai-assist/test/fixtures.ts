import type { DocsIndex } from '../src/retrieval';

export const INDEX: DocsIndex = {
  version: 1,
  site: 'Relm Developer Portal',
  generated_at: '2026-10-22T00:00:00Z',
  pages: [
    {
      url: '/auth/signing-process',
      title: 'Signing Process',
      parent: 'API Authentication',
      content: [
        '# Signing Process',
        'Every request is signed with your ECDSA private key.',
        '## Canonical String',
        '### Step 1 -- Build the Canonical String',
        'Join the method, path, timestamp and body hash with newlines.',
        '```',
        '# not a heading: this is inside a code block',
        'POST\\n/v1/accounts\\n1700000000',
        '```',
        '### Step 2 -- Sign the Canonical String',
        'Sign it with SHA-256 and base64-encode the signature.',
      ].join('\n'),
    },
    {
      url: '/banking/endpoints/payout/create-payout-request',
      title: 'Create Payout Request',
      parent: 'Payout',
      grand_parent: 'Banking API',
      content: [
        '## Create Payout Request',
        'This endpoint initiates a payout to a beneficiary. It requires a `feeHash` from Estimate Payout Fees.',
        '### Request Body',
        '```json',
        '{ "beneficiaryId": "…", "amount": "111", "currency": "GBP", "feeHash": "…" }',
        '```',
      ].join('\n'),
    },
    {
      url: '/pos/webhook/events',
      title: 'Order Events',
      parent: 'Webhook',
      content: '## Order Confirmation Event\nSent when an order is paid.\n## Order Cancellation Event\nSent when an order is cancelled.',
    },
  ],
};
