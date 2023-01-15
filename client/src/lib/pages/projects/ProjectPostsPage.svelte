<script lang="ts">
    import Post from "../../posts/Post.svelte";
    import { project } from "./projectStore";
</script>

<h1 class="mt-3">Posts</h1>
<div class="post-list w-100 mt- d-flex flex-column align-items-center gap-3">
    {#each $project.posts as post}
        <Post post={post} />
    {/each}
</div>