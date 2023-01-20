import type { TaskPriorityData, TaskSeverityData, TaskSeverityPriorityStatus, TaskStatusData } from "../../../../interfaces/TaskData";
import handleResponse from "./handleResponse";

const getTaskSeveritiesPrioritiesStatuses = async () => {
    try {
        const res = await fetch('/api/tasks/severities-priorities-statuses');
        let data: TaskSeverityPriorityStatus;
        await handleResponse<TaskSeverityPriorityStatus>(res, (json) => {
            data = json;
        });
        return data
    } catch (e) {
        console.log(e);
        alert('Could not fetch necessary task data');
    }
}

export default getTaskSeveritiesPrioritiesStatuses;