<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
	import type { PostData } from "../../../../interfaces/PostData";
	import parseParagraphs from "../utilities/parseParagraphs";

    export let post: PostData;
    export let showProjectName = false

    const images = post.attachments.filter(attachment => attachment.isImage);
</script>

<div class="post-container bg-light">
    <header class="post-header w-100 p-3">
        <div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="d-flex align-items-center gap-1"
            on:click={() => navigateTo(`/users/${post.author.id}`)}>
                {#if post.author.thumbnailPath}
                    <img src={post.author.thumbnailPath} alt="" class="rounded-circle" style="height: 2rem;">
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
    {#if images.length > 0}
        <div class="carousel slide" id="post-{post.id}-carousel" data-bs-ride="carousel" data-bs-interval="0">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src={images[0].path} alt="" class="w-100">
                </div>
                {#each images.slice(1) as image}
                    <div class="carousel-item">
                        <img src={image.path} alt="" class="w-100">
                    </div>
                {/each}
            </div>
            {#if images.length > 1}
                <button class="carousel-control-prev" type="button" data-bs-target="#post-{post.id}-carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#post-{post.id}-carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            {/if}
        </div>
    {/if}
</div>

<style>    
    .post-container {
        width: 32rem;
        max-width: 95vw;
        box-shadow: var(--container-shadow);
    }
</style>