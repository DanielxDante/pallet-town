import { getExperiences } from '$lib/utils/SanityQueries';
import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
import { getLocale } from '$lib/paraglide/runtime';

injectAnalytics({ mode: dev ? 'development' : 'production' });

export async function load() {
  const locale = getLocale();
  const experiences = await getExperiences(locale);

  return {
    experiences
  };
}
