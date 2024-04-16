// MyModelLoaderModule.java
package com.akselerometroprogramele;

import android.content.res.AssetManager;
import android.util.Base64;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.InputStream;

public class MyModelLoaderModule extends ReactContextBaseJavaModule {
    MyModelLoaderModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "MyModelLoader";
    }

    @ReactMethod
    public void loadModel(String assetPath, Promise promise) {
        try {
            AssetManager assetManager = getReactApplicationContext().getAssets();
            InputStream is = assetManager.open(assetPath);
            byte[] buffer = new byte[is.available()];
            is.read(buffer);
            is.close();
            String base64 = Base64.encodeToString(buffer, Base64.DEFAULT);
            promise.resolve(base64);
        } catch (Exception e) {
            promise.reject("Model Load Error", e);
        }
    }
}
