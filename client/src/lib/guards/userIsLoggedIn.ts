import { currentUserData } from "../../store";
import type { UserData } from "../../../../interfaces/UserData";
import getCurrentUser from "../utilities/getCurrentUser";

const userIsLoggedInGuard = async() => {
    let userData: UserData;
    const unsubscribe = currentUserData.subscribe((val) => {
        userData = val;
    });
    unsubscribe();
    if (userData.id !== 0) return true;

    userData = await getCurrentUser();
    return (userData !== null);
}

export default userIsLoggedInGuard;