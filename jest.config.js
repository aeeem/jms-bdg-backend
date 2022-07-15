module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    "^@database(.*)$": "<rootDir>/src/database$1",
    "^@entity(.*)$": "<rootDir>/src/database/entity$1",
  }
};