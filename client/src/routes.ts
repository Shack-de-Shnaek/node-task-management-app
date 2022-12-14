import type { Route } from "svelte-router-spa/types/components/router"
import userIsLoggedInGuard from "./lib/guards/userIsLoggedIn"
import MainLayout from "./lib/MainLayout.svelte"
import IndexPage from "./lib/pages/IndexPage.svelte"
import LoginPage from "./lib/pages/LoginPage.svelte"
import NewProjectPage from "./lib/pages/NewProjectPage.svelte"
import ProjectAboutPage from "./lib/pages/projects/ProjectAboutPage.svelte"
import ProjectPage from "./lib/pages/projects/ProjectPage.svelte"
import ProjectPostsPage from "./lib/pages/projects/ProjectPostsPage.svelte"
import ProjectSettingsPage from "./lib/pages/projects/ProjectSettingsPage.svelte"
import ProjectTasksPage from "./lib/pages/projects/ProjectTasksPage.svelte"
import ProjectWrapper from "./lib/pages/projects/ProjectWrapper.svelte"
import ProjectsPage from "./lib/pages/ProjectsPage.svelte"

export const routes: Route[] = [
    {
        name: '/',
        component: IndexPage,
        layout: MainLayout,
    },
    {
        name: 'login',
        component: LoginPage
    },
    {
        name: 'new-project',
        layout: MainLayout,
        component: NewProjectPage
    },
    {
        name: 'projects/:id',
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
                name: 'settings',
                component: ProjectSettingsPage,
            },
        ]
    },
    {
        name: 'test',
        component: ProjectsPage,
        layout: MainLayout,
    }
]