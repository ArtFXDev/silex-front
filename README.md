# Silex front

![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white) ![](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

<img align="right" width="100" height="100" src="./src/assets/images/silex_logo.png">

Front-end application of the Silex ecosystem.

## Introduction

This project is built upon [React](https://reactjs.org/) / [TypeScript](https://www.typescriptlang.org/) and [Material UI](mui.com/) and talks with the CGWire [Zou](zou.cg-wire.com/) API in order to display and interact with the production data, launch dccs and manage scene versions.

We didn't want to rely on classical Qt interfaces in Python integrated in Houdini or Maya but leverage the power of the web through a user friendly and powerful frontend application.

## Installation

The package manager used is [Yarn](https://yarnpkg.com/). Clone the repository and install the dependencies:

```bash
$ git clone https://github.com/ArtFXDev/silex-front
$ cd silex-front
$ yarn install # Install the dependencies
```

Note that if you don't want to install the dev dependencies (including the linter, formatter, types...) you can use the `--production` argument to Yarn.

## Usage

### Available scripts

- 🚀 `yarn start` -> runs the [Webpack](https://webpack.js.org/configuration/dev-server/) development server with HMR (hot module replacement).

  You can then access the app on [`http://localhost:3000`](http://localhost:3000).

- 👷 `yarn build` -> builds and bundle the whole app in a `build` folder. It is used to host the static files on a web server like Nginx or Apache.

## Libraries

Here are the main libraries and packages used: 

| Library                                       | Version  |
| --------------------------------------------- | -------- |
| [Material UI](https://mui.com/)               | `5.0.0`  |
| [React](https://reactjs.org/)                 | `17.0.2` |
| [TypeScript](https://www.typescriptlang.org/) | `4.1.2`  |
| [socket.io-client](https://socket.io/)        | `4.2.0`  |
| [React router](reactrouter.com/)              | `5.3.0`  |



## Contributing

Pull requests and issues are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](./LICENSE.md) [@ArtFX](artfx.school/)