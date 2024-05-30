import PushNotification from 'react-native-push-notification';
import { format } from 'date-fns'; 
import { load, save } from './storage/storage';

const entryTime = 15;

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
    try {
      const todaySitCountNotInterupted = Number((await load('todaySitCountNotInterupted')) || 0);
    console.log("Sitting count uninterupted:", todaySitCountNotInterupted);
    if (todaySitCountNotInterupted / (60/entryTime) >= 3){
      var remainingMinutes = Math.floor(todaySitCountNotInterupted / 4);
      var hours = Math.floor(remainingMinutes / 60);
      var minutes = remainingMinutes % 60;

      var hoursMessage = " valandas ir ";
      var minutesMessage = " minutes";

      if (hours == 1){
        hoursMessage = " valandą ir ";
      }
      if (minutes == 1){
        minutesMessage = " minutę";
      }

      var timeMessage;
      if (hours > 0 && minutes > 0) {
        timeMessage = hours + hoursMessage + minutes + minutesMessage;
      } else if (minutes > 0 && hours <= 0) {
        timeMessage = minutes + minutesMessage;
      } else if (hours > 0 && minutes <= 0) {
        timeMessage = hours + hoursMessage.substring(0, hoursMessage.length-4);
      }
        PushNotification.localNotification({
            channelId: "reminder",
            title: "Metas Pajudėti!", // Title of the notification
            message: timeMessage + " praleidote sėdėdami", // Message in the notification
            playSound: true, // Sound to play on receipt of notification
            soundName: "default", // Sound file name to play; use 'default' to play the default notification sound
            vibration: 300, // Vibration duration in milliseconds, null to disable
          });
    }
    }
    catch(error){
      console.error('Error sending too much sitting notification:', error);
    }
};

const sendUnreachedGoalNotification = async () => {
    const todaySitCount = Number((await load('todaySitCount')) || 0);
    const todayStandCount = Number((await load('todayStandCount')) || 0);
    const todayWalkCount = Number((await load('todayWalkCount')) || 0);
    const todayRunCount = Number((await load('todayRunCount')) || 0);
    const todayLayCount = Number((await load('todayLayCount')) || 0);

    //var todayWalkCount = Number((await load('todayWalkCount')) || 0);
    const goals = await load("goals") as  Goal[];
    var walkGoal = goals[0].goalHours as number * 60;
    var runGoal = goals[1].goalHours as number * 60;
    var sitGoal = goals[2].goalHours as number * 60;
    var standGoal = goals[3].goalHours as number * 60;
    var layGoal = goals[4].goalHours as number * 60;

    var furthestGoalTime = 0;
    var furthestGoal = null;

    if (goals[0].moreThan){
      if (walkGoal-todayWalkCount/(60/entryTime) > 0 && walkGoal-todayWalkCount/(60/entryTime)>furthestGoalTime){
        furthestGoalTime = walkGoal-todayWalkCount/(60/entryTime)
        furthestGoal = goals[0];
      }
    }
    if (goals[1].moreThan){
      if (runGoal-todayRunCount/(60/entryTime) > 0 && runGoal-todayRunCount/(60/entryTime)>furthestGoalTime){
        furthestGoalTime = runGoal-todayRunCount/(60/entryTime)
        furthestGoal = goals[1];
      }
    }
    if (goals[2].moreThan){
      if (sitGoal-todaySitCount/(60/entryTime) > 0 && sitGoal-todaySitCount/(60/entryTime)>furthestGoalTime){
        furthestGoalTime = sitGoal-todaySitCount/(60/entryTime)
        furthestGoal = goals[2];
      }
    }
    if (goals[3].moreThan){
      if (standGoal-todayStandCount/(60/entryTime) > 0 && standGoal-todayStandCount/(60/entryTime)>furthestGoalTime){
        furthestGoalTime = standGoal-todayStandCount/(60/entryTime)
        furthestGoal = goals[3];
      }
    }
    if (goals[4].moreThan){
      if (layGoal-todayLayCount/(60/entryTime) > 0 && layGoal-todayLayCount/(60/entryTime)>furthestGoalTime){
        furthestGoalTime = layGoal-todayLayCount/(60/entryTime)
        furthestGoal = goals[4];
      }
    }
    console.log("got here");
    console.log(furthestGoal);
    if (furthestGoal){
      walkGoal = furthestGoal.goalHours as number * 60
      //const isGoalDone = Boolean(await load('todayWalkGoal'))
      if (/*walkGoal > todayWalkCount / 4*/ true) {
        var remainingMinutes = Math.floor(furthestGoalTime);
        var hours = Math.floor(remainingMinutes / 60);
        var minutes = remainingMinutes % 60;

        var hoursMessage = " valandų ir ";
        var minutesMessage = " minučių";

        if (hours == 1){
          hoursMessage = " valandos ir ";
        }
        if (minutes == 1){
          minutesMessage = " minutės";
        }

        var timeMessage;
        if (hours > 0 && minutes > 0) {
          timeMessage = hours + hoursMessage + minutes + minutesMessage;
        } else if (minutes > 0 && hours <= 0) {
          timeMessage = minutes + minutesMessage;
        } else if (hours > 0 && minutes <= 0) {
          timeMessage = hours + hoursMessage.substring(0, hoursMessage.length-4);
        }
      
        PushNotification.localNotification({
          channelId: "reminder",
          title: "Nepasiduokite ant savo " + furthestGoal.name.substring(0, furthestGoal.name.length-2)+ "o" +  " tikslo", // Title of the notification
          message: "Iki pasiekto tikslo jums dar trūksta " + timeMessage, // Message in the notification
          playSound: true, // Sound to play on receipt of notification
          soundName: "default", // Sound file name to play; use 'default' to play the default notification sound
          vibration: 300, // Vibration duration in milliseconds, null to disable
        });
      }
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
        channelId: "reminder",
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
  try {
    const todaySitCount = Number((await load('todaySitCount')) || 0);
    const todayStandCount = Number((await load('todayStandCount')) || 0);
    const todayWalkCount = Number((await load('todayWalkCount')) || 0);
    const todayRunCount = Number((await load('todayRunCount')) || 0);
    const todayLayCount = Number((await load('todayLayCount')) || 0);
    const total = todaySitCount + todayStandCount + todayWalkCount + todayRunCount + todayLayCount;
    if (total != 0) {
      console.log("should send notification 1111111111111111111111111111111111111111111111111111111111");
      PushNotification.localNotification({
        channelId: "reminder",
        title: "Šiandienos statistika", // Title of the notification
        message: "Sėdėjote - " + (todaySitCount*100/total).toFixed(2) + " %, Stovėjote - "  + (todayStandCount*100/total).toFixed(2) + " %, Vaikščiojote - "
        + (todayWalkCount*100/total).toFixed(2) + " %, Bėgote - " +  (todayRunCount*100/total).toFixed(2) +  " %, Gulėjote - " +  (todayLayCount*100/total).toFixed(2) +  " %",// Message in the notification
        playSound: true, // Sound to play on receipt of notification
        soundName: "default", // Sound file name to play; use 'default' to play the default notification sound
        vibration: 300, // Vibration duration in milliseconds, null to disable
      });
    }
  } catch(error){
    console.error("Error sending statistics notification:", error);
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
    
  }, 60000);
  setInterval(async () => {
    const settings = await load("settings") as Setting[];
    if (settings[0].isTurnedOn == true && settings[2].isTurnedOn == true){
      sendUnreachedGoalNotification();
    }
  }, 60000);
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
  }, 60000);
};

// Export the function to be used elsewhere in the app
export default startNotificationInterval;