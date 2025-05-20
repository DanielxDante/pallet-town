<script>
    import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras'
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';

	interactivity();
	const scale = spring(1);
	let rotation = 0;
	const liquidWave = writable(0);

	useTask((delta) => {
		rotation += delta
		liquidWave.update((wave) => Math.sin(rotation) + delta);
	})
</script>

<!-- Camera -->
<T.PerspectiveCamera
	makeDefault
	position={[5, 5, 5]}
	oncreate={(ref) => {
		ref.lookAt(0, 1, 0);
	}}
/>

<!-- Lights -->
<T.DirectionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
<T.AmbientLight intensity={0.5} />

<!-- Coffee Cup -->
<T.Mesh
	rotation.y={rotation}
	position.y={1}
	scale={$scale}
	onpointerenter={() => scale.set(1.2)}
	onpointerleave={() => scale.set(1)}
	castShadow
>
	<!-- Cup Body -->
	<T.CylinderGeometry args={[1, 1, 2, 32]} />
	<T.MeshStandardMaterial color="white" />

	<!-- Cup Handle -->
	<T.Mesh position={[1.5, 0.2, 0]}>
		<T.TorusGeometry args={[0.5, 0.1, 16, 100]} />
		<T.MeshStandardMaterial color="white" />
	</T.Mesh>

  <!-- Coffee -->
  <!-- <T.Mesh position={[0, -0.5, 0]}>
    <T.CircleGeometry args={[0.9, 32]} />
    <T.MeshStandardMaterial color="#6f4e37" roughness={0.5} metalness={0.2}>
      <T.MaterialNode
        attach="uniforms"
        scale={[1, 1, 1]}
        position={[0, 0, $liquidWave]}
      />
    </T.MeshStandardMaterial>
  </T.Mesh> -->
</T.Mesh>

<!-- Ground -->
<!-- <T.Mesh 
  rotation.x={-Math.PI / 2}
  receiveShadow
>
  <T.PlaneGeometry args={[10, 10]} />
  <T.MeshStandardMaterial color="#ddd" />
</T.Mesh> -->
