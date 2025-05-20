<script lang="ts">
	export let sections;
	import { onMount } from 'svelte';

	let currentHash = '';

	const updateHash = () => {
		currentHash = window.location.hash || '#section1';
	};

	onMount(() => {
		updateHash();
		window.addEventListener('hashchange', updateHash);

		return () => {
			window.removeEventListener('hashchange', updateHash);
		};
	});
</script>

<header class="flex justify-between backdrop-blur sticky top-0 z-50 pt-3 border-b border-white w-[90%] mx-auto">
	<div class="flex">
		<a href="/" class="flex items-center justify-center mr-3">
			<span class="font-bold text-white tracking-tighter" style="font-family: 'Migra'">
				Daniel Tay
			</span>
		</a>
		<span class="hidden sm:flex items-center justify-center font-bold text-white tracking-tight" style="font-family: 'Neue Montreal'">
			DevSecOps Enthusiast
		</span>
	</div>

	<div class="flex w-auto">
		<nav class="flex justify-end bg-transparent">
			<ul class="flex items-center justify-center list-none relative bg-transparent p-0 m-0 h-12">
				{#each sections as section}
					<li class="relative h-full">
						<a 
							href={section.route}
							aria-current={currentHash === section.route ? 'page' : undefined}
							class="flex h-full items-center py-0 px-2 text-white text-sm font-bold tracking-wider lowercase transition-colors duration-200 ease-linear hover:text-[var(--color-theme-3)]"
							style="font-family: 'Neue Montreal'"
							onclick={(e) => {
								e.preventDefault();
								const targetId = section.route.substring(1);
								const targetElement = document.getElementById(targetId);
								if (targetElement) {
									targetElement.scrollIntoView({ behavior: 'smooth' });
								}
							}}
						>
							{section.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
</style>
