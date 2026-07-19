<script lang="ts">
	export let sections: { route: string; title: string; }[];
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import * as m from '$lib/paraglide/messages';
	import { theme } from '$lib/theme/theme.svelte';

	let currentHash = '';

	const updateHash = () => {
		currentHash = window.location.hash || '#section1';
	};

	// Mobile hamburger — melt-ui dropdown menu handles a11y (focus, arrow keys,
	// Esc, click-outside) and positioning (via Floating UI).
	const {
		elements: { trigger, menu, item },
		states: { open }
	} = createDropdownMenu({
		positioning: { placement: 'bottom-end', gutter: 8 },
		loop: true
	});

	function goToSection(e: MouseEvent | KeyboardEvent, route: string) {
		e.preventDefault();
		const targetId = route.substring(1);
		const targetElement = document.getElementById(targetId);
		if (targetElement) {
			targetElement.scrollIntoView({ behavior: 'smooth' });
		}
		open.set(false);
	}

	onMount(() => {
		updateHash();
		window.addEventListener('hashchange', updateHash);

		return () => {
			window.removeEventListener('hashchange', updateHash);
		};
	});
</script>

<header class="flex justify-between backdrop-blur sticky top-0 z-50 pt-3 border-b border-line w-[90%] mx-auto">
	<div class="flex">
		<a href={resolve('/')} class="flex items-center justify-center mr-3">
			<span class="font-bold text-fg tracking-tighter" style="font-family: 'Migra'">
				{m.header_name()}
			</span>
		</a>
		<span class="hidden sm:flex items-center justify-center font-bold text-fg tracking-tight" style="font-family: 'Neue Montreal'">
			{m.header_tagline()}
		</span>
	</div>

	<div class="flex items-center">
		<!-- Desktop nav (>= md) -->
		<nav class="hidden md:flex justify-end bg-transparent">
			<ul class="flex items-center justify-center list-none relative bg-transparent p-0 m-0 h-12">
				{#each sections as section (section.route)}
					<li class="relative h-full">
						<a
							href="{resolve('/')}{section.route}"
							aria-current={currentHash === section.route ? 'page' : undefined}
							class="flex h-full items-center py-0 px-2 text-fg text-sm font-bold tracking-wider lowercase transition-colors duration-200 ease-linear hover:text-accent"
							style="font-family: 'Neue Montreal'"
							onclick={(e) => goToSection(e, section.route)}
						>
							{section.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Mobile hamburger (< md) -->
		<button
			use:melt={$trigger}
			type="button"
			aria-label="Open navigation menu"
			class="md:hidden text-fg text-xl leading-none px-2 py-1 rounded hover:text-accent transition-colors duration-200"
		>
			{$open ? '✕' : '☰'}
		</button>

		<!-- Theme toggle — always visible, sits at the end -->
		<button
			type="button"
			onclick={() => theme.toggle()}
			aria-label="Toggle theme"
			title={theme.current === 'coffee' ? 'Switch to matcha' : 'Switch to coffee'}
			class="text-lg leading-none px-2 py-1 ml-1 rounded hover:text-accent transition-colors duration-200"
		>
			{theme.current === 'coffee' ? '🍵' : '☕'}
		</button>
	</div>
</header>

<!-- Mobile menu content (portaled to body by melt-ui) -->
<div
	use:melt={$menu}
	class="md:hidden z-50 min-w-[10rem] rounded-md border border-line bg-surface p-2 shadow-lg focus:outline-none"
>
	{#each sections as section (section.route)}
		<a
			use:melt={$item}
			href="{resolve('/')}{section.route}"
			aria-current={currentHash === section.route ? 'page' : undefined}
			class="block px-3 py-2 rounded text-fg text-sm font-bold tracking-wider lowercase hover:bg-surface-alt hover:text-accent focus:bg-surface-alt focus:text-accent outline-none"
			style="font-family: 'Neue Montreal'"
			onclick={(e) => goToSection(e, section.route)}
		>
			{section.title}
		</a>
	{/each}
</div>

<style>
</style>
