import process from 'node:process'
import AdapterNode from '@sveltejs/adapter-node';
import AdpaterVercel from '@sveltejs/adapter-vercel';

export const nodeAdapter = process.env.NODE_ADAPTER === 'true'

export const adapter = nodeAdapter ? AdapterNode() : AdpaterVercel()
