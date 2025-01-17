/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("./devtools/ReactotronConfig.ts")
}
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { useInitialRootStore } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ViewStyle } from "react-native"
import { startBackgroundService } from './utils/BackGroundTask'
// import SensorDataRecorder from './utils/ReadSensors'
import React, { useEffect } from 'react';
import {PermissionsAndroid, Platform, NativeModules } from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { startDataFetchingProcess } from './utils/ReadCSVEntries';
import startNotificationInterval from './utils/ScheduleNotifications';
import PushNotification from 'react-native-push-notification';

const { SensorService } = NativeModules;
const filePath = './combinedData.csv';

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")
const config = {
  screens: {
    Login: {
      path: "",
    },
    Welcome: "welcome",
    Demo: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        DemoDebug: "debug",
        DemoPodcastList: "podcast",
        DemoCommunity: "community",
      },
    },
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
function App(props: AppProps) {
  useEffect(() => {
    //SensorService.startService();
    // No cleanup action needed since you want it to run indefinitely
  }, []);
  useEffect(() => {
  //   PushNotification.createChannel(
  //     {
  //         channelId: "5", // replace with a suitable ID
  //         channelName: "5", // replace with a suitable name
  //         channelDescription: "5", // optional description
  //         playSound: false, // (optional) default: true
  //         soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //         importance: 4, // (optional) default: 4. Int value of the Android importance
  //         vibrate: true, // (optional) default: true. Creates vibration pattern for notifications.
  //     },
  //     (created) => console.log(`CreateChannel5 returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  //   );
  //   PushNotification.localNotificationSchedule({
  //     // your notification details
  //     message: "Hello! This is a scheduled notification message!",
  //     date: new Date(Date.now() + 10 * 1000), // Schedule for 5 seconds from now
  //     channelId: "5", // Make sure this matches the channel ID used during channel creation
  // });
    //SensorService.startService();
    // startBackgroundService().then(() => {
    //   console.log('Background service has been successfully started.');
    // }).catch((error) => {
    //   console.error('Failed to start background service:', error);
    // });
    const requestPermissionsAndStartService = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        console.log("permission requested");
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (result === RESULTS.GRANTED) {
          console.log("permission granted");
          SensorService.stopService();
          SensorService.startService();
          startDataFetchingProcess();
          startNotificationInterval();
          //initBackgroundFetch();
          //monitorCsvFile(filePath);
          // startBackgroundService().then(() => {
          //   console.log('Background service has been successfully started.');
          // }).catch((error) => {
          //   console.error('Failed to start background service:', error);
          // });   // Start the service after permission is granted
        } else {
          console.log('Permission denied');
        }
      } else {
        console.log("No need for permissions")
        SensorService.stopService();
        SensorService.startService();
        startDataFetchingProcess();
        startNotificationInterval();
        //initBackgroundFetch();
        //monitorCsvFile(filePath);
        // startBackgroundService().then(() => {
        //   console.log('Background service has been successfully started.');
        // }).catch((error) => {
        //   console.error('Failed to start background service:', error);
        // });  // Directly start the service for older versions
      }
    };
    
    requestPermissionsAndStartService();
  }, []);
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
    setTimeout(hideSplashScreen, 500)
  })

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <GestureHandlerRootView style={$container}>
        {/* {<SensorDataRecorder/>} */}
          <AppNavigator
            linking={linking}
            initialState={initialNavigationState}
            onStateChange={onNavigationStateChange}
          />
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
}
