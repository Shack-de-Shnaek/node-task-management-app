import type { Route } from "svelte-router-spa/types/components/router"
import userIsLoggedInGuard from "./lib/guards/userIsLoggedIn"
import MainLayout from "./lib/MainLayout.svelte"
import IndexPage from "./lib/pages/IndexPage.svelte"
import LoginPage from "./lib/pages/LoginPage.svelte"
import ProjectPage from "./lib/pages/ProjectPage.svelte"
import ProjectsPage from "./lib/pages/ProjectsPage.svelte"

export const routes: Route[] = [
    {
        name: '/',
        // onlyIf: { guard: userIsLoggedInGuard, redirect: '/login' },
        component: IndexPage,
        layout: MainLayout,
    },
    {
        name: '/login',
        component: LoginPage
    },
    {
        name: '/project/:id',
        // onlyIf: { guard: userIsLoggedInGuard, redirect: '/login' },
        component: ProjectPage,
        layout: MainLayout,
    },
    {
        name: '/test',
        // onlyIf: { guard: userIsLoggedInGuard, redirect: '/login' }, 
        component: ProjectsPage,
        layout: MainLayout,
    }
]