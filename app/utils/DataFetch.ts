// import BackgroundFetch from "react-native-background-fetch";
// import { startDataFetchingProcess } from './ReadCSVEntries';  // Adjust the path as needed

// // Function to initialize background fetching
// export function initBackgroundFetch() {
//     console.log(BackgroundFetch);
//     BackgroundFetch.configure({
//         minimumFetchInterval: 15, // <-- Fetch interval in minutes (15 is the minimum allowed)
//         stopOnTerminate: false,   // Set to false to continue running after app termination
//         startOnBoot: true,        // Set to true to restart background tasks on boot
//         requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default is NETWORK_TYPE_NONE which means no restriction
//     }, async (taskId) => {
//         console.log('[BackgroundFetch] task: ', taskId);

//         // Call your data fetching function here
//         startDataFetchingProcess();

//         // When your task is complete, you must call finish to signal completion
//         BackgroundFetch.finish(taskId);
//     }, (error) => {
//         console.log('[BackgroundFetch] failed to start:', error);
//     });

//     // Check the status of background fetch permission
//     BackgroundFetch.status((status) => {
//         switch(status) {
//             case BackgroundFetch.STATUS_RESTRICTED:
//                 console.log("Background fetch restricted");
//                 break;
//             case BackgroundFetch.STATUS_DENIED:
//                 console.log("Background fetch denied");
//                 break;
//             case BackgroundFetch.STATUS_AVAILABLE:
//                 console.log("Background fetch is enabled");
//                 break;
//         }
//     });
// }


