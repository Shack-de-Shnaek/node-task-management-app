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
        
        let chart: Chart
        try {
            chart = new Chart(element, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Tasks',
                            data: datasetValues,
                            backgroundColor: colors,
                        }
                    ],
                },
                options: {
                    responsive: true,
                    animation: {
                        animateRotate: false,
                    },
                    maintainAspectRatio: true,
                    aspectRatio: 3/2,
                    plugins: {
                        legend: {
                            position: 'right',
                            align: 'start'
                        },
                    }
                }
            });
            return chart;
        } catch (error) {}
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

<div class="pie-chart-container position-relative m-0">
    <canvas id="{categorizeBy}-pie-chart" bind:this={element}></canvas>
</div>

<style>
    div {
        min-width: min-content;
        min-height: min-content;
        max-height: 16rem;
        width: 80%;
    }

    canvas {
        min-width: 10rem;
        max-width: 100%;
        min-height: 10rem;
        max-height: 100%;
    }
</style>