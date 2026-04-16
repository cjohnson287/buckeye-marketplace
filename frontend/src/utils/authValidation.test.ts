import { validateAuthForm } from './authValidation';

describe('validateAuthForm', () => {
  it('returns invalid for empty input', () => {
    const result = validateAuthForm({ email: '', password: '' });
    expect(result.valid).toBe(false);
    expect(result.message).toContain('required');
  });

  it('returns invalid for malformed email', () => {
    const result = validateAuthForm({ email: 'bademail', password: 'Password1' });
    expect(result.valid).toBe(false);
    expect(result.message).toContain('format');
  });

  it('returns valid for populated credentials', () => {
    const result = validateAuthForm({ email: 'user@example.com', password: 'Password1' });
    expect(result.valid).toBe(true);
  });
});
