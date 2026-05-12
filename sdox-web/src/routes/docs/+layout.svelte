<script lang="ts">
	let { children } = $props();
</script>

<div class="docs-layout">
	{@render children()}
</div>

<style>
	.docs-layout {
		min-height: calc(100vh - var(--navbar-height));
	}
</style>
