module.exports = {
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/fileMock.js"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/components/**/*.tsx",
    "src/redux/actions/*.tsx",
    "src/redux/reducers/auth.tsx",
    "src/redux/reducers/utils.tsx",
    "src/redux/sagas/*.tsx",
    "src/utils/*.tsx",
    "src/hooks/*.tsx",
    "src/models/baseEntities.tsx",
    "src/messages/messages.tsx",
    "src/api.tsx",
    "src/config/index.tsx",
    "src/components/onlyWith.tsx",
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coveragePathIgnorePatterns: [
    '/node_modules/',   // Exclude the 'node_modules' folder
    '/src/screens',
    '/src/hooks/pagination',
    '/src/utils/importUtils'
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\]+$",
    "^.+\\.svg$"
  ],
};