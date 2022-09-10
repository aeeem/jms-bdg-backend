module.exports = {
  roots                  : ['./src'],
  preset                 : 'ts-jest',
  testEnvironment        : 'node',
  transform              : { '^.+\\.ts?$': 'ts-jest' },
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  moduleDirectories      : ['node_modules', 'src'],
  moduleNameMapper       : {
    '^src/(.*)$'     : '<rootDir>/src/$1',
    '^@database(.*)$': '<rootDir>/src/database$1',
    '^@entity(.*)$'  : '<rootDir>/src/database/entity$1'
  }
}
