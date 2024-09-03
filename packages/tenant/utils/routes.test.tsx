import routes, { createResourceRoutes } from './routes';

describe('createResourceRoutes', () => {
  it('should return the correct routes for a given resource', () => {
    const resourceRoutes = createResourceRoutes('example');

    expect(resourceRoutes.root).toBe('/example');
    expect(resourceRoutes.create).toBe('/example/create');
    expect(resourceRoutes.view).toBe('/example/view/:id');
  });

  it('should replace placeholders in the routes with actual values', () => {
    const resourceRoutes = createResourceRoutes('example');
    const viewRouteWithId = resourceRoutes.view.replace(':id', '123');

    expect(viewRouteWithId).toBe('/example/view/123');
  });
});

describe('routes', () => {
  it('should contain the correct static routes', () => {
    const { root, login, forgotPassword, resetPassword, dashboard, } = routes;

    expect(root).toBe('/');
    expect(login).toBe("/login");
    expect(forgotPassword).toBe("/forgot-password");
    expect(resetPassword).toBe("/reset-password/:token");
    expect(dashboard.root).toBe('/dashboard');
  });
});
