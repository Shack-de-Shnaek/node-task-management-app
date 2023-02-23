<script lang="ts">
	import type { PostData } from "../../../../interfaces/PostData";
    import { headerData } from "../../store";
	import { writable, type Writable } from "svelte/store";
	import Post from "../posts/Post.svelte";
	import handleResponse from "../utilities/handleResponse";
	import { onMount } from "svelte";

    const getPosts = async () => {
        await handleResponse<PostData[]>(
            '/api/users/posts',
            {},
            (json) => {
                posts.set(json);
            }
        );
    }
    const posts: Writable<PostData[]> = writable([]);

    onMount(async() => {
        headerData.set({
            title: 'Posts',
            widgets: [],
        });
        await getPosts();
    });
</script>

<div class="post-list w-100 mt-3 d-flex flex-column align-items-center gap-3">
    {#each $posts as post}
        <Post {post} isInProjectPage={false} showComments={false} />
    {/each}
</div>