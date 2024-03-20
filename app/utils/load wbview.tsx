// // ONNXModelRunner.tsx
// import React, { useEffect, useRef } from 'react';
// import { WebView } from 'react-native-webview';
// import { loadModelAsBase64 } from './ML_Model'; // Adjust the path as necessary

// interface ONNXModelRunnerProps {
//   modelUri: string;
// }

// const ONNXModelRunner: React.FC<ONNXModelRunnerProps> = ({ modelUri }) => {
//   const webViewRef = useRef<WebView>(null);

//   useEffect(() => {
//     (async () => {
//       const base64Model = await loadModelAsBase64(modelUri);
//       const script = `loadModel('${base64Model}');`; // make sure your WebView's HTML includes a loadModel function that can handle this call
//       webViewRef.current?.injectJavaScript(script);
//     })();
//   }, [modelUri]);

//   // Your HTML file must be set up to define the `loadModel` function that decodes and loads the ONNX model
//   return (
//     <WebView
//       ref={webViewRef}
//       originWhitelist={['*']}
//       source={{ uri: 'path_to_your_html_file_or_html_string' }}
//     />
//   );
// };

// export default ONNXModelRunner;

