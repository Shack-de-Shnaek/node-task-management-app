<script lang="ts">
	import { Navigate } from "svelte-router-spa";
	import type { PostData } from "../../../../interfaces/PostData";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import handleResponse from "../utilities/handleResponse";
	import parseDate from "../utilities/parseDate";
	import parseParagraphs from "../utilities/parseParagraphs";
	import updateAllProjectCache from "../utilities/updateProjectCache";

    export let post: PostData;
    export let componentClass = '';
    export let isInProjectPage = true;
    export let showComments = false;
    
    const images = post.attachments.filter(attachment => attachment.isImage);

    let newCommentContent = '';
    const postComment = async() => {
        await handleResponse<ProjectData>(
            `/api/projects/${post.project.id}/posts/${post.id}/comments`,
            {
                method: 'POST',
                body: { content: newCommentContent },
                errorMessage: 'Could not post comment'
            },
            (json) => {
                updateAllProjectCache(json);
                newCommentContent = '';
                // showComments = true;
            },
        );
    }
</script>

<div class="post-container bg-light {componentClass}">
    <header class="post-header w-100 p-3 pb-1 border-bottom border-2 border-dark">
        <div>
            <div class="d-flex align-items-center gap-1">
                <Navigate to={`/users/${post.author.id}`} styles="d-flex align-items-center gap-1">
                    <img src={post.author.thumbnailPath?post.author.thumbnailPath:'/icons/user.webp'} alt="" class="rounded-circle" style="height: 1.5rem; width: 1.5rem;">
                    <div>{post.author.firstName} {post.author.lastName}</div>
                </Navigate>
                <div class="small font-monospace">{parseDate(post.createdAt)}</div>
            </div>
            {#if !isInProjectPage}
                <Navigate to={`/projects/${post.project.id}`} styles="d-flex align-items-center gap-1">
                    <img src={post.project.thumbnailPath?post.project.thumbnailPath:'/icons/project.webp'} alt="" class="rounded-circle" style="height: 1.5rem; width: 1.5rem;">
                    <span>{post.project.name}</span>
                </Navigate>
            {/if}
        </div>
        <h3 class="mb-0 mt-1">{post.title}</h3>
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
    {#if isInProjectPage}
        {#if post.attachments.filter(attachment => !attachment.isImage).length > 0}
            <div class="attachments p-2 d-flex flex-column gap-1">
                <h5 class="m-0">Attachments</h5>
                {#each post.attachments as attachment}
                    <a href={attachment.path} target="_blank" rel="noreferrer" class="attachment text-primary">{attachment.path.split('/')[3]}</a>
                {/each}
            </div>
        {/if}
        <div class="comment-container p-2 border-top border-2 border-dark">
            {#if !showComments}
                <button class="show-comments-button w-100 text-center mb-1 border-0"
                on:click={() => {showComments = true}}>Comments: {post.comments.length}</button>
            {:else}
                <form class="d-flex gap-1"
                on:submit|preventDefault={() => { postComment() }}>
                    <textarea cols="3" name="content" placeholder="New Comment" class="w-100 form-control"
                    bind:value={newCommentContent}></textarea>
                    <button type="submit" class="btn btn-success p-1"><small>Post</small></button>
                </form>
                <div class="mt-2 d-flex flex-column gap-1">
                    {#each post.comments as comment}
                        <div class="comment p-1">
                            <div class="d-flex align-items-center gap-1">
                                {#if comment.author.thumbnailPath}
                                    <img src={comment.author.thumbnailPath} alt="" style="height: 1rem;" class="rounded-circle">
                                {/if}
                                <span>{comment.author.firstName} {comment.author.lastName}</span>
                                <div class="ms-auto small">{parseDate(comment.createdAt)}</div>
                            </div>
                            <div class="comment-content d-flex flex-column align-items-start rounded-3 p-1">
                                {#each parseParagraphs(comment.content) as paragraph}
                                    <p class="m-0">{paragraph}</p>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
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

    .show-comments-button {
        outline: none;
        background: inherit;
    }

    .comment-content {
        background: var(--light-gray)
    }

    button[type=submit] {
        height: fit-content;
    }
</style>