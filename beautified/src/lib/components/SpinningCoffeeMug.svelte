<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { Environment, OrbitControls } from '@threlte/extras';
  import { T, useTask, useLoader } from '@threlte/core';
  import * as THREE from 'three';

  // --- Mug Configuration ---
  const mugRadius = 0.5;
  const mugHeight = 0.8;
  const mugWallThickness = 0.05;
  const handleRadius = 0.2;
  const handleTubeRadius = 0.06;
  const coffeeLevel = mugHeight * 0.85; // How full the mug is

  // --- Refs for animation ---
  let mugGroup: THREE.Group;
  let coffeeMaterial: THREE.MeshStandardMaterial;
  let coffeeTexture: THREE.Texture | undefined = undefined;

  // --- Coffee Swirl Texture ---
  useTask((delta) => {
    if (coffeeMaterial && !coffeeTexture) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 128; // Texture size
      canvas.width = size;
      canvas.height = size;

      // Dark coffee base
      ctx.fillStyle = '#3A241C'; // Dark brown
      ctx.fillRect(0, 0, size, size);

      // Add some lighter swirls/foam
      ctx.strokeStyle = '#8C6D5S'; // Lighter brown for foam/swirl
      ctx.lineWidth = size / 20;
      ctx.beginPath();
      const numSwirls = 5;
      for (let i = 0; i < numSwirls; i++) {
        ctx.moveTo(Math.random() * size, Math.random() * size);
        ctx.bezierCurveTo(
          Math.random() * size, Math.random() * size,
          Math.random() * size, Math.random() * size,
          Math.random() * size, Math.random() * size
        );
      }
      ctx.stroke();
      
      // Add a few more subtle swirls
      ctx.strokeStyle = '#654321'; // A slightly different brown
      ctx.lineWidth = size / 30;
      ctx.beginPath();
      for (let i = 0; i < numSwirls -2 ; i++) {
        ctx.moveTo(Math.random() * size, Math.random() * size);
        ctx.quadraticCurveTo(
          Math.random() * size, Math.random() * size,
          Math.random() * size, Math.random() * size
        );
      }
      ctx.stroke();


      coffeeTexture = new THREE.CanvasTexture(canvas);
      coffeeTexture.wrapS = THREE.RepeatWrapping;
      coffeeTexture.wrapT = THREE.RepeatWrapping;
      coffeeTexture.rotation = 0; // Initialize rotation
      coffeeTexture.center.set(0.5, 0.5); // Rotate around the center
      coffeeMaterial.map = coffeeTexture;
      coffeeMaterial.needsUpdate = true;
    }
    return () => {
      coffeeTexture?.dispose(); // Clean up texture on component unmount
    }
  }, { autoStart: true }); // Run once to create texture


  // --- Animation Loop ---
  useTask((delta) => {
    if (mugGroup) {
      mugGroup.rotation.y += delta * 0.5; // Spin the whole mug
    }
    if (coffeeTexture) {
      // "Twirl" the coffee by rotating its texture
      coffeeTexture.rotation += delta * 0.8; // Adjust speed as needed
      // You could also animate coffeeTexture.offset.x or .y for a different effect
    }
  });

  // Optional: Load an environment map for reflections
//   const envMap = useLoader(
//     THREE.CubeTextureLoader,
//     {
//       urls: [
//         'px.png', 'nx.png',
//         'py.png', 'ny.png',
//         'pz.png', 'nz.png'
//       ],
//       transform: (loader: THREE.CubeTextureLoader) => {
//         loader.setPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/Bridge2/');
//         return loader;
//       }
//     }
//   );

</script>


<T.PerspectiveCamera 
    makeDefault
    position={[5, 5, 5]}
    oncreate={(ref) => {
		ref.lookAt(0, 1, 0);
	}}
    fov={50}
/>
<OrbitControls enableZoom={true} enablePan={true} />

<T.AmbientLight intensity={0.8} />
<T.DirectionalLight intensity={1.5} position={[5, 5, 5]} castShadow />
<!-- {#if envMap}
    <Environment map={envMap} background={false} />
{/if} -->

<!-- Mug Group: everything rotates together -->
<T.Group bind:ref={mugGroup} rotation.x={-Math.PI * 0.05} >
    <!-- Mug Body (outer shell) -->
    <T.Mesh castShadow receiveShadow>
    <T.CylinderGeometry args={[mugRadius, mugRadius, mugHeight, 32]} />
    <T.MeshStandardMaterial color="#EAE7DC" metalness={0.2} roughness={0.6} />
    </T.Mesh>

    <!-- Mug Inside (cutout - could also use CSG or a more complex model) -->
    <!-- For simplicity, we'll make the "inside" a slightly smaller, darker cylinder -->
    <!-- Or just rely on the coffee surface and the top edge of the outer shell -->

    <!-- Mug Handle -->
    <T.Mesh
    castShadow
    receiveShadow
    position={[mugRadius - handleTubeRadius * 0.5, mugHeight * 0.4, 0]}
    rotation={[0, 0, -Math.PI / 5]}
    >
    <T.TorusGeometry args={[handleRadius, handleTubeRadius, 16, 32]} />
    <T.MeshStandardMaterial color="#EAE7DC" metalness={0.2} roughness={0.6} />
    </T.Mesh>

    <!-- Coffee Surface -->
    <T.Mesh position={[0, coffeeLevel / 2 - mugHeight / 2 + mugWallThickness * 2, 0]} rotation.x={-Math.PI / 2}>
    <T.CylinderGeometry
        args={[
        mugRadius - mugWallThickness, // Inner radius
        mugRadius - mugWallThickness, // Inner radius
        0.01, // Very thin, just a surface
        32
        ]}
    />
    <!-- This material's map will be animated -->
    <T.MeshStandardMaterial bind:ref={coffeeMaterial} metalness={0.1} roughness={0.8} />
    </T.Mesh>

</T.Group>
