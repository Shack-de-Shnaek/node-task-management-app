import { currentUserData } from "../../store";
import type { UserData } from "../../../../interfaces/UserData";
import { navigateTo } from "svelte-router-spa";

const getCurrentUser = async () => {
    try {
        const res = await fetch('/auth/current-user');
        if (res.status === 404) {
            // alert('You are not logged in');
            // navigateTo('/login');
            return null; 
        }
        const userData: UserData = await res.json();
        currentUserData.set(userData);
        return userData;
    } catch(e) {
        console.log(e);
        alert('Could not fetch user data');
        return null;
    }
}

export default getCurrentUser;