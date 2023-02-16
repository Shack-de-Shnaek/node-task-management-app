<script lang="ts">
    import { fade } from 'svelte/transition';
	import getCurrentUser from '../utilities/getCurrentUser';

    let mode: 'Login' | 'Register' = 'Login';

    const loginUserData = {
        email: '',
        password: ''
    }

    const registerUserData = {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    }

    const switchMode = (newMode: 'Login' | 'Register') => {
        mode = newMode;
        if(newMode === 'Login') {
            for(const key in registerUserData) {
                registerUserData[key] = '';
            }
        } else {
            for(const key in loginUserData) {
                loginUserData[key] = '';
            }
        }
    }

    const login = async() => {
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginUserData)
            });
            if(res.ok) {
                const json = await res.json();
                getCurrentUser();
                window.location.pathname = '/';
            } else if(res.status === 404) {
                alert('That user does not exist');
            } else if(res.status === 401) {
                alert('Wrong password');
            }
        } catch(e) {
            console.log(e);
        }
    }

    const register = async() => {
        if(registerUserData.password !== registerUserData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        const {confirmPassword, ...data} = registerUserData;

        try {
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if(res.ok) {
                for(const key in registerUserData) registerUserData[key] = '';
                mode = 'Login';
            }
        } catch(e) {
            console.log(e);
        }
    }
</script>

<div class="auth-screen d-flex w-100 h-100 flex-column align-items-center justify-content-center bg-dark">
    <div class="auth-container px-3 py-4 d-flex flex-column bg-light rounded-1">
        <h2 class="mode-message w-100">
            {mode}
        </h2>
        {#if mode === 'Login'}
        <form id="login-form" class="d-flex flex-column gap-3" in:fade on:submit|preventDefault={login} >
            <input type="email" name="email" class="" id="login-email-input" placeholder="Email" required bind:value={loginUserData.email}>
            <input type="password" name="password" class="" id="login-password-input" placeholder="Password" required bind:value={loginUserData.password}>
            <button type="submit" class="btn btn-primary w-25 mx-auto">Log in</button>
        </form>
        <button on:click={() => switchMode('Register')} class="change-mode-button border-0 rounded-1 p-1">I don't have an account</button>
        {:else if mode === 'Register'}
        <form id="register-form" class="d-flex flex-column gap-3" in:fade on:submit|preventDefault={register} >
            <input type="text" name="firstName" class="" id="register-first-name-input" placeholder="First name" required bind:value={registerUserData.firstName}>
            <input type="text" name="lastName" class="" id="register-last-name-input" placeholder="Last name" required bind:value={registerUserData.lastName}>
            <input type="email" name="email" class="" id="register-email-input" placeholder="Email" required bind:value={registerUserData.email}>
            <input type="password" name="password" class="" id="register-password-input" placeholder="Password" required bind:value={registerUserData.password}>
            <input type="password" name="" class="" id="register-confirm-password-input" placeholder="Confirm password" required bind:value={registerUserData.confirmPassword}>
            <button type="submit" class="btn btn-primary w-25 mx-auto">Sign up</button>
        </form>
        <button on:click={() => switchMode('Login')} class="change-mode-button border-0 rounded-1 p-1">I already have an account</button>
        {/if}
    </div>
</div>

<style>    
    input {
        outline: none;
        border-radius: 0;    
        border: none;
        background-color: inherit;
    }

    input:not([type=submit]) {
        width: 24rem;
        max-width: 85vw;
        border-bottom: 2px solid var(--dark-gray);
        transition: 0.2s;
    }

    input:not([type=submit]):focus, input:not([type=submit]):hover {
        border-bottom-color: var(--bs-primary);
    }

    button[type=submit] {
        min-width: fit-content;
    }

    form {
        width: fit-content;
    }

    .auth-container {
        width: fit-content;
        height: 25rem;
    }

    .change-mode-button {
        width: fit-content;
        margin-top: auto;
        background-color: inherit;
        color: var(--dark-gray);
    }

    .change-mode-button:hover, .change-mode-button:focus {
        color: var(--dark-blue);
    }
</style>