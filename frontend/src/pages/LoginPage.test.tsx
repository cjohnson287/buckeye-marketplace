import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue(undefined),
    state: { isAuthenticated: false, user: null },
  }),
}));

describe('<LoginPage />', () => {
  it('shows validation error on empty submit', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/email and password are required/i)).toBeInTheDocument();
  });
});
