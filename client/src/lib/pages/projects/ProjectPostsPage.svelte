<script lang="ts">
	import { onMount } from "svelte";
	import NewPostInput from "../../posts/NewPostInput.svelte";
    import Post from "../../posts/Post.svelte";
    import { currentUserIsMember, project } from "./projectStore";
</script>

<div class="post-list w-100 mt-3 d-flex flex-column align-items-center gap-3">
    {#if $currentUserIsMember}
        <NewPostInput />
    {/if}
    {#key $project.posts.length}
	    {#if $project.posts.length > 0}
            {#each $project.posts as post}
            <Post {post} />
            {/each}
        {:else}
            <h5>No posts to show</h5>
        {/if}
    {/key}
</div>