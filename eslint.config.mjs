import { ESLint } from 'eslint';
import stylisticPluginJs from '@stylistic/eslint-plugin-js';
import babelParser from '@babel/eslint-parser';
import stylisticPluginTs from '@stylistic/eslint-plugin-ts';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const baseRules = {
	'object-curly-newline': 'off',
	'padding-line-between-statements': [
		'error',
		{
			blankLine: 'always',
			prev: '*',
			next: 'return'
		},
	],
	'no-whitespace-before-property': 'error',
	'@stylistic/indent': ['error', 'tab', {
		'SwitchCase': 1,
		'FunctionExpression': {
			'parameters': 1,
			'body': 1
		},
		'MemberExpression': 1,
		'offsetTernaryExpressions': true
	}],
	'@stylistic/quotes': [
		'error',
		'single'
	],
	'@stylistic/space-in-parens': 'off',
	'@stylistic/array-bracket-spacing': 'off',
	'@stylistic/object-curly-spacing': [
		'error',
		'always'
	],
	'@stylistic/computed-property-spacing': 'off',
	'@stylistic/space-before-function-paren': 'off',
	'@stylistic/no-nested-ternary': 'off',
	'@stylistic/space-unary-ops': 'off',
	'@stylistic/semi': [
		'warn',
		'always'
	],
	'@stylistic/brace-style': [
		'warn',
		'stroustrup',
		{
			'allowSingleLine': false
		}
	],
	'max-len': [
		'warn',
		{
			'comments': 160,
			'code': 160,
			'tabWidth': 4
		}
	],
	'no-multiple-empty-lines': [
		'error',
		{
			'max': 2,
			'maxEOF': 1,
			'maxBOF': 0
		}
	],
	'block-spacing': 'error',
	'@stylistic/object-curly-newline': ['error', {
		ObjectExpression: { multiline: true, minProperties: 4 }, // object literals
		ObjectPattern: 'never', // destructuring
		ImportDeclaration: { multiline: true, minProperties: 8 },
		ExportDeclaration: { multiline: true },
	}]
};

export default [
	{
		ignores: ['node_modules/**', '**/*.min.js', '**/*.dist.js'],
	},
	{
		files: ['./**/*.js'],
		languageOptions: {
			parser: babelParser,
			parserOptions: {
				requireConfigFile: false,
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@stylistic': stylisticPluginJs
		},
		rules: {
			...baseRules
		}
	},
	{
		files: ['./**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			'@stylistic': stylisticPluginTs
		},
		rules: {
			...baseRules,
			'@stylistic/object-curly-newline': ['error', {
				ObjectExpression: { multiline: true, minProperties: 4 }, // object literals
				ObjectPattern: 'never', // destructuring
				ImportDeclaration: { multiline: true, minProperties: 8 },
				ExportDeclaration: { multiline: true },
			}]
		}
	},
	{
		files: ['./src/**/*.stories.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			'@stylistic': stylisticPluginTs
		},
		rules: {
			...baseRules,
			'@stylistic/object-curly-newline': 'off'
		}
	}
];
