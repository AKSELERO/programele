import 'react-native';

declare module 'react-native' {
  export interface NativeModulesStatic {
    MNISTAssetManager: {
      getModelPath(assetName: string): Promise<string>;
    };
  }
}
  