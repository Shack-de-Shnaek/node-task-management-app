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
	    {#each $project.posts as post}
          <Post {post} />
        {/each}
    {/key}
</div>