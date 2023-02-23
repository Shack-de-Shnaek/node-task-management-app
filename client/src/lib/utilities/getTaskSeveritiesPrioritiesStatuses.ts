import type { TaskPriorityData, TaskSeverityData, TaskSeverityPriorityStatus, TaskStatusData } from "../../../../interfaces/TaskData";
import handleResponse from "./handleResponse";

const getTaskSeveritiesPrioritiesStatuses = async () => {
    let data: TaskSeverityPriorityStatus;
    await handleResponse<TaskSeverityPriorityStatus>(
        '/api/tasks/severities-priorities-statuses',
        { errorMessage: 'Could not fetch necessary task data' },
        (json) => data = json,
    );
    return data;
}

export default getTaskSeveritiesPrioritiesStatuses;