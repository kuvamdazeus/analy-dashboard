# Analy Dashboard

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

### Quicklinks

- [T3 Docs](https://create.t3.gg/)
- [tRPC Docs](https://trpc.io)
- [NPM package (analy)](https://www.npmjs.com/package/analy)
- [Github repo (analy)](https://github.com/kuvamdazeus/analy)

## Development

To run the app locally, make sure your project's local dependencies are installed:

```sh
yarn
```

Afterwards, start the Remix development server like so:

```sh
yarn dev
```

Lastly, set up `.env` file for the project:

```python
DATABASE_URL = "mysql://root:admin@127.0.0.1:3307/analy"

GH_CLIENT_SECRET = "<gh-client-secret-here>"

COOKIE_SECRET = "some random string..."
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!
