<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';

	import Header from '$lib/components/Header.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import Rat from '$lib/components/Rat.svelte';
	import * as m from '$lib/paraglide/messages';
	import { shouldRedirect } from '$lib/paraglide/runtime';
	import '../app.css';

	let { children } = $props();

	const sections = $derived([
		{ route: '#about', title: m.nav_about() },
		{ route: '#experience', title: m.nav_experience() },
		{ route: '#projects', title: m.nav_projects() },
		{ route: '#contact', title: m.nav_contact() }
	]);

	let showIntro = $state(true);

	const INTRO_DURATION = 2000;
	// Set to `true` to always show the intro (useful while iterating on it)
	const PREVIEW_INTRO = false;

	async function syncLocaleUrl(url: string) {
		const decision = await shouldRedirect({ url });
		if (decision.shouldRedirect && decision.redirectUrl) {
			if (decision.redirectUrl.origin !== window.location.origin) {
				window.location.href = decision.redirectUrl.href;
				return;
			}
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			await goto(decision.redirectUrl, { invalidateAll: true });
		}
	}

	onMount(() => {
		void syncLocaleUrl(window.location.href);

		if (PREVIEW_INTRO) {
			sessionStorage.removeItem('introPlayed');
			return;
		}

		const introPlayed = sessionStorage.getItem('introPlayed');

		if (introPlayed) {
			showIntro = false;
		} else {
			setTimeout(() => {
				sessionStorage.setItem('introPlayed', 'true');
			}, INTRO_DURATION);
		}
	});

	afterNavigate((navigation) => {
		if (navigation.to) {
			void syncLocaleUrl(navigation.to.url.href);
		}
	});

	function handleIntroComplete() {
		showIntro = false;
		sessionStorage.setItem('introPlayed', 'true');
	}
</script>

{#if typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches}
	<Rat />
{/if}

{#if page.error}
	{@render children()}
{:else if showIntro}
	<Intro duration={INTRO_DURATION} onIntroComplete={handleIntroComplete} />
{:else}
	<div class="flex flex-col min-h-screen">
		<Header {sections} />

		{#key page.url.pathname}
			<main
				in:fade="{{ duration: 300, delay: 100 }}"
				class="flex flex-col p-1 w-[80%] sm:w-[50%] mb-auto mx-auto box-border"
			>
				{@render children()}
			</main>
		{/key}

		<footer class="flex flex-col items-center justify-center bg-transparent py-12 sm:py-3 border-t border-line text-fg w-[90%] mx-auto">
			<p
				class="font-bold text-sm sm:text-base"
				style="font-family: 'Neue Montreal'"
			>
				{m.footer_powered_by()}
			</p>
			<p 
				class="font-bold text-sm sm:text-base"
				style="font-family: 'Neue Montreal'"
			>
				{m.footer_copyright({ year: new Date().getFullYear() })}
			</p>
		</footer>
	</div>
{/if}

<style>
</style>
