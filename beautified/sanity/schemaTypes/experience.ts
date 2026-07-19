import { defineField, defineType } from 'sanity'

export const experience = defineType({
    name: 'experience',
    title: 'Experience',
    type: 'document',
    fields: [
        defineField({
            name: 'language',
            type: 'string',
            readOnly: true,
            hidden: true,
        }),
        defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'company',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'location',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
            options: {
                dateFormat: 'YYYY-MM'
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'date',
            description: 'Leave blank if this is your current role (will display as "Present").',
            options: {
                dateFormat: 'YYYY-MM'
            },
        }),
        defineField({
            name: 'description',
            type: 'array',
            of: [{type: 'block'}],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
            readOnly: true,
            validation: (rule) => rule.required(),
        }),
  ],
})
