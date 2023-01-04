import { currentUserData, currentUserHasBeenRequested } from "../../store";
import type { UserData } from "../../../../interfaces/UserData";
import getCurrentUser from "../utilities/getCurrentUser";

const userIsLoggedInGuard =() => {
    let userData: UserData;
    currentUserData.subscribe((val) => {
        userData = val;
    })();
    if (userData.id !== 0) return true;
    console.log('no user in store');
}

export default userIsLoggedInGuard;