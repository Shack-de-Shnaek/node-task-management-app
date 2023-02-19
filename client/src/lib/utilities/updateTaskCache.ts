import { cachedTasks, currentUserData } from "../../store";
import type { LimitedTaskData, TaskData } from "../../../../interfaces/TaskData";
import type { UserData } from "$interfaces/UserData";

const updateAllTaskstCache = (newTaskData: TaskData) => {
    let currentUser: UserData;
    currentUserData.subscribe(data => currentUser = data);
    cachedTasks.update(data => {
        data[newTaskData.id] = newTaskData;
        return data;
    });
    currentUserData.update(data => {
        const limitedNewTaskData: LimitedTaskData = {
            id: newTaskData.id,
            title: newTaskData.title,
            description: newTaskData.description,
        }

        const index = data.createdTasks.findIndex(t => t.id === newTaskData.id);
        if (index !== -1) data.createdTasks[index] = limitedNewTaskData;

        return data;
    });
}

export default updateAllTaskstCache;