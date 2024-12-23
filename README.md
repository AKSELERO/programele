# Setup
1. git clone https://github.com/AKSELERO/programele.git
2. npm install (turbūt)
3. npm start / npm run android

# Building
1. cd android
2. ./gradlew assembleRelease
3. Output: `android/app/build/outputs/apk/release/app-release.apk`

"Make sure you have Android Studio installed on your machine. This includes the necessary Android SDK and build tools."

# Overview

<p align="center">
  <img src="https://github.com/user-attachments/assets/87147308-73ae-4804-8f46-f142be03e99b" alt="Glim Overview" width="300"/>
</p>

**Glim** is a wellness app that allows users to track their activity using sensors on their phone.

<p align="center">
  <img src="https://github.com/user-attachments/assets/50d3b2f3-b93f-4202-9ddd-7128d29206a0" alt="Goals Selection" width="300"/>
</p>

Users can select what goals they'd like to have and their types with a handy selection menu.

<p align="center">
  <img src="https://github.com/user-attachments/assets/8b6a0ccd-058c-4ee9-9ddb-fbf85fdc14eb" alt="AI Model Analysis" width="300"/>
</p>

After using the app for a while, the data collected by your phone sensors is sent directly to a custom AI model running locally on your phone. This allows you to analyse your overall activity levels - all without any of your private data leaving your phone.

<p align="center">
  <img src="https://github.com/user-attachments/assets/b1dbeb3a-b20a-4b4a-98ec-a117ad4dcb04" alt="Activity Recommendations" width="300"/>
</p>

Finally, users may also read concrete recommendations about each activity type and how they may improve their overall health.

<p align="center">
  <img src="https://github.com/user-attachments/assets/2ee1374f-2aca-4e75-8c6a-e160a2a7e30f" alt="Notifications Settings" width="300"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/63098b1a-667c-49d5-a6fb-f8cce5b2c3b3" alt="Notifications Settings" width="300"/>
</p>

Users may also tweak the notifications they'd like to receive.

<p align="center">
  <img src="https://github.com/user-attachments/assets/704314be-9719-47ef-baa9-d495ec1e9e7a" alt="Notifications Settings" width="300"/>
</p>

# Boilerplate fluff

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our React Native stack.

Currently includes:

- React Native
- React Navigation
- MobX State Tree
- TypeScript
- And more!

## Quick Start

The Ignite boilerplate project's structure will look similar to this:

```
ignite-project
├── app
│   ├── components
│   ├── config
│   ├── i18n
│   ├── models
│   ├── navigators
│   ├── screens
│   ├── services
│   ├── theme
│   ├── utils
│   └── app.tsx
├── assets
│   ├── icons
│   └── images
├── test
│   ├── __snapshots__
│   ├── mockFile.ts
│   └── setup.ts
├── README.md
├── android
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── keystores
│   └── settings.gradle
├── ignite
│   └── templates
|       |── app-icon
│       ├── component
│       ├── model
│       ├── navigator
│       └── screen
├── index.js
├── ios
│   ├── IgniteProject
│   ├── IgniteProject-tvOS
│   ├── IgniteProject-tvOSTests
│   ├── IgniteProject.xcodeproj
│   └── IgniteProjectTests
├── .env
└── package.json

```

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the `app` directory looks similar to the following:

```
app
├── components
├── config
├── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
└── app.tsx
```

**components**
This is where your reusable components live which help you build your screens.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigators**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truly shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application.

### ./assets directory

This directory is designed to organize and store various assets, making it easy for you to manage and use them in your application. The assets are further categorized into subdirectories, including `icons` and `images`:

```
assets
├── icons
└── images
```

**icons**
This is where your icon assets will live. These icons can be used for buttons, navigation elements, or any other UI components. The recommended format for icons is PNG, but other formats can be used as well.

Ignite comes with a built-in `Icon` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md).

**images**
This is where your images will live, such as background images, logos, or any other graphics. You can use various formats such as PNG, JPEG, or GIF for your images.

Another valuable built-in component within Ignite is the `AutoImage` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/Components-AutoImage.md).

How to use your `icon` or `image` assets:

```
import { Image } from 'react-native';

const MyComponent = () => {
  return (
    <Image source={require('../assets/images/my_image.png')} />
  );
};
```

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find templates you can customize to help you get started with React Native.

### ./test directory

This directory will hold your Jest configs and mocks.

## Running Maestro end-to-end tests

Follow our [Maestro Setup](https://ignitecookbook.com/docs/recipes/MaestroSetup) recipe from the [Ignite Cookbook](https://ignitecookbook.com/)!

## Previous Boilerplates

- [2018 aka Bowser](https://github.com/infinitered/ignite-bowser)
- [2017 aka Andross](https://github.com/infinitered/ignite-andross)
- [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)
