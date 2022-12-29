import { currentUserData } from "../../store";
import type { UserData } from "../../../../interfaces/UserData";

const getCurrentUser = async () => {
    try {
        const res = await fetch('/auth/current-user');
        if(!res.ok) {
            console.log(res);
            alert('Could not fetch user data');
            return;
        }
        const userData: UserData = await res.json();
        currentUserData.set(userData);
    } catch(e) {
        console.log(e);
        alert('Could not fetch user data');
    }
}

export default getCurrentUser;