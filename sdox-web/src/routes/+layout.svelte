<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>SDOX — Scalable Document</title>
</svelte:head>

<Navbar />

<main class="main-content">
	{@render children()}
</main>

<Footer />

<style>
	.main-content {
		padding-top: var(--navbar-height);
		min-height: 100vh;
	}
</style>
