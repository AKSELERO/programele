
import { InferenceSession } from "onnxruntime-react-native";

const modelPath: string = "path/to/your/model.onnx";

export async function loadModel(): Promise<InferenceSession | null> {
    try {
        const session: InferenceSession = await InferenceSession.create(modelPath);
        return session;
    } catch (error) {
        console.error("Error loading the model:", error);
        return null;
    }
}

export async function runInference(session: InferenceSession, input: any): Promise<any> {
    try {
        const result = await session.run(input, ['A', 'B', 'C', 'D', 'E']);
        return result;
    } catch (error) {
        console.error("Error running inference:", error);
        return null;
    }
}













