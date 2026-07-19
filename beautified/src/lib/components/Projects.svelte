<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	const projects = $derived([
		{
			title: m.project_justtravel_title(),
			description: m.project_justtravel_description(),
			technologies: ['NextJS', 'Flask', 'AWS', 'Prompt Engineering'],
			image: '/justtravel.jpg'
		},
		{
			title: m.project_naviloo_title(),
			description: m.project_naviloo_description(),
			technologies: ['NextJS', 'Django', 'Vercel'],
			image: '/naviloo.gif'
		},
		{
			title: m.project_success_sculptors_title(),
			description: m.project_success_sculptors_description(),
			technologies: ['NextJS', 'Django', 'Vercel'],
			image: '/success_sculptors.jpg'
		}
	]);
</script>

{#if projects.length > 0}
<section id="projects" class="scroll-mt-16 flex flex-col items-center justify-center h-full py-10 border-b-2 border-dashed border-line text-fg">
	<span class="text-xl font-bold border-b-4 border-surface-alt self-start" style="font-family: 'Neue Montreal'">
		{m.projects_heading()}
	</span>
	{#each projects as project, index (project.title)}
		{#if index > 0}
			<div class="w-[50%] my-5 h-px border-t-2 border-dotted"></div>
		{/if}
		<div class="py-3 text-center">
			<img src={project.image} alt={`${project.title} Home Page`} class="rounded-lg mb-2 w-[1000px] h-auto">
			<span class="text-lg" style="font-family: 'Neue Montreal'">
				{project.title}
			</span>
			<div class="flex flex-wrap justify-center">
				{#each project.technologies as tech (tech)}
					<div class="m-2 p-2 bg-surface rounded-md text-fg" style="font-family: 'Neue Montreal'">
						{tech}
					</div>
				{/each}
			</div>
			<p class="text-md" style="font-family: 'Neue Montreal'">
				{project.description}
			</p>
		</div>
	{/each}
</section>
{/if}
