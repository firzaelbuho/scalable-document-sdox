<script lang="ts">
	import { page } from '$app/state';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	const navLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Documentation', href: '/docs' },
		{ label: 'Live Preview', href: '/live-preview' },
		{ label: 'Extensions', href: '/extensions' }
	];

	const githubUrl = 'https://github.com/firzaelbuho/scalable-document-sdox';

	$effect(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<nav class="navbar" class:scrolled>
	<div class="navbar-inner container">
		<a href="/" class="logo" onclick={closeMobile}>
			<img src="/favicon.svg" alt="SDOX Logo" class="logo-icon" width="28" height="28" />
			<span class="logo-text">SDOX</span>
			<span class="logo-version">v0.1</span>
		</a>

		<div class="nav-links" class:open={mobileOpen}>
			{#each navLinks as link}
				<a
					href={link.href}
					class="nav-link"
					class:active={page.url.pathname === link.href || (link.href !== '/' && page.url.pathname.startsWith(link.href))}
					onclick={closeMobile}
				>
					{link.label}
				</a>
			{/each}
			<a href={githubUrl} target="_blank" rel="noopener noreferrer" class="nav-link github-link">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
				</svg>
				GitHub
			</a>
		</div>

		<button
			class="mobile-toggle"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Toggle navigation"
		>
			<span class="hamburger" class:open={mobileOpen}>
				<span></span>
				<span></span>
				<span></span>
			</span>
		</button>
	</div>
</nav>

{#if mobileOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="mobile-overlay" onclick={closeMobile} onkeydown={closeMobile}></div>
{/if}

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		height: var(--navbar-height);
		display: flex;
		align-items: center;
		transition: all var(--transition-base);
		border-bottom: 1px solid transparent;
	}

	.navbar.scrolled {
		background: rgba(10, 14, 23, 0.85);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom-color: var(--color-border);
	}

	.navbar-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		text-decoration: none;
		color: var(--color-text-primary);
	}

	.logo-icon {
		width: 28px;
		height: 28px;
		filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.4));
	}

	.logo-text {
		font-size: var(--text-xl);
		font-weight: 800;
		letter-spacing: var(--tracking-tight);
	}

	.logo-version {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		font-weight: 500;
		margin-left: var(--space-1);
		padding: 2px 6px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text-secondary);
		text-decoration: none;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.nav-link:hover {
		color: var(--color-text-primary);
		background: rgba(56, 189, 248, 0.06);
	}

	.nav-link.active {
		color: var(--color-accent-primary);
		background: var(--color-accent-glow);
	}

	.github-link {
		margin-left: var(--space-2);
	}

	.mobile-toggle {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--space-2);
	}

	.hamburger {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 22px;
	}

	.hamburger span {
		display: block;
		height: 2px;
		background: var(--color-text-secondary);
		border-radius: 2px;
		transition: all var(--transition-base);
	}

	.hamburger.open span:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.hamburger.open span:nth-child(2) {
		opacity: 0;
	}

	.hamburger.open span:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	.mobile-overlay {
		display: none;
	}

	@media (max-width: 768px) {
		.mobile-toggle {
			display: block;
		}

		.nav-links {
			position: fixed;
			top: var(--navbar-height);
			right: 0;
			bottom: 0;
			width: 280px;
			flex-direction: column;
			align-items: stretch;
			padding: var(--space-4);
			background: var(--color-bg-secondary);
			border-left: 1px solid var(--color-border);
			transform: translateX(100%);
			transition: transform var(--transition-base);
			z-index: 999;
		}

		.nav-links.open {
			transform: translateX(0);
		}

		.mobile-overlay {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 998;
		}
	}
</style>
