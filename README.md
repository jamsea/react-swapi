<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Running the Project](#running-the-project)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
    - [`npm run eject`](#npm-run-eject)
  - [Learn More](#learn-more)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# react-swapi (Star Wars API)

[Click here to see the project running live](https://jamsea.github.io/react-swapi/index.html)

This was worked on over the course of a few evenings to test out some new React features. I heavily leaned on Create React App to get the infrastructure set up. Instructions on how to run the project locally can be found below.

## Overview

This project was made to test out the new [React Hooks feature](https://reactjs.org/docs/hooks-intro.html) which is why some of the code might look like a little overkill in App.tsx. Hooks allow you to use features normally reserved for class components in React in functions. I usually lean towards functional programming (I'm a huge fan of [elm](https://elm-lang.org/)) when creating web applications because they're generally easier to test.

## Cool Features

- 100% Typescript :tada:
- Leverages [CSS modules](https://github.com/css-modules/css-modules) which guarantees no weird CSS conflicts between components.
- Uses service workers to cache assets for blazing fast return load times.

## Things I'd Change

Right now this is a single page app, the next step would be to set up something like [Next.js](https://nextjs.org) to enable server side rendering. Server side rendering not only increases performance, but is essential for SEO. Google's web crawler has gotten better at scraping single page apps but it's still not perfect. Facebook's bot does a terrible job. Facebook can (and will) prevent you from buying Facebook ads to a page if it determines that you have too little content.

Next, the time to first byte on the Star Wars API call is awful. It'll often take 0.5s for data to come back from their server. This makes the user experience a little clunky if a user tries to use the drop down box before the API call finishes. Server side rendering would help this a little, but could potentially cause _our_ response from the server to slow down. Setting up a CDN in front of the origin domain would not only fix the performance issue, but could set up to serve last known good. That way if we ever accidentally shipped a version of this project that was throwing 500s or 404s, our user would get the old, working, version served to them.

I have a service worker setup that caches all of the app's assets, allowing it to load _super_ fast on repeat visit, and allowing users to add it to their phone's homescreens. I'd want to _also_ use the service worker to cache any API calls to the Star Wars API server, allowing it to work 100% offline after it's first load.

Finally the [integration test I wrote](https://github.com/jamsea/react-swapi/blob/0ebcf6973d36ae4ba758ad62ae4e3b249c528176/src/App.test.tsx#L22) is way too slow. I was having trouble getting the mock working for `fetch`, so it sends a real network request out while being tested, which is potentially flakey and slow.

# Running the Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
