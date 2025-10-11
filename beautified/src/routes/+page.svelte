<script lang="ts">
	// ScrollArea, Tabs
	import { createSeparator, melt } from '@melt-ui/svelte';
	import { Canvas, T, useTask } from '@threlte/core';
	import { interactivity, OrbitControls } from '@threlte/extras';
	import { spring } from 'svelte/motion';
	import { writable, get } from 'svelte/store';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	import Scene from '$lib/components/Scene.svelte';
	import SpinningCoffeeMug from '$lib/components/SpinningCoffeeMug.svelte';

	const props = $props();
	const data = props.data; // get data passed from server
	const experiences = data.experiences;

	let selectedExperience = $state(0);
	function selectExperience(index: number) {
		selectedExperience = index;
	}

	const projects = [
		{
			title: "JustTravel",
			description: "AI-enhanced itinerary planning web application",
			technologies: ["NextJS", "Flask", "AWS", "Prompt Engineering"],
			image: "/justtravel.jpg"
		},
		{
			title: "NaviLoo",
			description: "Waze-like single page application for finding the nearest public toilet near you",
			technologies: ["NextJS", "Django", "Vercel"],
			image: "/naviloo.gif"
		},
		{
			title: "SAP SuccessSculptors",
			description: "Prompt-based Interviewer tool with generative AI (GPT4o) and Joule AI integration",
			technologies: ["NextJS", "Django", "Vercel"],
			image: "/success_sculptors.jpg"
		}
	];
	
	const { 
		elements: { root: horizontal },
	} = createSeparator({
		orientation: 'horizontal',
		decorative: true,
	});

	const hoverScale = spring(1, {
		stiffness: 0.2,
		damping: 0.5 
	});

	const liquidWave = writable(0); // store that holds the wave value

	let animationTime = $state(0); // animation related time variable

	let mugRotation = new THREE.Euler(0, 0, 0); // rotation of the mug; initial 0 radians

	let isDragging = false; // flag to check if the mug is being dragged

	let previousMousePosition = { // store to hold the previous mouse position
 		x: 0,
		y: 0
	};

	const rotationSpeedFactor = 0.005; // sensitivity factor for rotation speed

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		previousMousePosition.x = event.clientX;
		previousMousePosition.y = event.clientY;

		if (event.target instanceof HTMLElement) {
			event.target.style.cursor = 'grabbing'; // change cursor to grabbing
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;

		// change in mouse position
		const deltaX = event.clientX - previousMousePosition.x;
		const deltaY = event.clientY - previousMousePosition.y;

		const newRotation = mugRotation.clone(); // start with the current rotation

		// update rotation based on mouse movement
		// horizontal mouse movement affects y-axis rotation
		newRotation.y += deltaX * rotationSpeedFactor; 
		newRotation.x += deltaY * rotationSpeedFactor;
		
		// Optional: Clamp X-axis rotation to prevent flipping the mug upside down too far.
		// Math.PI / 2 is 90 degrees. -Math.PI / 2 is -90 degrees.
		newRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotation.x));

		mugRotation.copy(newRotation); // update the mug rotation

		previousMousePosition.x = event.clientX;
		previousMousePosition.y = event.clientY;
	}

	function handleMouseUp(event: MouseEvent) {
		if (isDragging) {
			isDragging = false; // stop dragging

			if (event.target instanceof HTMLElement) {
				event.target.style.cursor = 'grab'; // change cursor back to grab
			}
		}
	}

	function handleMouseLeave(event: MouseEvent) {
		if (isDragging) {
			isDragging = false; // stop dragging

			if (event.target instanceof HTMLElement) {
				event.target.style.cursor = 'default';
			}
		}
	}
</script>

<section id="landing" class="flex flex-col items-center justify-center h-screen min-h-[600px]">
	<div
		class="canvas-container w-full h-[70vh]"
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseLeave}
		style="cursor: drag;"
		role="presentation"
	>
		<Canvas>
			<!-- Camera -->
			<T.PerspectiveCamera
				makeDefault
				position={[3, 3, 3]}
				fov={50}
				oncreate={(cam) => {
					cam.lookAt(0, 0.5, 0);
				}}
			/>

			<!-- Lights -->
			<T.DirectionalLight 
				position={[10, 10, 5]}
				intensity={1.5}
				castShadow 
			/>
			<!-- <T.AmbientLight 
				intensity={0.8}
			/> -->

			<Scene
				mugRotation={mugRotation}
				hoverScale={hoverScale}
				onPointerEnter={() => hoverScale.set(1.1)}
				onPointerLeave={() => hoverScale.set(1)}
				liquidWave={liquidWave}
				animationTime={animationTime}
			/>
		</Canvas>
	</div>
	<!-- <SpinningCoffeeMug /> -->

	<span class="w-full text-xl text-center tracking-tight bg-zinc-600 rounded-md p-3" style="font-family: 'Neue Montreal'">
		Hi! I'm a full-stack software engineer based in Singapore.
	</span>
</section>

<div use:melt={$horizontal} class="my-2 h-[1px] w-full bg-white border-dashed"></div>

<section id="about" class="scroll-mt-16 flex flex-col items-left justify-center h-full py-10 border-b-2 border-dashed">
	<span class="text-xl font-bold border-b-4 border-zinc-600 self-start" style="font-family: 'Neue Montreal'">
		About me...
	</span>
	<p class="text-lg py-3 text-justify" style="font-family: 'Neue Montreal'">
		I am currently an AI Software Developer at <span style="color:rgb(103, 232, 249)">SAP Labs</span>, working in the AI Accelerator team under AI Business Services.
		I am also a part-time student at the <span style="color:rgb(103, 232, 249)">Georgia Institute of Technology</span>, pursuing a part-time Master's in Computer Science.
	</p>
	<p class="text-lg py-3 text-justify" style="font-family: 'Neue Montreal'">
		Software architecture is my forte, with a passion for cybersecurity and AI. You can always catch me working on my next pet project or certification. 
		Currently studying for the AWS Certified Solutions Architect - Professional exam.
	</p>
	<p class="text-lg py-3 text-justify" style="font-family: 'Neue Montreal'">
		Outside of work, I enjoy reading fantasy, travelling to new places, and watch the latest anime and k-dramas.
		I also play the piano, often composing lofi music for my Youtube channel.
	</p>
	<p class="text-lg py-3 text-justify" style="font-family: 'Neue Montreal'">
		Feel free to reach out to me through my contacts or for a cup of latte ☕️ if you are in Singapore!
	</p>
</section>

{#if experiences.length > 0 }
<section id="experience" class="scroll-mt-16 flex flex-col items-left justify-center h-full py-10 border-b-2 border-dashed">
	<span class="text-xl font-bold border-b-4 border-zinc-600 self-start" style="font-family: 'Neue Montreal'">
		Experience
	</span>
	<div class="flex flex-col md:flex-row gap-6 my-6">
		<div class="md:w-1/4">
			<ul class="border-l-2 border-zinc-600">
				{#each experiences as experience, index}
					<li>
						<button 
							class="w-full text-left py-3 pl-4 cursor-pointer transition-all duration-100 {selectedExperience === index ? 'border-l-4 border-cyan-300 -ml-[2px] text-cyan-300' : 'hover:text-cyan-100'}"
							onclick={() => selectExperience(index)}
							style="font-family: 'Neue Montreal'"
						>
							<div class="font-medium">{experience.company}</div>
							<div class="text-sm opacity-75">{experience.title}</div>
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<div class="md:w-3/4 bg-zinc-800/50 p-6 rounded-lg">
			{#if experiences[selectedExperience]}
				<div class="mb-4">
					<h3 class="text-xl font-bold text-cyan-300" style="font-family: 'Neue Montreal'">
						{experiences[selectedExperience].title}
					</h3>
					<h4 class="text-lg" style="font-family: 'Neue Montreal'">
						{experiences[selectedExperience].company}
					</h4>
					<div class="text-sm opacity-75 mb-4" style="font-family: 'Neue Montreal'">
						{new Date(experiences[selectedExperience].startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - {experiences[selectedExperience].endDate ? new Date(experiences[selectedExperience].endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : 'Present'} 
						| {experiences[selectedExperience].location}
					</div>
				</div>
				<p class="text-md text-justify" style="font-family: 'Neue Montreal'">
					{experiences[selectedExperience].description[0].children[0].text}
				</p>
			{/if}
		</div>
	</div>
</section>
{/if}

{#if projects.length > 0 }
<section id="projects" class="scroll-mt-16 flex flex-col items-center justify-center h-full py-10 border-b-2 border-dashed">
	<span class="text-xl font-bold border-b-4 border-zinc-600 self-start" style="font-family: 'Neue Montreal'">
		Projects
	</span>
	<!-- JustTravel -->
	<div class="py-3 text-center">
		<img src="/justtravel.jpg" alt="JustTravel Home Page" class="rounded-lg mb-2 w-[1000px] h-auto">
		<span class="text-lg" style="font-family: 'Neue Montreal'">
			JustTravel
		</span>
		<div class="flex flex-wrap justify-center">
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				NextJS
			</div>
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				Flask
			</div>
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				AWS
			</div>
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				Prompt Engineering
			</div>
		</div>
		<p class="text-md" style="font-family: 'Neue Montreal'">
			AI-enhanced itinerary planning web application
		</p>
	</div>
	<div class="w-[50%] my-5 h-px border-t-2 border-dotted"></div>
	<!-- NaviLoo -->
	<div class="py-3 text-center">
		<img src="/naviloo.gif" alt="JustTravel Home Page" class="rounded-lg mb-2 w-[1000px] h-auto">
		<span class="text-lg" style="font-family: 'Neue Montreal'">
			NaviLoo
		</span>
		<div class="flex flex-wrap justify-center">
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				NextJS
			</div>
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				Django
			</div>
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				Vercel
			</div>
		</div>
		<p class="text-md" style="font-family: 'Neue Montreal'">
			Waze-like single page application for finding the nearest public toilet near you
		</p>
	</div>
	<div class="w-[50%] my-5 h-px border-t-2 border-dotted"></div>
	<!-- SuccessSculptors -->
	<div class="py-3 text-center">
		<img src="/success_sculptors.jpg" alt="JustTravel Home Page" class="rounded-lg mb-2 w-[1000px] h-auto">
		<span class="text-lg" style="font-family: 'Neue Montreal'">
			SAP SuccessSculptors
		</span>
		<div class="flex flex-wrap justify-center">
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				NextJS
			</div>
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				Django
			</div>
			<div class="m-2 p-2 bg-zinc-600 rounded-md text-white" style="font-family: 'Neue Montreal'">
				Vercel
			</div>
		</div>
		<p class="text-md" style="font-family: 'Neue Montreal'">
			Prompt-based Interviewer tool with generative AI (GPT4o) and Joule AI integration
		</p>
	</div> 
</section>
{/if}

<section id="contact" class="scroll-mt-16 flex flex-col items-center justify-center h-full py-10">
	<span class="text-xl font-bold border-b-4 border-zinc-600 self-start" style="font-family: 'Neue Montreal'">
		Contact Me!
	</span>
	<ul class="self-start flex flex-row space-x-3">
		<li class="pt-5">
			<a
				href="mailto:danieltay170600@gmail.com"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg class="inline-block w-8 h-8 mr-2 fill-cyan-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/>
				</svg>
				<!-- <span class="text-cyan-300 transform transition-transform duration-300 hover:scale-110 cursor-pointer inline-block" style="font-family: 'Neue Montreal'">
					danieltay170600@gmail.com
				</span> -->
			</a>
		</li>
		<li class="pt-5">
			<a
				href="https://github.com/DanielxDante"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg class="inline-block w-8 h-8 mr-2 fill-cyan-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 0C5.37 0 0 5.37 0 12C0 17.3 3.438 21.8 8.205 23.385C8.805 23.475 9.025 23.145 9.025 22.845C9.025 22.575 9.015 21.885 9.01 20.935C5.672 21.635 4.968 19.335 4.968 19.335C4.422 17.985 3.633 17.635 3.633 17.635C2.546 16.935 3.713 16.95 3.713 16.95C4.922 17.035 5.548 18.195 5.548 18.195C6.635 20.035 8.422 19.535 9.205 19.235C9.305 18.485 9.605 17.985 9.945 17.685C7.22 17.385 4.39 16.335 4.39 11.635C4.39 10.335 4.83 9.285 5.548 8.485C5.428 8.185 5.048 6.935 5.668 5.235C5.668 5.235 6.668 4.935 9.005 6.485C9.945 6.195 10.945 6.045 11.945 6.045C12.945 6.045 13.945 6.195 14.885 6.485C17.222 4.935 18.222 5.235 18.222 5.235C18.842 6.935 18.462 8.185 18.342 8.485C19.06 9.285 19.5 10.335 19.5 11.635C19.5 16.345 16.67 17.385 13.945 17.685C14.345 18.035 14.745 18.735 14.745 19.835C14.745 21.335 14.735 22.435 14.735 22.845C14.735 23.145 14.955 23.485 15.555 23.385C20.322 21.8 23.76 17.3 23.76 12C23.76 5.37 18.63 0 12 0Z"/>
				</svg>
				<!-- <span class="text-cyan-300 transform transition-transform duration-300 hover:scale-110 cursor-pointer inline-block" style="font-family: 'Neue Montreal'">
					@DanielxDante
				</span> -->
			</a>
		</li>
		<li class="pt-5">
			<a
				href="https://www.linkedin.com/in/danieltaysg/"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg class="inline-block w-8 h-8 mr-2 fill-cyan-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.37h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.6v5.57z"/>
				</svg>
				<!-- <span class="text-cyan-300 transform transition-transform duration-300 hover:scale-110 cursor-pointer inline-block" style="font-family: 'Neue Montreal'">
					@danieltaysg
				</span> -->
			</a>
		</li>
	</ul>
	<!-- <button
		on:click={downloadFile}
		class="cursor-pointer px-3 py-2 text-lg font-bold text-black bg-cyan-300 rounded-md mt-5 transform transition-transform duration-300 hover:scale-110"
		type="button"
	>
		<span class="text-sm">
			My Resume
		</span>
	</button> -->
</section>

<style>
</style>


