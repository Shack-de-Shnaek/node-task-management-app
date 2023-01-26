<script lang="ts">
	import type { PostData } from "../../../../interfaces/PostData";
    import { currentUserData, headerData } from "../../store";
	import { writable, type Writable } from "svelte/store";
	import Post from "../posts/Post.svelte";
	import handleResponse from "../utilities/handleResponse";
	import { onMount } from "svelte";

    const getPosts = async () => {
        try {
            const res = await fetch('/api/users/posts');
            handleResponse<PostData[]>(res, (json) => {
                posts.set(json);
            });
        } catch (e) {
            console.log(e);
            alert('Could not fetch posts');
        }
    }
    const posts: Writable<PostData[]> = writable([]);

    onMount(async() => getPosts());
</script>

<div class="post-list w-100 mt-3 d-flex flex-column align-items-center gap-3">
    {#each $posts as post}
        <Post {post} isInProjectPage={false} showComments={false} />
    {/each}
</div>