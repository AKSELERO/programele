import { NativeModules } from 'react-native';
import { InferenceSession } from 'onnxruntime-react-native';
import { Buffer } from 'buffer';

// Assuming your native module is called ModelLoader and has a method loadModel
const { ModelLoader } = NativeModules;

async function loadModel(): Promise<InferenceSession | undefined> {
  try {
    // Call the native module to get the base64-encoded model data
    const modelBase64 = await ModelLoader.loadModel('../../assets/ML_Models/random_forest.onnx');

    // Convert base64 to binary data
    const modelBuffer = Buffer.from(modelBase64, 'base64');

    // Load the model with onnxruntime-react-native
    const session = await InferenceSession.create(modelBuffer);
    console.log('Model loaded successfully');
    return session;
  } catch (error) {
    console.error('Failed to load the model:', error);
    return undefined;
  }
}
export default loadModel;