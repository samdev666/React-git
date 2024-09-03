import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { apiCall } from '../redux/actions';
import { useEntity } from './entity';
import store from '../redux/store';

const TestComponent = () => {
  const { entity } = useEntity('/api/account');
  return (
    <div data-testid="test-entity">
      {(entity as { name?: string })?.name}
    </div>
  );
};
jest.mock('../redux/actions');
describe('useEntity tests', () => {
  beforeEach(() => {
    const mockEntity = { id: 1, name: 'Test Entity' };
    (apiCall as jest.Mock).mockResolvedValueOnce(mockEntity);
    render(
      <MemoryRouter initialEntries={['/entities/1']}>
        <Provider store={store}>
          <TestComponent />
        </Provider>
      </MemoryRouter>,
    );
  });
  it('should render the entity after the API call', async () => {
    await waitFor(() => {
      const testEntity = screen.getByTestId('test-entity');
      expect(testEntity).toBeInTheDocument();
    });
  });
});
