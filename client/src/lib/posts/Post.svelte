<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
	import type { PostData } from "../../../../interfaces/PostData";
	import parseParagraphs from "../utilities/parseParagraphs";

    export let post: PostData;
    export let showProjectName = false
</script>

<div class="post-container border border-1 border-dark">
    <header class="post-header w-100 p-1 bg-light">
        <div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="d-flex align-items-center gap-1"
            on:click={() => navigateTo(`/users/${post.author.id}`)}>
                {#if post.author.thumbnailPath}
                    <img src={post.author.thumbnailPath} alt="" class="rounded-circle" style="height: 1rem;">
                {/if}
                <span>{post.author.firstName} {post.author.lastName}</span>
            </span>
            {#if showProjectName}
                <span>{post.project.name}</span>
            {/if}
        </div>
        <h3>{post.title}</h3>
    </header>
    <div class="px-2 py-1">
        {#each parseParagraphs(post.content) as paragraph}
            <p>{paragraph}</p>
        {/each}
    </div>
</div>

<style>
    .post-container {
        width: 32rem;
        max-width: 95vw;
        box-shadow: var(--container-shadow);
    }
</style>