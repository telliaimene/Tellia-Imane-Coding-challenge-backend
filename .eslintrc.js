module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': 0,
    camelcase: ['error', { allow: ['is_connected', 'purchase_trends', 'top_selling', 'credit_card_number', 'credit_card_expiry_date', 'credit_card_type'] }],
    'no-unused-vars': ['warn', { varsIgnorePattern: 'Category' }]

  }
}
