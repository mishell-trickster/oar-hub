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


### Docker compose
For now I don't have ready to use docker image, but you can use docker compose file inside this repository
```bash
git clone https://github.com/mishell-trickster/oar-hub.git
cd oar-hub
docker-compose up
```

docker-compose-yml contains 2 service and all needed environment variables, feel free to change something before start.