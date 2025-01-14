import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';
import { supabase } from "@/integrations/supabase/client";

// Mock the entire supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
  },
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
    cancelQueries: vi.fn(),
    clear: vi.fn(),
  }),
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form with all required fields', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/member number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: {
        session: {
          user: { id: '123', user_metadata: { member_number: 'TEST123' } },
        },
      },
      error: null,
    });
    
    (supabase.auth.signInWithPassword as any).mockImplementation(mockSignIn);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const memberNumberInput = screen.getByLabelText(/member number/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(memberNumberInput, { target: { value: 'TEST123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test123@temp.com',
        password: 'TEST123',
      });
    });
  });

  it('handles login error', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' },
    });
    
    (supabase.auth.signInWithPassword as any).mockImplementation(mockSignIn);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const memberNumberInput = screen.getByLabelText(/member number/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(memberNumberInput, { target: { value: 'TEST123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it('handles member verification', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' },
    });
    
    (supabase.auth.signInWithPassword as any).mockImplementation(mockSignIn);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const memberNumberInput = screen.getByLabelText(/member number/i);
    fireEvent.change(memberNumberInput, { target: { value: 'TEST123' } });

    expect(memberNumberInput).toHaveValue('TEST123');
  });

  it('handles network error during login', async () => {
    const mockSignIn = vi.fn().mockRejectedValue(new Error('Network error'));
    
    (supabase.auth.signInWithPassword as any).mockImplementation(mockSignIn);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const memberNumberInput = screen.getByLabelText(/member number/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(memberNumberInput, { target: { value: 'TEST123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });

    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it('handles successful logout', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({ error: null });
    
    (supabase.auth.signOut as any).mockImplementation(mockSignOut);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('handles logout error', async () => {
    const mockSignOut = vi.fn().mockRejectedValue(new Error('Logout error'));
    
    (supabase.auth.signOut as any).mockImplementation(mockSignOut);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });

    expect(screen.getByText(/logout error/i)).toBeInTheDocument();
  });

  it('handles session establishment', async () => {
    const mockGetSession = vi.fn().mockResolvedValue({
      data: {
        session: {
          user: { id: '123', user_metadata: { member_number: 'TEST123' } },
        },
      },
      error: null,
    });

    (supabase.auth.getSession as any).mockImplementation(mockGetSession);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled();
    });

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('handles session error', async () => {
    const mockGetSession = vi.fn().mockRejectedValue(new Error('Session error'));

    (supabase.auth.getSession as any).mockImplementation(mockGetSession);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled();
    });

    expect(screen.getByText(/session error/i)).toBeInTheDocument();
  });

  it('handles edge case: invalid member number format', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const memberNumberInput = screen.getByLabelText(/member number/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(memberNumberInput, { target: { value: 'INVALID' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid member number/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: member number not found', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Member not found' },
    });

    (supabase.auth.signInWithPassword as any).mockImplementation(mockSignIn);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const memberNumberInput = screen.getByLabelText(/member number/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(memberNumberInput, { target: { value: 'NOTFOUND' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
      expect(screen.getByText(/member not found/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: network error during logout', async () => {
    const mockSignOut = vi.fn().mockRejectedValue(new Error('Network error'));

    (supabase.auth.signOut as any).mockImplementation(mockSignOut);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: session timeout', async () => {
    const mockGetSession = vi.fn().mockResolvedValue({
      data: {
        session: null,
      },
      error: { message: 'Session timeout' },
    });

    (supabase.auth.getSession as any).mockImplementation(mockGetSession);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled();
      expect(screen.getByText(/session timeout/i)).toBeInTheDocument();
    });
  });

  it('handles edge case: session expired', async () => {
    const mockGetSession = vi.fn().mockResolvedValue({
      data: {
        session: null,
      },
      error: { message: 'Session expired' },
    });

    (supabase.auth.getSession as any).mockImplementation(mockGetSession);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled();
      expect(screen.getByText(/session expired/i)).toBeInTheDocument();
    });
  });
});
