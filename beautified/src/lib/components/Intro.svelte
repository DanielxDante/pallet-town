<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition'; // Example transition

	export let duration = 3000; // Duration of the intro in milliseconds

	const dispatch = createEventDispatcher();

	let showContent = false;

	onMount(() => {
		// Start any animations or timed sequences here
		const contentTimer = setTimeout(() => {
			showContent = true; // For internal animation steps if needed
		}, 500); // Start showing content after a brief delay

		const mainTimer = setTimeout(() => {
			dispatch('introComplete'); // Signal to the layout that intro is done
		}, duration);

		return () => {
			// Cleanup timers if the component is destroyed prematurely
			clearTimeout(mainTimer);
			clearTimeout(contentTimer);
		};
	});
</script>

<div class="intro-container" transition:fade={{ duration: 300 }}>
	{#if showContent}
		<div class="content" transition:fade={{ duration: 500, delay: 200 }}>
			<h1>Welcome!</h1>
			<p>Loading awesome stuff...</p>
			<!-- Your cool animation elements go here -->
			<div class="spinner"></div>
		</div>
	{/if}
	<!-- <button on:click={handleSkip}>Skip Intro</button> -->
</div>

<style>
	.intro-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: #2c3e50; /* Example background */
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999; /* Ensure it's on top */
		text-align: center;
	}

	.content {
		/* Styles for your animated content */
	}

	.spinner {
		margin: 20px auto;
		border: 4px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: #fff;
		width: 40px;
		height: 40px;
		animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Example skip button styling
	button {
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		padding: 10px 20px;
		background-color: rgba(255,255,255,0.2);
		color: white;
		border: 1px solid white;
		border-radius: 5px;
		cursor: pointer;
	}
	button:hover {
		background-color: rgba(255,255,255,0.4);
	}
	*/
</style>