#!/usr/bin/env node

import { Command } from 'commander';
import * as dotenv from 'dotenv';

import * as fs from 'fs';
import * as path from 'path';

import { bootstrap } from './bootstrap';

const program = new Command();

const defaultConfig = `
# Default configuration for OAR Hub

# Server settings
GLOBAL_PREFIX=v1
API_HOST=IP_ADDRESS
API_PREFIX=api
API_PORT=3050
API_GATEWAY_PORT=3051
SWAGGER_PREFIX=swagger
APP_NAME=OAR Hub

# CORS settings
CORS_ORIGINS=*

# Redis settings
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
`;

function loadEnv(configPath: string | null) {
  if (configPath) {
    dotenv.config({ path: configPath });
  } else {
    // Set default environment variables
    process.env.GLOBAL_PREFIX = 'v1';
    process.env.API_HOST = 'localhost';
    process.env.API_PREFIX = 'api';
    process.env.API_PORT = '3050';
    process.env.API_GATEWAY_PORT = '3051';
    process.env.SWAGGER_PREFIX = 'swagger';
    process.env.APP_NAME = 'OAR Hub';
    process.env.CORS_ORIGINS = '*';
    process.env.REDIS_HOST = 'localhost';
    process.env.REDIS_PORT = '6379';
    process.env.REDIS_PASSWORD = '';
  }
}

program.version('1.0.0').description('OAR Hub CLI');

// Command to start the server
program
  .command('start')
  .description('Start the OAR Hub server')
  .option('-c, --config <path>', 'set config path', './config.env')
  .action((options) => {
    const configPath = path.resolve(process.cwd(), options.config);
    loadEnv(configPath);
    bootstrap(); // Call the bootstrap function from bootstrap.ts
  });

// Command to generate the default config.env file
program
  .command('config-gen')
  .description('Generate a default config.env file')
  .option('-o, --output <path>', 'output path for the config file', './config.env')
  .action((options) => {
    const outputPath = path.resolve(process.cwd(), options.output);
    if (fs.existsSync(outputPath)) {
      console.error(`File ${outputPath} already exists. Aborting.`);
      process.exit(1);
    }
    fs.writeFileSync(outputPath, defaultConfig.trim());
    console.log(`Default config file created at ${outputPath}`);
  });

program.parse(process.argv);
