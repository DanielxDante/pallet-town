import {
    getExperiences
} from '$lib/utils/SanityQueries.';

export async function load() {
  const experiences = await getExperiences();

  return {
    "experiences": experiences
  };
}