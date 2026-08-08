import path from 'path';
import { fileURLToPath } from 'url';

export default {
	testEnvironment: '@happy-dom/jest-environment',
	injectGlobals: true,
	extensionsToTreatAsEsm: ['.ts'],
	transform: {
		'^.+\\.(ts|js)$': ['ts-jest', {
			tsconfig: './tsconfig.test.json',
			useESM: true,
		}],
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	coveragePathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/tests/',
	],
};
