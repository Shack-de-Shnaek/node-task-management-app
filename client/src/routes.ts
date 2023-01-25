import type { Route } from "svelte-router-spa/types/components/router"
import userIsLoggedInGuard from "./lib/guards/userIsLoggedIn"
import userIsProjectMember from "./lib/guards/userIsProjectMember"
import MainLayout from "./lib/MainLayout.svelte"
import IndexPage from "./lib/pages/IndexPage.svelte"
import LoginPage from "./lib/pages/LoginPage.svelte"
import NewProjectPage from "./lib/pages/NewProjectPage.svelte"
import ProjectAboutPage from "./lib/pages/projects/ProjectAboutPage.svelte"
import ProjectNewTaskPage from "./lib/pages/projects/ProjectNewTaskPage.svelte"
import ProjectPage from "./lib/pages/projects/ProjectPage.svelte"
import ProjectPostsPage from "./lib/pages/projects/ProjectPostsPage.svelte"
import ProjectTasksPage from "./lib/pages/projects/ProjectTasksPage.svelte"
import ProjectWrapper from "./lib/pages/projects/ProjectWrapper.svelte"
import ProjectsPage from "./lib/pages/ProjectsPage.svelte"
import TaskPage from "./lib/pages/projects/TaskPage.svelte"

export const routes: Route[] = [
    {
        name: '/',
        component: IndexPage,
        layout: MainLayout,
    },
    {
        name: 'login',
        component: LoginPage,
    },
    {
        name: 'new-project',
        layout: MainLayout,
        component: NewProjectPage,
    },
    {
        name: 'projects/:projectId',
        layout: MainLayout,
        component: ProjectWrapper,
        nestedRoutes: [
            {
                name: 'index',
                component: ProjectPage,
            },
            {
                name: 'about',
                component: ProjectAboutPage,
            },
            {
                name: 'posts',
                component: ProjectPostsPage,
            },
            {
                name: 'tasks',
                component: ProjectTasksPage,
            },
            {
                name: 'new-task',
                component: ProjectNewTaskPage,
            },
            {
                name: 'tasks/:taskId',
                component: TaskPage,
            },
        ]
    },
    {
        name: 'tasks/:id',
        layout: MainLayout,
        component: TaskPage,
    },
    {
        name: 'test',
        component: ProjectsPage,
        layout: MainLayout,
    }
]