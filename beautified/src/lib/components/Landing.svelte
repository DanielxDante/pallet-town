<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { Spring } from 'svelte/motion';

	import Scene from '$lib/components/Scene.svelte';
	import * as m from '$lib/paraglide/messages';

	const hoverScale = new Spring(1, {
		stiffness: 0.2,
		damping: 0.5
	});

	// Reactive rotation state (Svelte 5) — plain object so Threlte re-renders on change
	const mugRotation = $state({ x: 0, y: 0, z: 0 });

	let isDragging = $state(false);
	let cursorStyle = $state('grab');
	const previousMousePosition = { x: 0, y: 0 };
	const rotationSpeedFactor = 0.006;

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		cursorStyle = 'grabbing';
		previousMousePosition.x = event.clientX;
		previousMousePosition.y = event.clientY;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;

		const deltaX = event.clientX - previousMousePosition.x;
		const deltaY = event.clientY - previousMousePosition.y;

		mugRotation.y += deltaX * rotationSpeedFactor;
		mugRotation.x = Math.max(
			-Math.PI / 3,
			Math.min(Math.PI / 3, mugRotation.x + deltaY * rotationSpeedFactor)
		);

		previousMousePosition.x = event.clientX;
		previousMousePosition.y = event.clientY;
	}

	function endDrag() {
		if (isDragging) {
			isDragging = false;
			cursorStyle = 'grab';
		}
	}

	function handleTouchStart(event: TouchEvent) {
		const t = event.touches[0];
		if (!t) return;
		isDragging = true;
		previousMousePosition.x = t.clientX;
		previousMousePosition.y = t.clientY;
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isDragging) return;
		const t = event.touches[0];
		if (!t) return;
		event.preventDefault();
		const deltaX = t.clientX - previousMousePosition.x;
		const deltaY = t.clientY - previousMousePosition.y;
		mugRotation.y += deltaX * rotationSpeedFactor;
		mugRotation.x = Math.max(
			-Math.PI / 3,
			Math.min(Math.PI / 3, mugRotation.x + deltaY * rotationSpeedFactor)
		);
		previousMousePosition.x = t.clientX;
		previousMousePosition.y = t.clientY;
	}
</script>

<section id="landing" class="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
	<div
		class="canvas-container relative w-full h-[55vh] sm:h-[65vh] min-h-[320px] select-none touch-none"
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={endDrag}
		onmouseleave={endDrag}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={endDrag}
		style="cursor: {cursorStyle};"
		role="presentation"
	>
		<Canvas>
			<T.PerspectiveCamera
				makeDefault
				position={[3.2, 2.6, 3.6]}
				fov={45}
				oncreate={(cam) => {
					cam.lookAt(0, 0.6, 0);
				}}
			/>

			<Scene
				{mugRotation}
				{hoverScale}
				autoSpin={!isDragging}
				onPointerEnter={() => hoverScale.set(1.06)}
				onPointerLeave={() => hoverScale.set(1)}
			/>
		</Canvas>
	</div>

	<span class="w-full text-base sm:text-xl text-center tracking-tight bg-zinc-600 rounded-md p-3" style="font-family: 'Neue Montreal'">
		{m.landing_intro()}
	</span>
</section>
