import 'react-native';

declare module 'react-native' {
  export interface NativeModulesStatic {
    MNISTAssetManager: {
      getModelPath(assetName: string): Promise<string>;
    };
  }
}

// declare module 'react-native-background-fetch' {
//   var BackgroundFetch: {
//     configure: (config: any, callback: (taskId: string) => void, failure?: (error: any) => void) => void;
//     finish: (taskId: string) => void;
//     status: (callback: (status: number) => void) => void;
//     // Add other methods and properties as needed
//   };
  
//   export default BackgroundFetch;
// }
  