<script lang="ts">
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';

	type Props = {
		duration?: number;
		onIntroComplete?: () => void;
	};

	const { duration = 3000, onIntroComplete }: Props = $props();

	let progress = $state(0);
	let leaving = $state(false);
	let reducedMotion = $state(false);

	const name = $derived(m.header_name());

	onMount(() => {
		reducedMotion =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// Lock scroll while intro is up
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const start = performance.now();
		let raf = 0;
		const tick = (now: number) => {
			progress = Math.min(1, (now - start) / duration);
			if (progress < 1) raf = requestAnimationFrame(tick);
			else finish();
		};
		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			document.body.style.overflow = prevOverflow;
		};
	});

	function finish() {
		if (leaving) return;
		leaving = true;
		// Wait for curtain-wipe animation before notifying parent
		setTimeout(() => onIntroComplete?.(), reducedMotion ? 200 : 700);
	}

	function skip() {
		progress = 1;
		finish();
	}
</script>

<div
	class="intro"
	class:leaving
	class:reduced={reducedMotion}
	role="status"
	aria-live="polite"
	aria-label={m.intro_aria_loading()}
>
	<!-- Aurora gradient blobs -->
	<div class="aurora" aria-hidden="true">
		<span class="blob b1"></span>
		<span class="blob b2"></span>
		<span class="blob b3"></span>
		<span class="blob b4"></span>
	</div>

	<!-- Grain overlay via SVG turbulence -->
	<svg class="grain" aria-hidden="true">
		<filter id="noise">
			<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
			<feColorMatrix type="saturate" values="0" />
		</filter>
		<rect width="100%" height="100%" filter="url(#noise)" opacity="0.35" />
	</svg>

	<!-- Skip button -->
	<button class="skip" type="button" onclick={skip} aria-label={m.intro_aria_skip()}>
		{m.intro_skip()}
		<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M5 5l7 7-7 7M13 5l7 7-7 7" />
		</svg>
	</button>

	<div class="stage">
		<!-- Animated SVG Coffee Cup -->
		<svg class="mug" viewBox="0 0 200 200" width="140" height="140" aria-hidden="true">
			<defs>
				<linearGradient id="coffeeGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#8b5a2b" />
					<stop offset="60%" stop-color="#4a2f1a" />
					<stop offset="100%" stop-color="#2a170d" />
				</linearGradient>
				<linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="#f4f1ea" />
					<stop offset="50%" stop-color="#ffffff" />
					<stop offset="100%" stop-color="#d9d3c4" />
				</linearGradient>
				<clipPath id="mugClip">
					<path d="M55 80 Q55 155 100 155 Q145 155 145 80 Z" />
				</clipPath>
			</defs>

			<!-- Steam curls -->
			<g class="steam" stroke="#e0d7c5" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.7">
				<path class="s s1" d="M85 60 Q80 45 90 32 Q100 20 92 5" />
				<path class="s s2" d="M100 62 Q95 48 105 34 Q115 22 107 8" />
				<path class="s s3" d="M115 60 Q110 46 120 32 Q130 20 122 4" />
			</g>

			<!-- Handle -->
			<path
				class="stroke handle"
				d="M145 100 Q175 100 175 120 Q175 140 145 140"
				stroke="url(#rimGrad)"
				stroke-width="6"
				fill="none"
				stroke-linecap="round"
			/>

			<!-- Cup outline -->
			<path
				class="stroke cup"
				d="M55 80 L55 80 Q55 155 100 155 Q145 155 145 80 L145 80"
				stroke="url(#rimGrad)"
				stroke-width="5"
				fill="none"
				stroke-linejoin="round"
			/>
			<!-- Cup rim ellipse -->
			<ellipse
				class="stroke rim"
				cx="100"
				cy="80"
				rx="45"
				ry="10"
				stroke="url(#rimGrad)"
				stroke-width="5"
				fill="rgba(20,10,5,0.6)"
			/>

			<!-- Coffee fill (clipped to cup) -->
			<g clip-path="url(#mugClip)">
				<rect class="coffee" x="55" y="200" width="90" height="120" fill="url(#coffeeGrad)" />
				<!-- Meniscus highlight -->
				<ellipse class="meniscus" cx="100" cy="200" rx="45" ry="6" fill="#c9976a" opacity="0.55" />
			</g>

			<!-- Saucer -->
			<ellipse
				class="stroke saucer"
				cx="100"
				cy="170"
				rx="65"
				ry="8"
				stroke="url(#rimGrad)"
				stroke-width="3"
				fill="none"
			/>
		</svg>

		<!-- Name reveal -->
		<h1 class="name" aria-label={name}>
			{#each name.split('') as ch, i (i)}
				<span
					class="char"
					class:space={ch === ' '}
					style="--i:{i}"
					aria-hidden="true"
				>{ch === ' ' ? '\u00A0' : ch}</span>
			{/each}
		</h1>

		<p class="tagline">{m.intro_tagline()}<span class="dots"><span>.</span><span>.</span><span>.</span></span></p>

		<!-- Brew progress bar -->
		<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress * 100)}>
			<div class="fill" style="transform: scaleX({progress});"></div>
		</div>
	</div>

	<!-- Curtain wipe layers -->
	<div class="curtain top" aria-hidden="true"></div>
	<div class="curtain bottom" aria-hidden="true"></div>
</div>

<style>
	.intro {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: grid;
		place-items: center;
		overflow: hidden;
		background: radial-gradient(ellipse at center, #14100c 0%, #0a0806 70%, #050403 100%);
		color: #f4f1ea;
		font-family: 'Neue Montreal', system-ui, sans-serif;
		isolation: isolate;
	}

	/* ---------------- Aurora background ---------------- */
	.aurora {
		position: absolute;
		inset: -20%;
		filter: blur(90px);
		opacity: 0.75;
		pointer-events: none;
	}
	.blob {
		position: absolute;
		width: 40vmax;
		height: 40vmax;
		border-radius: 50%;
		mix-blend-mode: screen;
		animation: drift 14s ease-in-out infinite alternate;
	}
	.b1 { top: -10%; left: -10%; background: radial-gradient(circle, #67e8f9, transparent 60%); }
	.b2 { top: 10%; right: -15%; background: radial-gradient(circle, #d97706, transparent 60%); animation-delay: -3s; }
	.b3 { bottom: -20%; left: 15%; background: radial-gradient(circle, #8b5cf6, transparent 60%); animation-delay: -7s; }
	.b4 { bottom: -10%; right: 5%; background: radial-gradient(circle, #f59e0b, transparent 60%); animation-delay: -10s; }

	@keyframes drift {
		0%   { transform: translate(0,0) scale(1); }
		50%  { transform: translate(6vmax, -4vmax) scale(1.15); }
		100% { transform: translate(-4vmax, 6vmax) scale(0.95); }
	}

	/* ---------------- Grain ---------------- */
	.grain {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0.08;
		mix-blend-mode: overlay;
		pointer-events: none;
	}

	/* ---------------- Stage / content ---------------- */
	.stage {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2rem;
		text-align: center;
	}

	/* ---------------- SVG mug ---------------- */
	.mug { overflow: visible; }
	.stroke {
		stroke-dasharray: 400;
		stroke-dashoffset: 400;
		animation: draw 900ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
	}
	.handle { animation-delay: 300ms; }
	.rim    { animation-delay: 600ms; }
	.saucer { animation-delay: 800ms; }
	@keyframes draw {
		to { stroke-dashoffset: 0; }
	}

	.coffee {
		transform: translateY(120px);
		animation: pour 1200ms cubic-bezier(0.22, 1, 0.36, 1) 900ms forwards;
	}
	.meniscus {
		opacity: 0;
		animation: fadeIn 400ms ease 1900ms forwards;
	}
	@keyframes pour {
		to { transform: translateY(105px); }
	}
	@keyframes fadeIn {
		to { opacity: 0.55; }
	}

	.steam .s {
		stroke-dasharray: 60;
		stroke-dashoffset: 60;
		opacity: 0;
		animation:
			steamDraw 1.2s ease-out 2100ms forwards,
			steamLoop 3s ease-in-out 3300ms infinite;
	}
	.steam .s2 { animation-delay: 2250ms, 3450ms; }
	.steam .s3 { animation-delay: 2400ms, 3600ms; }

	@keyframes steamDraw {
		to { stroke-dashoffset: 0; opacity: 0.7; }
	}
	@keyframes steamLoop {
		0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
		50%      { transform: translateY(-8px) scale(1.05); opacity: 0.35; }
	}

	/* ---------------- Name reveal ---------------- */
	.name {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3.25rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		background: linear-gradient(90deg, #f4f1ea 0%, #c9976a 50%, #f4f1ea 100%);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation: shimmer 3s linear infinite;
	}
	.char {
		display: inline-block;
		opacity: 0;
		transform: translateY(24px);
		animation: reveal 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: calc(1200ms + var(--i) * 50ms);
	}
	.char.space { width: 0.4em; }
	@keyframes reveal {
		to { opacity: 1; transform: translateY(0); }
	}
	@keyframes shimmer {
		0%   { background-position: 0 50%; }
		100% { background-position: 200% 50%; }
	}

	.tagline {
		margin: 0;
		font-size: 0.9rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(244, 241, 234, 0.55);
		opacity: 0;
		animation: fadeUp 600ms ease 2200ms forwards;
	}
	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(8px); }
		to   { opacity: 1; transform: translateY(0); }
	}
	.dots span {
		display: inline-block;
		animation: bounce 1.2s ease-in-out infinite;
	}
	.dots span:nth-child(2) { animation-delay: 0.15s; }
	.dots span:nth-child(3) { animation-delay: 0.3s; }
	@keyframes bounce {
		0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
		40%           { transform: translateY(-3px); opacity: 1; }
	}

	/* ---------------- Progress bar ---------------- */
	.bar {
		margin-top: 0.75rem;
		width: min(280px, 60vw);
		height: 2px;
		background: rgba(244, 241, 234, 0.12);
		border-radius: 999px;
		overflow: hidden;
	}
	.fill {
		height: 100%;
		width: 100%;
		background: linear-gradient(90deg, #67e8f9, #c9976a, #f59e0b);
		transform-origin: left center;
		transform: scaleX(0);
		border-radius: inherit;
		box-shadow: 0 0 12px rgba(201, 151, 106, 0.6);
	}

	/* ---------------- Skip button ---------------- */
	.skip {
		position: absolute;
		top: 1.25rem;
		right: 1.5rem;
		z-index: 3;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.85rem;
		background: rgba(244, 241, 234, 0.05);
		border: 1px solid rgba(244, 241, 234, 0.15);
		border-radius: 999px;
		color: rgba(244, 241, 234, 0.7);
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
		backdrop-filter: blur(8px);
		transition: color 0.2s, background 0.2s, border-color 0.2s, transform 0.2s;
	}
	.skip:hover {
		color: #f4f1ea;
		background: rgba(244, 241, 234, 0.1);
		border-color: rgba(244, 241, 234, 0.35);
		transform: translateX(-2px);
	}

	/* ---------------- Curtain exit ---------------- */
	.curtain {
		position: absolute;
		left: 0;
		right: 0;
		height: 51%;
		background: #050403;
		z-index: 4;
		pointer-events: none;
	}
	.curtain.top    { top: 0;    transform: translateY(-100%); }
	.curtain.bottom { bottom: 0; transform: translateY(100%); }
	.intro.leaving .curtain.top    { animation: wipeTop    700ms cubic-bezier(0.76, 0, 0.24, 1) forwards; }
	.intro.leaving .curtain.bottom { animation: wipeBottom 700ms cubic-bezier(0.76, 0, 0.24, 1) forwards; }
	.intro.leaving .stage { animation: liftOut 600ms cubic-bezier(0.76, 0, 0.24, 1) forwards; }
	@keyframes wipeTop {
		to { transform: translateY(0); }
	}
	@keyframes wipeBottom {
		to { transform: translateY(0); }
	}
	@keyframes liftOut {
		to { opacity: 0; transform: translateY(-24px) scale(0.98); filter: blur(4px); }
	}

	/* ---------------- Reduced motion ---------------- */
	.intro.reduced .aurora,
	.intro.reduced .blob,
	.intro.reduced .steam .s,
	.intro.reduced .char,
	.intro.reduced .coffee,
	.intro.reduced .tagline,
	.intro.reduced .stroke {
		animation: none !important;
	}
	.intro.reduced .stroke { stroke-dashoffset: 0; }
	.intro.reduced .coffee { transform: translateY(105px); }
	.intro.reduced .char   { opacity: 1; transform: none; }
	.intro.reduced .tagline{ opacity: 1; }
	.intro.reduced.leaving { animation: reducedFade 300ms ease forwards; }
	@keyframes reducedFade { to { opacity: 0; } }
</style>
