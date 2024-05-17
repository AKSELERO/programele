import PushNotification from 'react-native-push-notification';
import { format } from 'date-fns'; 
import { load, save } from './storage/storage';

interface DataEntry {
    content: string;
    date: string;
  }

// function checkIfToday(entry: DataEntry): boolean {
//     const currentDate = new Date();
//     const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd'); // Format today's date as "YYYY-MM-DD"
//     const entryDateOnly = entry.date.split(' ')[0]; // Extract only the date part from "YYYY-MM-DD HH:mm:ss"
  
//     return entryDateOnly === formattedCurrentDate;
//   }

// Function to create a local notification
const sendTooMuchSittingNotification = async () => {
    const todaySitCountNotInterupted = Number((await load('todaySitCountNotInterupted')) || 0);
    if (todaySitCountNotInterupted / 4 >= 3){
        PushNotification.localNotification({
            channelId: "reminder",
            title: "Metas Pajudėti!", // Title of the notification
            message: Math.floor(todaySitCountNotInterupted / 4) + " minutes praleidote sėdėdami", // Message in the notification
            playSound: true, // Sound to play on receipt of notification
            soundName: "default", // Sound file name to play; use 'default' to play the default notification sound
            vibration: 300, // Vibration duration in milliseconds, null to disable
          });
    }
};

const sendWalkingGoalNotification = async () => {
    var todayWalkCount = Number((await load('todayWalkCount')) || 0);
    const walkGoal = 30
    if (walkGoal > todayWalkCount / 4){
        PushNotification.localNotification({
          channelId: "your-channel-id",
          title: "Nepasiduokite ant savo tikslo", // Title of the notification
          message: "Iki pasiekto tikslo jums dar trūksta " + Math.floor(walkGoal-(todayWalkCount / 4)) + " minučių ėjimo", // Message in the notification
          playSound: true, // Sound to play on receipt of notification
          soundName: "default", // Sound file name to play; use 'default' to play the default notification sound
          vibration: 300, // Vibration duration in milliseconds, null to disable
        });
    }

};

// Function to configure push notifications
const configurePushNotifications = () => {
//   PushNotification.configure({
//     onNotification: function (notification) {
//       console.log("NOTIFICATION:", notification);
//     },
//     popInitialNotification: true,
//     requestPermissions: true,
//   });
    PushNotification.createChannel(
        {
        channelId: "reminder", // Replace 'your-channel-id' with your channel ID
        channelName: "reminder channel", // Replace 'Your Channel Name' with the name of your channel
        channelDescription: "channel for reminders", // Optional
        soundName: "default", // Optional
        importance: 4, // Default is 4
        vibrate: true, // Default is true
        },
        (created) => console.log(`CreateChannereminder returned '${created}'`) // Optional callback returns whether the channel was created successfully
    );
};

// Function to start the notification interval
const startNotificationInterval = () => {
  configurePushNotifications();

  // Set the interval to send notification every 15 minutes (900,000 milliseconds)
  setInterval(() => {
    sendTooMuchSittingNotification();
  }, 180000);
  setInterval(() => {
    sendWalkingGoalNotification();
  }, 180000);
};

// Export the function to be used elsewhere in the app
export default startNotificationInterval;