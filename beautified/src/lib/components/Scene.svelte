<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { spring, type Spring } from 'svelte/motion';
	import { writable, get, type Writable } from 'svelte/store';
	import { interactivity, OrbitControls } from '@threlte/extras';
	import * as THREE from 'three';

	export let mugRotation: THREE.Euler;
	export let hoverScale: Spring<number>;
	export let onPointerEnter: () => void;
	export let onPointerLeave: () => void;
	export let liquidWave: Writable<number>;
	export let animationTime: number;
	
	interactivity(); // enable pointer events
	
	useTask((delta) => {
		// TODO: add default rotation speed
		// mugRotation.y += delta;
		if (mugRotation) {
			mugRotation.y += 0.01;
		}
		animationTime += delta * 2 // multiply by a factor to control speed
		liquidWave.update(() => Math.sin(animationTime) * 0.05); // update the wave value
	})
</script>

<!-- Coffee Cup -->
<T.Mesh
	rotation={[mugRotation.x, mugRotation.y, mugRotation.z]}
	position.y={0.5}
	scale={$hoverScale}
	onpointerenter={onPointerEnter}
	onpointerleave={onPointerLeave}
	castShadow
>
	<!-- Cup Body -->
	<T.CylinderGeometry 
		args={[0.7, 0.65, 1.5, 32]} 
	/>
	<T.MeshStandardMaterial 
		color="#EAEAEA"
		roughness={0.3}
		metalness={0.1}
	/>

	<!-- Cup Handle -->
	<T.Mesh 
		position={[0.7, 0.2, 0]}
	>
		<T.TorusGeometry 
			args={[0.35, 0.1, 16, 32]}
		/>
		<T.MeshStandardMaterial
			color="white"
			roughness={0.3}
			metalness={0.1}
		/>
	</T.Mesh>

  	<!-- Coffee -->
	<T.Mesh
		position.y={1.5 / 2 - 0.1 + $liquidWave}
		rotation.x={-Math.PI / 2}
	>
		<T.CircleGeometry args={[0.63, 32]} />
		<T.MeshStandardMaterial
			color="#4A3B31"
			roughness={0.2}
			metalness={0.0}
			transparent={true}
			opacity={0.95}
		/>
  	</T.Mesh>
</T.Mesh>

<!-- Ground -->
<!-- <T.Mesh 
  rotation.x={-Math.PI / 2}
  receiveShadow
>
  <T.PlaneGeometry args={[10, 10]} />
  <T.MeshStandardMaterial color="#ddd" />
</T.Mesh> -->



