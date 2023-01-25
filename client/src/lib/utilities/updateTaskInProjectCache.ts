import type { TaskData } from "../../../../interfaces/TaskData";
import { project } from "../pages/projects/projectStore";

const updateTaskInProjectCache = (newTaskData: TaskData) => {
    project.update(data => {
        data.tasks[data.tasks.findIndex(task => task.id === newTaskData.id)] = newTaskData;
        return data;
    });
}

export default updateTaskInProjectCache;