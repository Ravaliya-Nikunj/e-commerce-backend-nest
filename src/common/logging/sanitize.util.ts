// src/common/logging/sanitize.util.ts
const SENSITIVE_KEYS = [
  'password',
  'repeatPassword',
  'confirmPassword',
  'token',
  'otp',
  'requestToken',
  'cvc',
  'cvv',
  'expiryMonth',
  'expiryYear',
];

export function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.includes(key)) {
      sanitized[key] = '[MASKED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
