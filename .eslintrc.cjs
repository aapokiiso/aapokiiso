module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
  ],
  rules: {
    // Avoid unnecessary diffs when adding items to multiline arrays or objects
    'comma-dangle': ['error', 'always-multiline'],
  },
}
