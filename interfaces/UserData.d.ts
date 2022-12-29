export type UserData = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    description: string | null;
    projects: [];
    leaderOfProjects: [];
    posts: [];
    createdTasks: [];
}