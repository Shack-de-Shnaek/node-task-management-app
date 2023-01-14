import { currentUserData } from "../../store"
import { project } from "../pages/projects/projectStore"

const userIsProjectMember = () => {
    let currentUserId = 0;
    let projectMembers = [];
    currentUserData.subscribe(data => {
        currentUserId = data.id;
    });
    project.subscribe(data => {
        projectMembers = data.members;
    });
    if (projectMembers.flatMap(member => member.id).includes(currentUserId)) return true;
    return false;
}

export default userIsProjectMember;