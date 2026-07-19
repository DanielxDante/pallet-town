import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'

const devOnlyPlugins = [visionTool()]

export const supportedLanguages = [
  {id: 'en', title: 'English'},
  {id: 'zh', title: '中文'},
]

export default defineConfig({
  name: 'default',
  title: 'pallet-town',

  projectId: 'eo8124xo',
  dataset: 'production',

  plugins: [
    structureTool(),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: ['experience'],
    }),
    ...(isDev ? devOnlyPlugins : []),
  ],

  schema: {
    types: schemaTypes,
  },
})
