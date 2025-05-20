<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import Header from '$lib/components/Header.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import Rat from '$lib/components/Rat.svelte';
	import '../app.css';

	let { children } = $props();
	let activeSection = $state(0);
	export const sections = [
		{ 
			route: '#about', 
			title: 'About', 
			content: 'Welcome to my portfolio',
		},
		{ 
			route: '#experience', 
			title: 'Experience', 
			content: 'My skills, experience, and journey',
		},
		{ 
			route: '#projects', 
			title: 'Projects', 
			content: 'Featured work and achievements',
		},
		{ 
			route: '#contact', 
			title: 'Contact', 
			content: 'My skills, experience, and journey',
		}

	];

	let showIntro = $state(true);
	const INTRO_DURATION = 3000;

	onMount(() => {
		const introPlayed = sessionStorage.getItem('introPlayed');

		if (introPlayed) {
			showIntro = false;
		} else {
			setTimeout(() => {
				sessionStorage.setItem('introPlayed', 'true');
			}, INTRO_DURATION);
		}
	});

	function handleIntroComplete() {
		showIntro = false;
		sessionStorage.setItem('introPlayed', 'true');
	}

	// function handleWheel(event: WheelEvent) {
	// 	// Prevent default scrolling
	// 	event.preventDefault();

	// 	// Determine scroll direction
	// 	const direction = event.deltaY > 0 ? 1 : -1;
		
	// 	// Calculate new active section
	// 	let newActiveSection = activeSection + direction;
		
	// 	// Ensure we stay within section bounds
	// 	newActiveSection = Math.max(0, Math.min(newActiveSection, sections.length - 1));
		
	// 	if (newActiveSection !== activeSection) {
	// 		activeSection = newActiveSection;
			
	// 		// Navigate to new route
	// 		goto(
	// 			sections[activeSection].route, 
	// 			{ replaceState: true }
	// 		);
	// 	}
	// }

	// function handleTouchStart(event: TouchEvent) {
	// 	const touchStartY = event.touches[0].clientY;

	// 	function handleTouchMove(event: TouchEvent) {
	// 		const touchEndY = event.touches[0].clientY;
	// 		const direction = touchStartY > touchEndY ? 1 : -1;

	// 		let newActiveSection = activeSection + direction;
	// 		newActiveSection = Math.max(0, Math.min(newActiveSection, sections.length - 1));

	// 		if (newActiveSection !== activeSection) {
	// 			activeSection = newActiveSection;
	// 			goto(
	// 				sections[activeSection].route,
	// 				{ replaceState: true }
	// 			);
	// 		}

	// 		window.removeEventListener('touchmove', handleTouchMove);
	// 	}

	// 	window.addEventListener('touchmove', handleTouchMove, { passive: false });
	// }

	// $effect(() => {
	// 	window.addEventListener('wheel', handleWheel, { passive: false });
	// 	window.addEventListener('touchstart', handleTouchStart, { passive: false });
	// 	return () => {
	// 		window.removeEventListener('wheel', handleWheel);
	// 		window.removeEventListener('touchstart', handleTouchStart);
	// 	};
	// });
</script>

{#if typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches}
	<Rat />
{/if}

{#if showIntro}
	<Intro duration={INTRO_DURATION} on:introComplete={handleIntroComplete} />
{:else}
	<div class="flex flex-col min-h-screen">
		<Header {sections} />

		{#key $page.url.pathname}
			<main
				in:fade="{{ duration: 300, delay: 100 }}"
				class="flex flex-col p-1 w-[80%] sm:w-[50%] mb-auto mx-auto box-border"
			>
				{@render children()}
			</main>
		{/key}

		<footer class="flex flex-col items-center justify-center bg-transparent py-12 sm:py-3 border-t border-white w-[90%] mx-auto">
			<p
				class="font-bold text-sm sm:text-base"
				style="font-family: 'Neue Montreal'"
			>
				Powered by Sveltekit, Threlte, MeltUI, and Sanity.
			</p>
			<p 
				class="font-bold text-sm sm:text-base"
				style="font-family: 'Neue Montreal'"
			>
				@{new Date().getFullYear()} Daniel Tay. All Rights Reserved.
			</p>
		</footer>
	</div>
{/if}

<style>
</style>
