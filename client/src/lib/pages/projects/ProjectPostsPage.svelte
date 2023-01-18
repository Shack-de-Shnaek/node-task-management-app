<script lang="ts">
	import NewPostInput from "../../posts/NewPostInput.svelte";
    import { getContext } from "svelte";
	import type { Writable } from "svelte/types/runtime/store";
    import Post from "../../posts/Post.svelte";
    import { project } from "./projectStore";

    const currentUserIsMember: Writable<boolean> = getContext('currentUserIsMember');
</script>

<h1 class="mt-3">Posts</h1>
<div class="post-list w-100 mt- d-flex flex-column align-items-center gap-3">
    {#if $currentUserIsMember}
        <NewPostInput />
    {/if}
    {#key $project.posts}
        {#each $project.posts as post}
            <Post post={post} />
        {/each}
    {/key}
</div>