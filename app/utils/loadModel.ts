import { InferenceSession } from 'onnxruntime-react-native';
import { Buffer } from 'buffer';

async function loadModelFromCloud(url: string): Promise<InferenceSession | undefined> {
  try {
    // Download the model data as a Blob
    const response = await fetch(url);
    const blob = await response.blob();
    // Convert Blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    await new Promise((resolve, reject) => {
      reader.onloadend = resolve;
      reader.onerror = reject;
    });
    const base64data = reader.result;
    
    // Extract base64 data part
    if (base64data) {
      if (typeof base64data === 'string') {
        const base64 = base64data.split(',')[1];
        const modelBuffer = Buffer.from(base64, 'base64');
        // Load the model with onnxruntime-react-native
        const session = await InferenceSession.create(modelBuffer);
        console.log('Model loaded successfully');
        return session;
        // Proceed with using base64
    } else {
        // Handle the case where base64data is not a string
    }
      // Proceed with using base64
    } else {
      // Handle the case where base64data is null
    }

    // Convert base64 to binary data
    
    
  } catch (error) {
    console.error('Failed to load the model from cloud:', error);
    return undefined;
  }
}

export default loadModelFromCloud;

// import { InferenceSession } from 'onnxruntime-react-native';
// import RNFS from 'react-native-fs';

// async function downloadAndLoadModel(url: string): Promise<InferenceSession | undefined> {
//   try {
//     // Temporary file path to store the downloaded model
//     const tempFilePath = RNFS.DocumentDirectoryPath + '/random_forest.ort';

//     // Step 1: Download the ONNX model file
//     const downloadResult = await RNFS.downloadFile({
//       fromUrl: url,
//       toFile: tempFilePath,
//     }).promise;
  
//     // Verify the download was successful
//     if (downloadResult.statusCode === 200) {
//       console.log('Model downloaded successfully.');

//       // Step 2: Create an ONNX inference session with the file path
//       const session: InferenceSession = await InferenceSession.create(tempFilePath);

//       console.log('Model session is ready for inference.');
//       return session;
//     } else {
//       throw new Error(`Failed to download the model. Status code: ${downloadResult.statusCode}`);
//     }
//   } catch (error) {
//     console.error('Failed to load the model:', error);
//     return undefined;
//   }
// }

// export default downloadAndLoadModel;


// import { NativeModules } from 'react-native';
// import { InferenceSession } from 'onnxruntime-react-native';
// import { Buffer } from 'buffer';

// // Assuming your native module is called ModelLoader and has a method loadModel
// const { ModelLoader } = NativeModules;

// async function loadModel(): Promise<InferenceSession | undefined> {
//   try {
//     // Call the native module to get the base64-encoded model data
//     const modelBase64 = await ModelLoader.loadModel('../../assets/ML_Models/random_forest.ort');

//     // Convert base64 to binary data
//     const modelBuffer = Buffer.from(modelBase64, 'base64');

//     // Load the model with onnxruntime-react-native
//     const session = await InferenceSession.create(modelBuffer);
//     console.log('Model loaded successfully');
//     return session;
//   } catch (error) {
//     console.error('Failed to load the model:', error);
//     return undefined;
//   }
// }
// export default loadModel;