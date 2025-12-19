export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of the following
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'build', // Build system or external dependencies
        'ci', // CI/CD changes
        'chore', // Other changes that don't modify src or test files
        'revert', // Revert a previous commit
      ],
    ],

    // Type case
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // Scope
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [0], // Scope is optional

    // Subject
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 100],
    'subject-min-length': [2, 'always', 10],

    // Header
    'header-max-length': [2, 'always', 100],
    'header-min-length': [2, 'always', 15],

    // Body
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 200],

    // Footer
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 200],
  },

  // Ignore merge commits, revert commits, and dependency updates
  ignores: [
    (commit) => commit.includes('Merge'),
    (commit) => commit.includes('Revert'),
    (commit) => commit.startsWith('chore(deps)'),
    (commit) => commit.startsWith('chore(deps-dev)'),
  ],

  // Help URL for when validation fails
  helpUrl:
    'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
};
