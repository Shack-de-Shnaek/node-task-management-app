<script lang="ts">
	import { onMount } from "svelte";
    import { currentUserData } from "../../store";
    import { headerData } from "../../store";

    onMount(() => {
        headerData.set({
            title: 'Home',
            widgets: []
        });
    });
</script>

<h2>oooo index</h2>