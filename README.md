# Silex front

![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white) ![](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![](https://img.shields.io/badge/ESLint-4b32c3?style=for-the-badge&logo=eslint&logoColor=white) ![](https://img.shields.io/badge/Prettier-c188c1?style=for-the-badge&logo=prettier&logoColor=white) ![](https://img.shields.io/badge/graphql-e535ab?style=for-the-badge&logo=GraphQL&logoColor=white)

<br>

<p align="center">
  <img width="700" src="./img/silex_front_capture_1.png">
  <br><br>
  Front-end application of the Silex ecosystem.<br>
</p>

<br>

## Introduction

This project is built upon [React](https://reactjs.org/) / [TypeScript](https://www.typescriptlang.org/) and [Material UI](https://mui.com/) and talks with the CGWire [Zou](https://zou.cg-wire.com/) API with [GraphQL](https://graphql.org/) in order to display and interact with the production data, launch dccs and manage scene versions.

We didn't want to rely on classical Qt interfaces in Python integrated in Houdini or Maya but leverage the power of the web through a user friendly and powerful frontend application.

## Installation

The package manager used is [Yarn](https://yarnpkg.com/). Clone the repository and install the dependencies:

```bash
$ git clone https://github.com/ArtFXDev/silex-front
$ cd silex-front
$ yarn install # Install the dependencies
```

## Usage

### Environment variables

Before starting the UI, make sure the variables defined in the [`.env`](.env) file are correct.

They are:

- `REACT_APP_ZOU_API` - the url of the Zou server (like `http://my-zou-server`). It's the same URL as the Kitsu app (since they are behind a Nginx proxy).

- `REACT_APP_WS_SERVER` - the url of the Silex websocket service running on the client machine (open on the port `5118`).

- `REACT_APP_TRACTOR_BLADE` - the url of the Pixar Tractor Blade service running on the computer.

- `REACT_APP_TRACTOR_URL` - url of the Tractor interface

- `REACT_APP_TRACTOR_LOG_URL` - Tractor log retrieval url (see: https://rmanwiki.pixar.com/display/TRA/Logging)

- `REACT_APP_TICKET_URL` - url of the Ticket system (we currently use [Zammad](https://zammad.com/))

### Available scripts

- 🚀 `yarn start` -> runs the [Webpack](https://webpack.js.org/configuration/dev-server/) development server with HMR (hot module replacement).

  You can then access the app on [`http://localhost:3000`](http://localhost:3000).

- 👷 `yarn build` -> builds and bundle the whole app in a `build` folder. It is used to host the static files on a web server like Nginx or Apache.

- 🔨 `yarn tsc` -> runs the TypeScript compiler and report errors. Add `:watch` to run an interactive process that watches file changes.

- 💅 `yarn prettify` -> prettify the code with Prettier. Add `:write` to write the modifications.

- 🚨 `yarn lint` -> shows ESLint warnings and errors. Add `:fix` to apply auto fixes.

## ⚠️ Issues

Currently, Silex uses the Zou API to authenticate the user against the database. For that we make a request to `/api/auth/login` and we receive headers with the [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) directive so that the token is sent again on future requests.

Recently the standards changed for the [`SameSite`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) attribute for cookies which restrict the usage to a first-party or same site context.

Previously if the `SameSite` value wasn't provided (it was not the case for Zou, see [this](https://github.com/cgwire/zou/issues/385)) cookies were sent all the time. This is the behavior of Electron and [our desktop app](https://github.com/ArtFXDev/silex-desktop) is concerned.

Since the Zou API is hosted on a different domain name than Silex, cookies must now have the `SameSite=None` value with the `Secure` attribute which allows the usage of the cookie on another domain but forces HTTPS which may not be ideal...

It also constrain the local development of the front-end since you need to setup https locally. Hopefully you can disable it in [Firefox](https://stackoverflow.com/questions/65130753/disable-samesite-cookie-policy-in-firefox-developer-edition) or [Chrome](https://stackoverflow.com/questions/59030096/how-to-disable-same-site-policy-in-chrome).

## Libraries

Here are the main libraries and packages used:

| Library                                                            | Version  |
| ------------------------------------------------------------------ | -------- |
| [Material UI](https://mui.com/)                                    | `5.0.0`  |
| [React](https://reactjs.org/)                                      | `17.0.2` |
| [TypeScript](https://www.typescriptlang.org/)                      | `4.1.2`  |
| [socket.io-client](https://socket.io/)                             | `4.2.0`  |
| [React router](reactrouter.com/)                                   | `5.3.0`  |
| [Apollo Client (React)](https://www.apollographql.com/docs/react/) | `3.4.15` |

## Special thanks

- [Karrik](http://karrik.phantom-foundry.com/) is a libre font created by Jean-Baptiste Morizot et Lucas Le Bihan. It is licensed under the [SIL Open Font License](http://scripts.sil.org/OFL), Version 1.1.

## Contributing

Pull requests and issues are welcome. For major changes, please open an issue first to discuss what you would like to change.

✨ This project uses the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention for commit messages. They are checked automatically with a git hook (thanks to [Husky](https://typicode.github.io/husky/#/) and [commitlint](https://github.com/conventional-changelog/commitlint)).

✅ There is also a `pre-commit` hook that will check and format your staged files with ESLint and Prettier. (thanks to [lint-staged](https://github.com/okonet/lint-staged))

## License

[MIT](./LICENSE.md) [@ArtFX](https://artfx.school/)
