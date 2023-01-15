import { project } from "../pages/projects/projectStore";
import { cachedProjects, currentUserData } from "../../store";
import type { LimitedProjectData, ProjectData } from "../../../../interfaces/ProjectData";

const updateAllProjectCache = (newProjectData: ProjectData) => {
    project.set(newProjectData);
    cachedProjects.update(data => {
        data[newProjectData.id] = newProjectData;
        return data;
    });
    currentUserData.update(data => {
        const limitedNewProjectData: LimitedProjectData = {
            id: newProjectData.id,
            name: newProjectData.name,
            description: newProjectData.description,
            thumbnailPath: newProjectData.thumbnailPath
        }

        for (const prop of ['projects', 'leaderOfProjects', 'adminOfProjects']) {
            const index = data[prop].findIndex(p => p.id === newProjectData.id);
            if (index !== -1) data[prop][index] = limitedNewProjectData;
        }

        return data;
    });
}

export default updateAllProjectCache;