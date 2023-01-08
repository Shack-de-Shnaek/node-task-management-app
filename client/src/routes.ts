import type { Route } from "svelte-router-spa/types/components/router"
import userIsLoggedInGuard from "./lib/guards/userIsLoggedIn"
import MainLayout from "./lib/MainLayout.svelte"
import IndexPage from "./lib/pages/IndexPage.svelte"
import LoginPage from "./lib/pages/LoginPage.svelte"
import NewProjectPage from "./lib/pages/NewProjectPage.svelte"
import ProjectPage from "./lib/pages/ProjectPage.svelte"
import ProjectsPage from "./lib/pages/ProjectsPage.svelte"

export const routes: Route[] = [
    {
        name: '/',
        component: IndexPage,
        layout: MainLayout,
    },
    {
        name: '/login',
        component: LoginPage
    },
    {
        name: '/projects',
        layout: MainLayout,
        nestedRoutes: [
            {
                name: '/new',
                component: NewProjectPage,
            },
            {
                name: '/:id',
                component: ProjectPage,
            }, 
        ]
    },
    {
        name: '/test',
        component: ProjectsPage,
        layout: MainLayout,
    }
]