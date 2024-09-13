 package com.kisttapp;
 import android.app.Activity;
 import android.content.BroadcastReceiver;
 import android.content.Context;
 import android.content.Intent;
 import android.content.IntentFilter;
 import com.facebook.react.bridge.ActivityEventListener;
 import com.facebook.react.bridge.Arguments;
 import com.facebook.react.bridge.ReactApplicationContext;
 import com.facebook.react.bridge.ReactContext;
 import com.facebook.react.bridge.ReactContextBaseJavaModule;
 import com.facebook.react.bridge.ReactMethod;
 import com.facebook.react.bridge.WritableMap;
 import com.facebook.react.modules.core.DeviceEventManagerModule;
 import com.gspl.leegalitysdk.Leegality;
 import javax.annotation.Nullable;
 import com.facebook.react.ReactPackage;
 import com.facebook.react.uimanager.ViewManager;
 import com.facebook.react.bridge.NativeModule;

  public class LeegalityModule extends ReactContextBaseJavaModule implements ActivityEventListener {
     // A unique identifier is used for an activity/screen in your android app.
    // Whenever launching a new activity we send this unique identifier.
    // Here REQUEST_CODE will serve the purpose, you can change the value to whatever you like.
    private static final int REQUEST_CODE = 123;
     // This will have the context of the React Application in which you are running this activity
    private final ReactApplicationContext mContext;
    private int listenerCount = 0;
     LeegalityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        reactContext.addActivityEventListener(this);
    }
  @Override
    public String getName() {
        return "LeegalityModule";
    }
     // Our SDK sends/emits events from time to time for different kinds of actions
    // like raising a notification, successful signing, error, etc.
    // We use sendEvent whenever we receive an event to broadcast it to RN. 
 private void sendEvent(ReactContext reactContext, @Nullable WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("LeegalityEvent", params);
    }
     // We use sendResult whenever we receive a result from our activity to broadcast it to RN.
    private void sendResult(ReactContext reactContext, @Nullable WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("LeegalityResult", params);
    }
     @ReactMethod
    public void addListener(String eventName) {
        if (listenerCount == 0) {
            // Set up any upstream listeners or background tasks as necessary
        }
        listenerCount += 1;
    }
     @ReactMethod
    public void removeListeners(Integer count) {
        listenerCount -= count;
        if (listenerCount == 0) {
            // Remove upstream listeners, stop unnecessary background tasks
        }
    }
     // This is the method that you will be calling from RN, along with your signingURL
    // to start the signing journey. You can also send a boolean value as the second
    // parameter to enable or disable zooming in the signing journey.
    @ReactMethod
    public void openSigningJourney(String signingURL, Boolean zoom) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            return;
        }
        try {
            IntentFilter filter = new IntentFilter("com.gspl.leegality.events");
            Intent intent = new Intent(currentActivity.getApplicationContext(), Leegality.class);
            intent.putExtra("url", signingURL);
            intent.putExtra("zoom", zoom);
            // This is where we use the REQUEST_CODE to start the activity
            currentActivity.startActivityForResult(intent, REQUEST_CODE);
             // This registers an event receiver and has a callback called 'onReceive' inside
            // of it. Inside `onReceive`, we are using sendEvent to send the data
            // of the event that we just received to the RN side.
            currentActivity.registerReceiver(new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    WritableMap params = Arguments.createMap();
                    params.putString("data", intent.getExtras().getString("data"));
                     sendEvent(mContext, params);
                 }
             }, filter);
         } catch (Exception e) {
             WritableMap params = Arguments.createMap();
             params.putString("data", String.valueOf(e));
             sendEvent(mContext, params);
         }
     }
 
     @Override
     public void onNewIntent(Intent intent) {
 
     }
 
     @Override
     public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
         if (requestCode == REQUEST_CODE) {
             if (resultCode == Activity.RESULT_OK) {
                 String error = data.hasExtra("error") ? data.getExtras().getString("error") : null;
                 String message = data.hasExtra("message") ? data.getExtras().getString("message") : null;
                 WritableMap params = Arguments.createMap();
                 if (error != null) {
                     params.putString("error", error);
                 } else if (message != null) {
                     params.putString("message", message);
                 }
                 sendResult(mContext, params);
             }
         }
     }
 
  }