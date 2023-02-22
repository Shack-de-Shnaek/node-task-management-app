import type { TaskData } from "../../../../interfaces/TaskData";
import parseDate from "./parseDate";

const taskTitleText = (task: TaskData) => {
    let textItems = [`Title: ${task.title}`, `Project: ${task.project.name}`];
    if(task.dueAt) textItems.push(`Due: ${parseDate(task.dueAt)}`);
    textItems.push(`Created: ${parseDate(task.createdAt)}`);
    textItems = textItems.concat([`Severity: ${task.severity.name}`], [`Priority: ${task.priority.name}`], [`Category: ${task.category.name}`]);
    return textItems.join('; \n');
}

export default taskTitleText;