<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { PortableText } from '@portabletext/svelte';
	import LinkMark from '$lib/components/LinkMark.svelte';

	const { experiences } = $props();

	let selectedExperience = $state(0);
	function selectExperience(index: number) {
		selectedExperience = index;
	}

	function formatMonthYear(dateStr: string): string {
		const locale = getLocale();
		const bcp47 = locale === 'zh' ? 'zh-CN' : 'en-US';
		return new Date(dateStr).toLocaleDateString(bcp47, {
			month: 'short',
			year: 'numeric'
		});
	}
</script>

{#if experiences && experiences.length > 0}
<section id="experience" class="scroll-mt-16 flex flex-col items-left justify-center h-full py-10 border-b-2 border-dashed border-line text-fg">
	<span class="text-xl font-bold border-b-4 border-surface-alt self-start" style="font-family: 'Neue Montreal'">
		{m.experience_heading()}
	</span>
	<div class="flex flex-col md:flex-row gap-6 my-6">
		<div class="md:w-1/4">
			<ul class="border-l-2 border-surface-alt">
				{#each experiences as experience, index (experience.company + index)}
					<li>
						<button 
							class="w-full text-left py-3 pl-4 cursor-pointer transition-all duration-100 {selectedExperience === index ? 'border-l-4 border-accent -ml-[2px] text-accent' : 'hover:text-accent-soft'}"
							onclick={() => selectExperience(index)}
							style="font-family: 'Neue Montreal'"
						>
							<span class="font-medium">{experience.company}</span>
							<span class="text-sm opacity-75">{experience.title}</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<div class="md:w-3/4 bg-surface/50 p-6 rounded-lg">
			{#if experiences[selectedExperience]}
				<div class="mb-4">
					<h3 class="text-xl font-bold text-accent" style="font-family: 'Neue Montreal'">
						{experiences[selectedExperience].title}
					</h3>
					<h4 class="text-lg" style="font-family: 'Neue Montreal'">
						{experiences[selectedExperience].company}
					</h4>
					<div class="text-sm opacity-75 mb-4" style="font-family: 'Neue Montreal'">
						{formatMonthYear(experiences[selectedExperience].startDate)} - {experiences[selectedExperience].endDate ? formatMonthYear(experiences[selectedExperience].endDate) : m.experience_present()} 
						| {experiences[selectedExperience].location}
					</div>
				</div>
				<p class="text-md text-justify" style="font-family: 'Neue Montreal'">
					<PortableText
						value={experiences[selectedExperience].description}
						components={{ marks: { link: LinkMark } }}
					/>
				</p>
			{/if}
		</div>
	</div>
</section>
{/if}
