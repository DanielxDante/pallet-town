<script lang="ts">
	import { createSeparator, melt } from '@melt-ui/svelte';

	import Landing from '$lib/components/Landing.svelte';
	import About from '$lib/components/About.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';

	const { data } = $props();

	const {
		elements: { root: horizontal },
	} = createSeparator({
		orientation: 'horizontal',
		decorative: true,
	});
</script>

<Landing />

<div use:melt={$horizontal} class="my-2 h-[1px] w-full bg-line border-dashed"></div>

<About />

<Experience experiences={data.experiences} />

<Projects />

<Contact />

<style>
</style>
