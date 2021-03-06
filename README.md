# News API - Reader

## Introduction

This is aimed to be a multi-platform reader for the content available on https://newsapi.org <br>
The application is built using Electron and React.

## Prerequisites for running/building from repository files

1. NodeJs
2. npm
3. ReactJs
4. Electron

## Instructions

1. To Build
        * Run `npm preelectron-pack` and then `npm electron-pack`
        * the runner files will be available in the `/dist` directory
2. To Run
        * Run `npm electron-dev`
        * the application will run in a separate window as well as be available @ http://localhost:3000

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm electron-start`

Runs the Electron app in the development mode.<br>
The page will reload if you make edits.

### `npm electron-dev`

Runs the Electron app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the browser console.

### `npm preelectron-pack`

Compile the React application and its dependencies.<br>
The build is minified and the filenames include the hashes.

### `npm electron-pack`

Builds the Electron app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

Your app is ready to be deployed!