<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
	import type { PostData } from "../../../../interfaces/PostData";
	import parseParagraphs from "../utilities/parseParagraphs";

    export let post: PostData;
    export let showProjectName = false;
    export let componentClass = '';
    export let limited = false;

    const images = post.attachments.filter(attachment => attachment.isImage);
</script>

<div class="post-container bg-light {componentClass}">
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
                {#if post.project.thumbnailPath}
                    <img src={post.project.thumbnailPath} alt="" class="rounded-circle" style="height: 2rem;">
                {/if}
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
        <div class="carousel slide" id="post-{post.id}-carousel" data-bs-ride="carousel" data-bs-interval="false">
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
    {#if post.attachments.length > 0}
        <div class="attachments p-2 d-flex flex-column gap-1">
            <h5 class="m-0">Attachments</h5>
            {#each post.attachments as attachment}
                <a href={attachment.path} class="attachment text-primary">{attachment.path.split('/')[3]}</a>
            {/each}
        </div>
    {/if}
</div>

<style>    
    .post-container {
        width: 36rem;
        max-width: 100%;
        box-shadow: var(--container-shadow);
    }

    .attachments {
        font-size: 0.75rem;
    }
</style>