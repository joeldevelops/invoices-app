module.exports = {
  roots: ['<rootDir>/test'],
  setupFiles: ['<rootDir>/test-setup.ts'],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**',
    '!<rootDir>/src/config.ts',
    '!<rootDir>/src/index.ts',
    '!<rootDir>/src/users/users.controller.ts',
    '!<rootDir>/src/invoices/invoices.controller.ts',
  ]
}