import { createClient } from '@sanity/client';
import {
    PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET,
    PUBLIC_SANITY_API_VERSION,
    PUBLIC_SANITY_USE_CDN,
} from '$env/static/public';

const client = createClient({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: PUBLIC_SANITY_DATASET || 'production',
    apiVersion: PUBLIC_SANITY_API_VERSION || 'v2025-05-20',
    useCdn: PUBLIC_SANITY_USE_CDN === "true" || PUBLIC_SANITY_DATASET === 'production', // `false` if you want to ensure fresh data
    // token: process.env.SANITY_API_TOKEN, // Only for premium users
});

// GROQ Queries
const GET_EXPERIENCES_BY_LANG = `
    *[_type == "experience" && language == $lang] | order(startDate desc) {
        _id,
        title,
        company,
        location,
        startDate,
        endDate,
        description,
        language,
    }
`;

const DEFAULT_LANG = 'en';

/**
 * Get all experiences for a given locale.
 * Falls back to the default language ("en") when no localized documents exist.
 */
export async function getExperiences(lang: string = DEFAULT_LANG) {
    try {
        const experiences = await client.fetch(GET_EXPERIENCES_BY_LANG, { lang });
        if ((!experiences || experiences.length === 0) && lang !== DEFAULT_LANG) {
            return await client.fetch(GET_EXPERIENCES_BY_LANG, { lang: DEFAULT_LANG });
        }
        return experiences;
    } catch (error) {
        console.error('Error fetching experiences:', error);
        return null;
    }
}

// /**
//  * Fetch documents by type with pagination
//  */
// export async function getDocumentsByType(type, { limit = 100, offset = 0, order = '_createdAt desc' } = {}) {
//     const query = `*[_type == $type] | order(${order}) [${offset}...${offset + limit}]`;
//     return client.fetch(query, { type });
// }

// /**
//  * Fetch documents with a custom GROQ query
//  */
// export async function customQuery(query, params = {}) {
//     return client.fetch(query, params);
// }

// /**
//  * Search for documents across specified types
//  */
// export async function searchDocuments(searchTerm, types = [], { limit = 10 } = {}) {
//     const typeFilter = types.length > 0 ? `&& _type in $types` : '';
    
//     const query = `*[
//         (title match $searchTerm || description match $searchTerm)
//         ${typeFilter}
//     ][0...${limit}]`;
    
//     return client.fetch(query, { 
//         searchTerm: `*${searchTerm}*`,
//         types
//     });
// }

// /**
//  * Fetch documents with filters
//  */
// export async function getFilteredDocuments(type, filter = {}, { limit = 100, offset = 0 } = {}) {
//     // Convert filter object to GROQ filter string
//     const filterString = Object.entries(filter)
//         .map(([key, value]) => {
//             if (typeof value === 'string') {
//                 return `${key} == "${value}"`;
//             }
//             return `${key} == ${value}`;
//         })
//         .join(' && ');
    
//     const filterQuery = filterString ? ` && ${filterString}` : '';
//     const query = `*[_type == $type${filterQuery}][${offset}...${offset + limit}]`;
    
//     return client.fetch(query, { type });
// }

// /**
//  * Fetch documents with expanded references
//  */
// export async function getDocumentsWithExpandedRefs(type, expandFields = []) {
//     const expansions = expandFields
//         .map(field => `"${field}": ${field}->`)
//         .join(', ');
    
//     const query = `*[_type == $type]{
//         ...,
//         ${expansions}
//     }`;
    
//     return client.fetch(query, { type });
// }