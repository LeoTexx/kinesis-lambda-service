import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	roots: ['<rootDir>/tests'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testRegex: '(/tests/(integration|unit)/.*|(\\.|/)(test|spec))\\.ts?$',
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	testRunner: 'jest-circus/runner',
	testEnvironment: 'node',
	testTimeout: 30 * 1000,
	verbose: true,
}

export default config
