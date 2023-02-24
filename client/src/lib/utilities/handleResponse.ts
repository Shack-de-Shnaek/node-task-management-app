import type { NestError } from "../../../../interfaces/NestError";
import { navigateTo } from "svelte-router-spa";

type handleResponseOptions = {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    headers?: { [key: string]: string },
    body?: Object,
    errorMessage?: string
}

async function handleResponse<T>(
    url: string,
    options: handleResponseOptions,
    callback: (json?: T) => void,
) {
    let res: Response;
    try {
        res = await fetch(url, {
            method: options.method ? options.method : 'GET',
            headers: options.headers ? options.headers : { 'Content-Type': 'application/json' },
            body: options.body ? JSON.stringify(options.body) : undefined,
            redirect: 'follow',
        });
    } catch (e) {
        console.log(e);
        alert(options.errorMessage ? options.errorMessage : 'Could not fetch data');
    }
    
    if (res === undefined) return;

    if (res.ok) {
        try {
            const json: T = await res.json();
            callback(json);
        } catch (e) {
            callback();
        }
    } else {
        if (res.status === 401) {
            navigateTo('login');
            return;
        }

        const json: NestError = await res.json();
        if (json.message !== undefined) {
            alert(json.message);
            return;
        }
        let errorText = '';
        if (json.messages !== undefined) {
            for (const message of json.messages) errorText += (message + '\n');
        }
        alert(errorText);
    }   
}

export default handleResponse; 