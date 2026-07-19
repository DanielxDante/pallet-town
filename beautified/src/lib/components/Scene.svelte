<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, ContactShadows, Environment, Float } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import * as THREE from 'three';
	import { theme } from '$lib/theme/theme.svelte';
	import { palettes } from '$lib/theme/palette';

	type Rotation = { x: number; y: number; z: number };

	type Props = {
		mugRotation: Rotation;
		hoverScale: Spring<number>;
		onPointerEnter: () => void;
		onPointerLeave: () => void;
		autoSpin?: boolean;
	};

	const {
		mugRotation,
		hoverScale,
		onPointerEnter,
		onPointerLeave,
		autoSpin = true
	}: Props = $props();

	interactivity();

	// Current theme's palette, reactive to theme.current
	const p = $derived(palettes[theme.current].mug);

	// -----------------------------------------------------------------------------
	// Responsive scale — read canvas size from Threlte and scale the mug so it fits
	// nicely on both desktop and phone viewports.
	// -----------------------------------------------------------------------------
	const { size } = useThrelte();
	let responsiveScale = $state(1);
	$effect(() => {
		const s = $size;
		if (!s || !s.width) return;
		// aspect < ~0.9 means portrait / narrow — shrink so mug + saucer fit.
		const aspect = s.width / Math.max(1, s.height);
		responsiveScale = THREE.MathUtils.clamp(aspect * 0.85, 0.55, 1.05);
	});

	// -----------------------------------------------------------------------------
	// Shader material for the animated coffee surface
	//   - uAngVel: instantaneous angular velocity (rad/s) of the mug's Y rotation
	//   - uSlosh:  low-passed inertia — how far the liquid is "behind" the cup
	//   - uTilt:   xy vector (unit) of the slosh direction in mug-local space
	// -----------------------------------------------------------------------------
	const initialMug = palettes[theme.current].mug;
	const coffeeUniforms = {
		uTime: { value: 0 },
		uAngVel: { value: 0 },
		uSlosh: { value: 0 },
		uTilt: { value: new THREE.Vector2(0, 0) },
		uDeep: { value: new THREE.Color(initialMug.liquidDeep) },
		uMid: { value: new THREE.Color(initialMug.liquidMid) },
		uCrema: { value: new THREE.Color(initialMug.liquidCrema) }
	};

	// Update shader uniforms whenever the theme changes.
	$effect(() => {
		coffeeUniforms.uDeep.value.set(p.liquidDeep);
		coffeeUniforms.uMid.value.set(p.liquidMid);
		coffeeUniforms.uCrema.value.set(p.liquidCrema);
	});

	const coffeeMaterial = new THREE.ShaderMaterial({
		uniforms: coffeeUniforms,
		transparent: false,
		vertexShader: /* glsl */ `
			uniform float uTime;
			uniform float uAngVel;
			uniform float uSlosh;
			uniform vec2  uTilt;
			varying vec2  vUv;
			varying float vElev;
			varying vec2  vXY;

			void main() {
				vUv = uv;
				vec3 p = position;

				// The disc lies in local XY (we rotate it -PI/2 on X in the scene).
				vec2 xy = p.xy;
				vXY = xy;
				float d = length(xy);
				float rimFalloff = smoothstep(0.67, 0.0, d);

				// Ambient breathing ripples (always present)
				float w1 = sin(d * 22.0 - uTime * 3.0) * 0.010;
				float w2 = sin(p.x * 10.0 + uTime * 1.7) * 0.006;
				float w3 = cos(p.y * 12.0 - uTime * 2.1) * 0.006;
				float ambient = (w1 + w2 + w3);

				// Spin-driven concentric ripples — amplitude scales with |angular velocity|
				float spinRipple = sin(d * 26.0 - uTime * 7.0) * 0.018 * min(abs(uAngVel), 2.0);

				// Slosh tilt — liquid piles up on the side opposite to angular acceleration.
				// uTilt is a unit direction in the disc's local XY plane, |uSlosh| in rad/s.
				float tiltAmount = dot(normalize(xy + 1e-5), uTilt) * clamp(uSlosh, -2.0, 2.0) * 0.13;

				float elev = (ambient + spinRipple) * rimFalloff + tiltAmount * rimFalloff;
				p.z += elev;
				vElev = elev;

				gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
			}
		`,
		fragmentShader: /* glsl */ `
			precision highp float;
			uniform float uTime;
			uniform float uSlosh;
			uniform vec2  uTilt;
			uniform vec3  uDeep;
			uniform vec3  uMid;
			uniform vec3  uCrema;
			varying vec2  vUv;
			varying float vElev;
			varying vec2  vXY;

			// polar swirl — swirl angle offset lagged by uSlosh so the crema
			// keeps rotating for a moment after the cup stops.
			vec2 swirl(vec2 uv, float t, float lag) {
				vec2 c = uv - 0.5;
				float r = length(c);
				float a = atan(c.y, c.x);
				// baseline gentle rotation + strong slosh-driven advection
				a += (0.9 - r) * 3.0 + t * 0.35 + lag;
				return vec2(cos(a), sin(a)) * r + 0.5;
			}

			float hash(vec2 p) {
				return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
			}
			float noise(vec2 p) {
				vec2 i = floor(p);
				vec2 f = fract(p);
				float a = hash(i);
				float b = hash(i + vec2(1.0, 0.0));
				float c = hash(i + vec2(0.0, 1.0));
				float d = hash(i + vec2(1.0, 1.0));
				vec2 u = f * f * (3.0 - 2.0 * f);
				return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
			}

			void main() {
				vec2 uv = vUv;

				// Two swirl layers at different lags — creates the "still-spinning" crema.
				vec2 s1 = swirl(uv, uTime, uSlosh * 2.4);
				vec2 s2 = swirl(uv, uTime * 0.7, uSlosh * 3.6);

				float n  = noise(s1 * 6.0);
				float n2 = noise(s2 * 14.0 + uTime * 0.25);
				float streaks = noise(s1 * 30.0 + vec2(uTime * 0.6, 0.0));

				float cremaMask = smoothstep(0.5, 0.85, n * 0.55 + n2 * 0.45);
				vec3 col = mix(uDeep, uMid, n);
				col = mix(col, uCrema, cremaMask * 0.75);

				// Fine crema streaks emphasise rotation
				col += (streaks - 0.5) * 0.08 * vec3(1.0, 0.85, 0.6);

				// Slosh side darkening — pile-up side gets a shadow, leading side lifts.
				float sideDot = dot(normalize(vXY + 1e-5), uTilt);
				float sloshShade = sideDot * uSlosh * 0.25;
				col *= 1.0 + clamp(sloshShade, -0.35, 0.35);

				// meniscus / edge darkening
				float r = length(uv - 0.5) * 2.0;
				col *= smoothstep(1.05, 0.35, r);

				// specular-ish wave highlight
				col += clamp(vElev * 30.0, -0.1, 0.35) * vec3(0.6, 0.45, 0.3);

				gl_FragColor = vec4(col, 1.0);
			}
		`
	});

	// -----------------------------------------------------------------------------
	// Idle spin + angular velocity tracking
	// -----------------------------------------------------------------------------
	let idleSpin = $state(0);
	let prevTotalY: number | null = null; // lazily initialised on first task tick so we read the current mugRotation.y inside the closure
	let angVel = 0;   // rad/s, smoothed
	let slosh = 0;    // low-pass of angVel, decays slowly
	// unit vector in local XY plane pointing "backwards" against angular motion
	const tiltVec = new THREE.Vector2(0, 0);
	let tiltAngle = 0;

	useTask((delta) => {
		const dt = Math.max(delta, 1e-4);
		coffeeUniforms.uTime.value += delta;

		// Faster idle spin so the flow is clearly visible at rest
		if (autoSpin) idleSpin += delta * 0.6;

		const totalY = mugRotation.y + idleSpin;
		if (prevTotalY === null) prevTotalY = totalY;
		const rawVel = (totalY - prevTotalY) / dt;
		prevTotalY = totalY;

		// low-pass angular velocity so it doesn't spike from single frames
		angVel += (rawVel - angVel) * Math.min(1, dt * 10);

		// Slosh: heavier inertia + slower decay so it lags the cup obviously.
		// Target follows angVel but with a stronger relative offset.
		slosh += (angVel * 1.4 - slosh) * Math.min(1, dt * 2.2);

		// tilt direction lags behind the spin
		tiltAngle += (angVel - tiltAngle) * Math.min(1, dt * 3);
		// Direction perpendicular to spin axis, in disc-local XY
		tiltVec.set(-Math.sin(tiltAngle * 0.9), Math.cos(tiltAngle * 0.9));

		coffeeUniforms.uAngVel.value = angVel;
		coffeeUniforms.uSlosh.value = THREE.MathUtils.clamp(slosh, -3.0, 3.0);
		coffeeUniforms.uTilt.value.copy(tiltVec);
	});

	// -----------------------------------------------------------------------------
	// Steam particles — driven inside useTask so cleanup is automatic
	// -----------------------------------------------------------------------------
	type Puff = {
		seed: number;
		mesh?: THREE.Mesh;
		base: { x: number; z: number };
		phase: number;
		speed: number;
		scale: number;
	};

	const steamPuffs: Puff[] = Array.from({ length: 5 }, (_, i) => ({
		seed: i,
		base: {
			x: (Math.random() - 0.5) * 0.32,
			z: (Math.random() - 0.5) * 0.32
		},
		phase: Math.random() * Math.PI * 2,
		speed: 0.35 + Math.random() * 0.25,
		scale: 0.32 + Math.random() * 0.22
	}));

	let steamClock = 0;
	useTask((delta) => {
		steamClock += delta;
		for (const puff of steamPuffs) {
			if (!puff.mesh) continue;
			const t = steamClock * puff.speed + puff.phase;
			const life = (t % 3) / 3;
			puff.mesh.position.set(
				puff.base.x + Math.sin(t * 1.5) * 0.12,
				1.05 + life * 1.4,
				puff.base.z + Math.cos(t * 1.3) * 0.12
			);
			const s = puff.scale * (0.5 + life * 1.6);
			puff.mesh.scale.set(s, s, s);
			(puff.mesh.material as THREE.MeshBasicMaterial).opacity =
				Math.sin(life * Math.PI) * 0.35;
		}
	});
</script>

<!-- Studio lighting -->
<Environment
	url="https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@main/hdri/studio_small_03_1k.hdr"
	isBackground={false}
/>

<T.AmbientLight intensity={0.35} />
<T.DirectionalLight
	position={[4, 6, 3]}
	intensity={2.2}
	castShadow
	shadow.mapSize.width={1024}
	shadow.mapSize.height={1024}
/>
<T.DirectionalLight position={[-5, 3, -4]} intensity={0.4} color="#8ab8ff" />

<!-- Soft contact shadow beneath the saucer -->
<ContactShadows scale={6} blur={2.5} far={4} opacity={0.55} position.y={-0.001} />

<Float floatIntensity={0.2} speed={1.1} rotationIntensity={0.05}>
	<T.Group scale={responsiveScale}>
		<T.Group
			rotation={[mugRotation.x, mugRotation.y + idleSpin, mugRotation.z]}
			scale={hoverScale.current}
			position.y={0.15}
			onpointerenter={onPointerEnter}
			onpointerleave={onPointerLeave}
		>
			<!-- Saucer -->
			<T.Mesh position.y={-0.02} castShadow receiveShadow>
				<T.CylinderGeometry args={[1.05, 1.15, 0.06, 64]} />
				<T.MeshPhysicalMaterial
					color={p.ceramic}
					roughness={0.35}
					metalness={0.05}
					clearcoat={0.6}
					clearcoatRoughness={0.15}
				/>
			</T.Mesh>

			<!-- Subtle groove ring seated on top of the saucer -->
			<T.Mesh position.y={0.012} rotation.x={-Math.PI / 2} receiveShadow>
				<T.TorusGeometry args={[0.78, 0.012, 12, 96]} />
				<T.MeshPhysicalMaterial color={p.ceramicAlt} roughness={0.5} />
			</T.Mesh>

			<!-- Mug body (outer) — open-ended so the coffee is visible from above -->
			<T.Mesh position.y={0.55} castShadow receiveShadow>
				<T.CylinderGeometry args={[0.72, 0.62, 1.0, 64, 1, true]} />
				<T.MeshPhysicalMaterial
					color={p.ceramic}
					roughness={0.25}
					metalness={0.08}
					clearcoat={0.9}
					clearcoatRoughness={0.1}
					envMapIntensity={1.1}
				/>
			</T.Mesh>

			<!-- Rim highlight ring -->
			<T.Mesh position.y={1.05} rotation.x={-Math.PI / 2} castShadow>
				<T.TorusGeometry args={[0.72, 0.015, 16, 96]} />
				<T.MeshPhysicalMaterial color={p.rim} roughness={0.1} metalness={0.3} />
			</T.Mesh>

			<!-- Inner wall (dark) so peering into the mug looks hollow.
			     castShadow disabled so it doesn't cast a halo on the coffee surface. -->
			<T.Mesh position.y={0.6}>
				<T.CylinderGeometry args={[0.68, 0.58, 0.94, 64, 1, true]} />
				<T.MeshStandardMaterial color={p.interiorDark} roughness={0.9} side={THREE.BackSide} />
			</T.Mesh>

			<!-- Bottom cap (inside) -->
			<T.Mesh position.y={0.15} rotation.x={-Math.PI / 2}>
				<T.CircleGeometry args={[0.6, 64]} />
				<T.MeshStandardMaterial color={p.interiorDeep} roughness={1} />
			</T.Mesh>

			<!-- Handle. Torus lies in XY by default. A half-torus (arc = π)
			     spans from (r,0) counterclockwise to (-r,0) through the top.
			     Rotating -π/2 around Z puts endpoints at (0, r) and (0, -r) with
			     the loop bulging on +X — a proper handle when translated to the
			     mug's right wall. Slight arc overshoot so endpoints tuck into
			     the cup wall rather than floating in air. -->
			<T.Mesh position={[0.66, 0.55, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
				<T.TorusGeometry args={[0.28, 0.055, 20, 64, Math.PI * 1.05]} />
				<T.MeshPhysicalMaterial
					color={p.ceramic}
					roughness={0.25}
					metalness={0.08}
					clearcoat={0.9}
					clearcoatRoughness={0.1}
				/>
			</T.Mesh>

			<!-- Coffee surface (shader-animated). Seated below the rim so slosh
			     displacement never pokes through the rim highlight ring. -->
			<T.Mesh position.y={0.96} rotation.x={-Math.PI / 2}>
				<T.CircleGeometry args={[0.67, 128]} />
				<T is={coffeeMaterial} />
			</T.Mesh>

			<!-- Steam wisps -->
			{#each steamPuffs as puff (puff.seed)}
				<T.Mesh
					oncreate={(ref) => {
						puff.mesh = ref as THREE.Mesh;
					}}
				>
					<T.SphereGeometry args={[0.15, 12, 12]} />
					<T.MeshBasicMaterial color={p.steam} transparent opacity={0} depthWrite={false} />
				</T.Mesh>
			{/each}
		</T.Group>
	</T.Group>
</Float>
