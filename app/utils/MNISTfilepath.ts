import { NativeModules } from 'react-native';

// Now TypeScript knows about MNISTAssetManager.getModelPath
NativeModules.MNISTAssetManager.getModelPath('random_forest.onnx')
  .then((path: string) => {
    console.log(path); // This path can be used with onnxruntime-react-native
  })
  .catch((error: any) => {
    console.error(error);
  });
