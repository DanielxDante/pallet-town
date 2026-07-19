<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<section id="about" class="scroll-mt-16 flex flex-col items-left justify-center h-full py-10 border-b-2 border-dashed border-line text-fg">
	<span class="text-xl font-bold border-b-4 border-surface-alt self-start" style="font-family: 'Neue Montreal'">
		{m.about_heading()}
	</span>
	<p class="text-lg py-3 text-justify about-paragraph" style="font-family: 'Neue Montreal'">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- content is from developer-controlled i18n messages, not user input -->
		{@html m.about_p1()}
	</p>
	<p class="text-lg py-3 text-justify" style="font-family: 'Neue Montreal'">
		{m.about_p2()}
	</p>
	<p class="text-lg py-3 text-justify" style="font-family: 'Neue Montreal'">
		{m.about_p3()}
	</p>
	<p class="text-lg py-3 text-justify" style="font-family: 'Neue Montreal'">
		{m.about_p4()}
	</p>
</section>

<style>
	.about-paragraph :global(.highlight) {
		color: var(--color-accent);
	}
</style>
