import { ConfigPlugin } from '@expo/config-plugins';

const withOnnxRuntime: ConfigPlugin<{
  // Define any plugin-specific options here
}> = (config, options) => {
  // Plugin logic here
  // For `onnxruntime-react-native`, you might not need to modify native code directly.
  // If the library requires specific native setup, apply those changes here.
  return config;
};

export default withOnnxRuntime;

  