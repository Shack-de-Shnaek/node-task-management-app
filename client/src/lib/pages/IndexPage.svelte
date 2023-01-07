<script lang="ts">
    import { currentUserData } from "../../store";
    import { headerData } from "../../store";

    $: if($currentUserData.id !== 0) {
        headerData.set({
            title: 'Home',
            widgets: [
                {
                    label: 'Test',
                    color: '#3485FE'
                },
                {
                    label: 'Projects',
                    color: '#A4F793',
                    value: $currentUserData.projects.length
                },
            ]
        });
    }
</script>

