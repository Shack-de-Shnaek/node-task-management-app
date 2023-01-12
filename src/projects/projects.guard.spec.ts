import { ProjectAdminGuard } from './projectsAdmin.guard';

describe('ProjectsGuard', () => {
  it('should be defined', () => {
    expect(new ProjectAdminGuard()).toBeDefined();
  });
});
