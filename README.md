# OAR Hub

OAR Hub is a NestJS-based application that can be run as a global CLI command. Used as a proxy server between chatGPT and any service with websocket support.

## Installation

To install OAR Hub globally, run:

```bash
npm install -g oar-hub
```

## Usage

### Global (RECOMMENDED)

**Recommended to generate the config file first, then run with the config file.** Although default config will be used if none is provided.

Generate the config file:

```bash
oar-hub config-gen -o /path/to/your/config.env
```

Then run with the config file (or without it, for default settings):

```bash
oar-hub start --config /path/to/your/config.env
```

### Local

For running from the source directory, you can run:

Generate the config file:

```bash
npm run cli -- config-gen -o /path/to/your/config.env
```

Run with the config file:

```bash
npm run cli -- start -c /path/to/your/config.env
```

### DEVELOPMENT (as server, not as CLI command)

Create a `.env` file with all config variables, then run:

```bash
npm run start:dev
```
