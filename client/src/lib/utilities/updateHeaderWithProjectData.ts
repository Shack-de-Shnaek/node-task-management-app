import type { ProjectData } from "$interfaces/ProjectData";
import { headerData } from "../../store";
import { project } from "../pages/projects/projectStore";

const updateHeaderWithProjectData = () => {
    let projectData: ProjectData;
    project.subscribe(data => projectData = data);
    
    headerData.set({
        title: projectData.name,
        widgets: [
            {
                label: 'Dashboard',
                href: `/projects/${projectData.id}`,
                color: '#3485FE'
            },    
            {
                label: 'Posts',
                value: projectData.posts.length,
                href: `/projects/${projectData.id}/posts`,
                color: '#20c997'
            },
            {
                label: 'Tasks',
                value: projectData.tasks.length,
                href: `/projects/${projectData.id}/tasks`,
                color: '#fd7e14'
            },
            {
                label: 'About',
                href: `/projects/${projectData.id}/about`,
                color: '#0dcaf0'
            },
        ]
    });
}

export default updateHeaderWithProjectData;