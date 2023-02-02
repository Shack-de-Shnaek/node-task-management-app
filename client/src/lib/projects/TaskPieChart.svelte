<script lang="ts">
    import { Chart } from "chart.js/auto";
	import { project, taskPriorities, taskSeverities, taskStatuses } from '../pages/projects/projectStore';

    export let categorizeBy: 'category' | 'status' | 'priority' | 'severity';

    let element: HTMLCanvasElement;

    const createChart = () => {
        let labels: string[] = [];
        let colors: string[] = [];
        let datasetValues: number[] = [];

        const tasks = $project.tasks.filter(task => {
            if(categorizeBy === 'status') return true;

            return !['rejected', 'fixed'].includes(task.status.code)
        });

        switch(categorizeBy) {
            case 'category':
                for(const category of $project.taskCategories) {
                    labels.push(category.name);
                    colors.push(category.color);
                    datasetValues.push(tasks.filter(task => task.category.id === category.id).length);
                }
                break;
            case 'status':
                for(const status of $taskStatuses) {
                    labels.push(status.name);
                    colors.push(status.color);
                    datasetValues.push(tasks.filter(task => task.status.code === status.code).length);
                }
                break;
            case 'priority':
                for(const priority of $taskPriorities) {
                    labels.push(priority.name);
                    colors.push(priority.color);
                    datasetValues.push(tasks.filter(task => task.priority.code === priority.code).length);
                }
                break;
            case 'severity':
                for(const severity of $taskSeverities) {
                    labels.push(severity.name);
                    colors.push(severity.color);
                    datasetValues.push(tasks.filter(task => task.severity.code === severity.code).length);
                }
                break;
        }
        
        try {
            const chart = new Chart(element, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Tasks',
                            data: datasetValues
                        }
                    ]
                },
            });
        } catch (error) {
            
        }
    }

    $: if(
        $project.id !== 0
        && $taskStatuses.length > 0
        && $taskSeverities.length > 0
        && $taskPriorities.length > 0
        && categorizeBy !== undefined
        && element !== undefined
    ) {
        createChart();
    }
</script>

<div class="pie-chart-container w-100 m-0">
    <canvas id="{categorizeBy}-pie-chart" bind:this={element}></canvas>
</div>