import { authReducer, initialAuthState } from './authReducer';

describe('authReducer', () => {
  it('handles LOGIN_SUCCESS', () => {
    const next = authReducer(initialAuthState, {
      type: 'LOGIN_SUCCESS',
      payload: {
        token: 'token',
        email: 'user@example.com',
        displayName: 'User',
        role: 'User',
      },
    });

    expect(next.isAuthenticated).toBe(true);
    expect(next.user?.email).toBe('user@example.com');
  });

  it('handles LOGOUT', () => {
    const authenticatedState = {
      isAuthenticated: true,
      user: {
        token: 'token',
        email: 'admin@example.com',
        displayName: 'Admin',
        role: 'Admin' as const,
      },
    };

    const next = authReducer(authenticatedState, { type: 'LOGOUT' });

    expect(next.isAuthenticated).toBe(false);
    expect(next.user).toBeNull();
  });
});
