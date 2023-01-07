import { currentUserData, currentUserHasBeenRequested } from "../../store";
import type { UserData } from "../../../../interfaces/UserData";
import getCurrentUser from "../utilities/getCurrentUser";

const userIsLoggedInGuard = () => {    
    const xmlhttp = new XMLHttpRequest();
    
    let isLoggedIn: boolean = undefined;
    let userHasBeenRequested: boolean = false;

    xmlhttp.open('GET', '/auth/current-user', false);
    // xmlhttp.setRequestHeader('Accepts', 'application/json');
    xmlhttp.send();

    if (xmlhttp.status < 400) return true;
    else return false;
}

export default userIsLoggedInGuard;