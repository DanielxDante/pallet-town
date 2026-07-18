import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const devOnlyPlugins = [visionTool()]

export default defineConfig({
  name: 'default',
  title: 'pallet-town',

  projectId: 'eo8124xo',
  dataset: 'production',

  plugins: [structureTool(), ...(isDev ? devOnlyPlugins : [])],

  schema: {
    types: schemaTypes,
  },
})
