module.exports = {
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    },
    env: {
        node: true,
        browser: true,
        es6: true
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 1
    }
}
