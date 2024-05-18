import PushNotification from 'react-native-push-notification';
import { format } from 'date-fns'; 
import { load, save } from './storage/storage';

interface Goal {
  id: number
  name: string
  bendratis: string
  enabled: boolean
  timeFrame?: number // Hours
  moreThan?: boolean // Is the goal less than or more than specified hours
  goalHours?: number // Goal, specified in hours
}

interface DataEntry {
    content: string;
    date: string;
}
  interface Setting {
    id: number,
    name: string,
    description?: string,
    isTurnedOn: boolean
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
    const goals = await load("goals") as  Goal[];
    var walkGoal = goals[0].goalHours as number;
    walkGoal = walkGoal * 60
    //const isGoalDone = Boolean(await load('todayWalkGoal'))
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

const sendWalkingGoalDoneNotification = async () => {
  var todayWalkCount = Number((await load('todayWalkCount')) || 0);
  
  const isGoalDone = Boolean(await load('todayWalkGoal'))
  const goals = await load("goals") as  Goal[];
  var walkGoal = goals[0].goalHours as number;
  walkGoal = walkGoal * 60
  if (walkGoal <= todayWalkCount / 4 && !isGoalDone){
      PushNotification.localNotification({
        channelId: "your-channel-id",
        title: "Sveikiname", // Title of the notification
        message: "Šiandienos Vaikščiojimo tikslas pasiektas", // Message in the notification
        playSound: true, // Sound to play on receipt of notification
        soundName: "default", // Sound file name to play; use 'default' to play the default notification sound
        vibration: 300, // Vibration duration in milliseconds, null to disable
      });
      await save('todayWalkGoal', true);
  }

};

const sendDailyStatisticsNotification = async () => {
  const todaySitCount = Number((await load('todaySitCount')) || 0);
  const todayStandCount = Number((await load('todayStandCount')) || 0);
  const todayWalkCount = Number((await load('todayWalkCount')) || 0);
  const todayRunCount = Number((await load('todayRunCount')) || 0);
  const todayLayCount = Number((await load('todayLayCount')) || 0);
  const total = todaySitCount + todayStandCount + todayWalkCount + todayRunCount + todayLayCount;
  if (total != 0) {
    PushNotification.localNotification({
      channelId: "your-channel-id",
      title: "Šiandienos statistika", // Title of the notification
      message: "Sėdėjote - " + (todaySitCount*100/total).toFixed(2) + " %, Stovėjote - "  + (todayStandCount*100/total).toFixed(2) + " %, Vaikščiojote - "
      + (todayWalkCount*100/total).toFixed(2) + " %, Bėgote - " +  (todayRunCount*100/total).toFixed(2) +  " %, Gulėjote - " +  (todayLayCount*100/total).toFixed(2) +  " %",// Message in the notification
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
const startNotificationInterval = async () => {
  configurePushNotifications();
  
  // Set the interval to send notification every 15 minutes (900,000 milliseconds)
  setInterval(async () =>  {
    const settings = await load("settings") as Setting[];
    if (settings[0].isTurnedOn == true && settings[4].isTurnedOn == true){
      sendTooMuchSittingNotification();
    }
    
  }, 180000);
  setInterval(async () => {
    const settings = await load("settings") as Setting[];
    if (settings[0].isTurnedOn == true && settings[2].isTurnedOn == true){
      sendWalkingGoalNotification();
    }
  }, 180000);
  // setInterval(async () => {
  //   const settings = await load("settings") as Setting[];
  //   if (settings[0].isTurnedOn == true && settings[3].isTurnedOn == true){
  //     sendWalkingGoalDoneNotification();
  //   }
  // }, 180000);
  setInterval(async () => {
    const settings = await load("settings") as Setting[];
    if (settings[0].isTurnedOn == true && settings[1].isTurnedOn == true){
      sendDailyStatisticsNotification();
    }
  }, 180000);
};

// Export the function to be used elsewhere in the app
export default startNotificationInterval;