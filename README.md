# Welcome to bPanel!

This is the official repo for the bPanel project,
a full featured, enterprise level GUI for your Bcoin Bitcoin node.

## Setup Your Environment With Docker
This is primarily a setup for development purposes
(though it could be used in production with some modification).

To spin up your webapp, server, a bcoin node on regtest, and generate
50 regtest BTC for your primary wallet, clone & navigate to this repo then:
1. Run `npm run postinstall` to create a secrets.env file.
2. Run `docker-compose up -d` (add `--build` if you install more dependencies)
3. Navigate to http://localhost:5000 to see your webapp.
Requests to `\node` will get get forwarded to your bcoin node.

#### For Local Development
If you have an existing node you want to connect to, [update the configuration](#configuration) and run:

```bash
npm run local:dev
```

Note that if you have some plugins or themes being loaded, webpack needs to build twice and there will be some errors between the two.

## Configuration
Configurations are shared between the two docker containers.

Your bcoin node will expect an API key given to it. If you did not run `npm run postinstall` to generate one, or you are connecting to an existing node, you can set an API key by setting it in a `secrets.env` file and set `BCOIN_API_KEY=[YOUR-AWESOME-KEY]`. This key can be any value you want (but if you are running a node with real Bitcoins, make sure it's secure!). __NOTE: DO NOT CHECK THIS FILE IN TO VERSION CONTROL.__

The configs are managed through environment variables set in a `bcoin.env` file (this is not ignored by git, so make sure to only put sensitive information in the `secrets.env` file). These get used by both the app and bcoin containers.

Make sure to comment out the environment variables according to the network
you want your webapp to connect to and/or what kind of node you want to run if you're running the bcoin service.

If you want to connect to an existing node on a remote server, update the environment configs to point to your remote node. To deploy in a docker container run:

```bash
docker-compose up app
```

Otherwise, for local development, run
```bash
npm run local:dev
```


### Setup Scripts
Setup scripts are also supported. This will allow you to run scripts on your
node for a repeatable and predictable environment for testing or development.

Three circumstances need to be met to run a script:
1. There needs to be a js file to run in the `scripts` directory that exports a function to run
2. You need to pass the name of this file (including the extension)
as an environment variable named `BCOIN_INIT_SCRIPT` in the docker-compose
3. There should be no walletdb in the container.
This makes sure that a setup script doesn't overwrite your data
if you're mapping volumes or if you restart a container.

These checks are done in the `docker-bcoin-init.js` which sets up a node
based on the configs described above.
Setup scripts will also be passed the bcoin node object that has been created.

### Persistent DBs
To persist your bcoin node information (and skip the setup if the walletdb is persisted),
uncomment and edit the volumes in the bcoin service.
This could be useful if you're working on testnet or mainnet and don't want
to wait for a full sync to happen every time you create a new container.

## Setup without Docker
If you'd rather not use docker to run your environment,
you need to add a `./configs/bcoin.config.json` file with the
configuration setup for the bcoin node you'd like to connect to
(you can use the docker-compose.yml environment variables
that are prefaced with `BCOIN_` for a template.

Then, run `npm run start` to start the server.

## License

- Copyright (c) 2017, The Bcoin Devs (MIT License).
