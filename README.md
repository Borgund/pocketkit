# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Environment Variables

Create a `.env` file in the root directory of your project using the variables in the `.env.example` file


## Pocketbase
This starterkit requires you to have a running pocketbase instance, either [locally](https://pocketbase.io/docs/), on PaaS solution like [fly.io](https://github.com/pocketbase/pocketbase/discussions/537) or by using for instance [pockethost.io](https://pockethost.io/).