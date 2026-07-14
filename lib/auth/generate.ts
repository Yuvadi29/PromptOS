import crypto from 'crypto';

export const API_KEY_PREFIX = 'sk_live_pm';

// Generates a new PromptOS API Key
export function generateAPIKey() {
  return {
    key: API_KEY_PREFIX + crypto.randomBytes(32).toString('hex'),
    prefix: API_KEY_PREFIX,
  };
}
