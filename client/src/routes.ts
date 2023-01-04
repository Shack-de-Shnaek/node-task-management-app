import type { Route } from "svelte-router-spa/types/components/router"
import userIsLoggedInGuard from "./lib/guards/userIsLoggedIn"
import MainLayout from "./lib/MainLayout.svelte"
import Index from "./lib/pages/Index.svelte"
import Login from "./lib/pages/Login.svelte"
import Project from "./lib/pages/Project.svelte"
import Projects from "./lib/pages/Projects.svelte"

export const routes: Route[] = [
    {
        name: '/',
        // onlyIf: { guard: userIsLoggedInGuard, redirect: '/login' },
        component: Index,
        layout: MainLayout,
    },
    {
        name: '/login',
        component: Login
    },
    {
        name: '/project/:id',
        // onlyIf: { guard: userIsLoggedInGuard, redirect: '/login' },
        component: Project,
        layout: MainLayout,
    },
    {
        name: '/test',
        // onlyIf: { guard: userIsLoggedInGuard, redirect: '/login' }, 
        component: Projects,
        layout: MainLayout,
    }
]