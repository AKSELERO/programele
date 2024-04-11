// react-native-background-actions.d.ts
declare module 'react-native-background-actions' {
    interface BackgroundServiceOptions {
      taskName: string;
      taskTitle: string;
      taskDesc: string;
      taskIcon: {
        name: string;
        type: string;
      };
      color: string;
      parameters?: object;
      actions?: string[];
    }
  
    namespace BackgroundService {
      function start(task: () => Promise<void>, options: BackgroundServiceOptions): Promise<void>;
      function stop(): Promise<void>;
      function isRunning(): Promise<boolean>;
    }
  
    export default BackgroundService;
  }
  