<script lang="ts">

</script>

<h1>index</h1>
<h1>fdsadafsdsf</h1>

<button on:click={async() => {
    try {
        const res = await fetch('/auth/logout', { method: 'POST', redirect: 'follow' });
        window.location.href = res.url;
    } catch(e) {
        console.log(e);
    }
}}>
    log out
</button>