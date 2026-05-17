<h1 align="center"> 
	🚧  Meu Dinherim under development...  🚧
</h1>

Table of Contents
=================
<!--ts-->
   * [About](#About)
   * [Technologies](#Technologies)
   * [API](#API)
   * [License](#License)
<!--te-->

## About Meu Dinherim <a name="About"></a>

A simple financial system to manage personal expenses.
The layout of this project was based on Dashgo, a dashboard developed in the Ignite of RocketSeat. 

## API <a name="API"></a>
This project consumes the [MeuDinherim](https://github.com/rodrigosmig/new_meudinherim) API that was developed in PHP Laravel.

## Technologies 

* [React](https://pt-br.reactjs.org/E)
* [Next.js](https://nextjs.org/)
* [Chakra UI](https://chakra-ui.com/)
* [React-Query](https://react-query.tanstack.com/)
* [React Hook Form](https://react-hook-form.com/)

## License <a name="License"></a>

The Meu Dinherim  is free software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Debugging (VS Code)

Steps to debug client and server code with VS Code:

- Start the dev server with the Node inspector enabled:

```bash
pnpm run dev:inspect
```

- Open the Run and Debug view in VS Code and choose one of the configurations added in `.vscode/launch.json`:
   - `Attach to Next.js (Server)` — attach to the Node process (server-side, API routes, SSR).
   - `Launch Chrome (Client)` — launches Chrome and enables breakpoints in React components (client-side).
   - `Dev: Client + Server` — compound that attaches both.

- Notes:
   - On macOS/Linux the `dev:inspect` script sets `NODE_OPTIONS=--inspect` before running `next dev`.
   - If you prefer to attach to an already-open Chrome, start Chrome with `--remote-debugging-port=9222` and switch the Chrome config to `request: "attach"`.
