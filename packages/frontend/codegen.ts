import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../recipe-service/src/application/api/recipes/recipes-schema.graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/shared/api/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        enumsAsTypes: true,
        skipTypename: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
        },
      },
    },
  },
};

export default config;
