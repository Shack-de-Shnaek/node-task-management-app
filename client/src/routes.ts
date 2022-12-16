import type { Route } from "svelte-router-spa/types/components/router"
import MainLayout from "./lib/MainLayout.svelte"
import Index from "./lib/pages/Index.svelte"
import Login from "./lib/pages/Login.svelte"
import Project from "./lib/pages/Project.svelte"

export const routes: Route[] = [
    {
        name: '/',
        component: Index,
        layout: MainLayout
    },
    {
        name: 'login',
        component: Login
    },
    {
        name: 'test',
        component: Project,
        layout: MainLayout
    }
]