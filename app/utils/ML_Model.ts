// // model.ts
// // model.ts
// import * as tfLite from 'react-native-tflite';

// export async function loadModel(): Promise<void> {
//   try {
//     await tfLite.loadModel({
//       model: 'model.tflite',
//       labels: 'labels.txt',
//     });
//     console.log('Model loaded successfully');
//   } catch (error) {
//     console.error('Failed to load the model', error);
//   }
// }

// export async function runModel(inputData: number[]): Promise<string | null> {
//   try {
//     const output = await tfLite.runModelOnFloatArray({
//       data: inputData,
//       outputDim: 1, // Assuming output is a single string
//     });
//     return output[0] as string; // Assuming output is a single string
//   } catch (error) {
//     console.error('Failed to run the model', error);
//     return null;
//   }
// }



// // TensorFlowComponent.tsx
// import React, { useEffect } from 'react';
// import { Text } from 'react-native';
// import * as tf from '@tensorflow/tfjs';
// import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// interface Props {
//   model: tf.LayersModel | null;
//   inputData: number[]; // Adjust type according to your input data
// }

// const TensorFlowComponent: React.FC<Props> = ({ model, inputData }) => {
//   useEffect(() => {
//     const predict = async () => {
//       try {
//         if (!model) {
//           console.error('Model not provided.');
//           return;
//         }

//         const inputTensor = tf.tensor2d([inputData]); // Assuming inputData is a 1D array
//         const output = model.predict(inputTensor);
//         const outputData = output.dataSync(); // Convert output tensor to a regular JavaScript array
//         console.log('Output:', outputData);

//         // Remember to dispose tensors after you're done using them to avoid memory leaks
//         inputTensor.dispose();
//         output.dispose();
//       } catch (error) {
//         console.error('Error during prediction:', error);
//       }
//     };

//     predict();
//   }, [model, inputData]); // Re-run predict whenever model or inputData changes

//   return (
//     <Text>TensorFlow Component</Text>
//   );
// };

// export default TensorFlowComponent;





// import { InferenceSession } from "onnxruntime-react-native";

// const modelPath: string = "../ML_Models/random_forest.onnx";

// export async function loadModel(): Promise<InferenceSession | null> {
//     try {
//         const session: InferenceSession = await InferenceSession.create(modelPath);
//         return session;
//     } catch (error) {
//         console.error("Error loading the model:", error);
//         return null;
//     }
// }

// export async function runInference(session: InferenceSession, input: any): Promise<any> {
//     try {
//         const result = await session.run(input, ['A', 'B', 'C', 'D', 'E']);
//         return result;
//     } catch (error) {
//         console.error("Error running inference:", error);
//         return null;
//     }
// }













