import { getExperiences } from '$lib/utils/SanityQueries';
import { getLocale } from '$lib/paraglide/runtime';

export async function load() {
  const locale = getLocale();
  const experiences = await getExperiences(locale);

  return {
    experiences
  };
}
