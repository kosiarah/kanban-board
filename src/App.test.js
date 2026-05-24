import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  },
}));

test('shows loading state on mount', () => {
  render(<App />);
  expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
});

test('renders three kanban columns after load', async () => {
  render(<App />);
  expect(await screen.findByText('To Do')).toBeInTheDocument();
  expect(screen.getByText('In Progress')).toBeInTheDocument();
  expect(screen.getByText('Done')).toBeInTheDocument();
});

test('renders Add Task button in each column', async () => {
  render(<App />);
  const addButtons = await screen.findAllByText('+ Add Task');
  expect(addButtons).toHaveLength(3);
});
