import { cachedTasks, currentUserData } from "../../store";
import type { TaskData } from "../../../../interfaces/TaskData";
import type { UserData } from "$interfaces/UserData";

const updateAllTaskstCache = (newTaskData: TaskData) => {
    let currentUser: UserData;
    currentUserData.subscribe(data => currentUser = data);
    cachedTasks.update(data => {
        data[newTaskData.id] = newTaskData;
        return data;
    });
    currentUserData.update(data => {
        const createdTaskIndex = data.createdTasks.findIndex(t => t.id === newTaskData.id);
        if (createdTaskIndex !== -1) data.createdTasks[createdTaskIndex] = newTaskData;

        const assignedTaskIndex = data.assignedTasks.findIndex(t => t.id === newTaskData.id);
        if (assignedTaskIndex !== -1) data.createdTasks[assignedTaskIndex] = newTaskData;

        return data;
    });
}

export default updateAllTaskstCache;