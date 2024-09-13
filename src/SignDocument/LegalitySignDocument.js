import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform
} from 'react-native';

const { LeegalityModule } = NativeModules;

const LegalitySignDocument = () => {
  const [input, setInput] = useState('https://sandbox.leegality.com/sign/d51b2d02-1cf9-4bfd-984f-ebe98d1e874e');

  // requestPermissions method only needed for Android
  const requestPermissions = async () => {
    try {
      // Depending on what you use during your signing journey you will
      // need to ask for permission explicitly from the user
      // be it Camera, GPS, Reading OTP or Downloading files
      await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]
      );
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(LeegalityModule);
    let eventListener = eventEmitter.addListener('LeegalityEvent', event => {
      console.log("LeegalityEventEmit", event.data);
    });

    if (Platform.OS === 'android') {
      requestPermissions(); // Only needed for Android
    }

    return () => {
      eventListener.remove();
    };
  }, []);

  const onPress = () => {
    try {
      if (Platform.OS === 'android') {
        LeegalityModule.openSigningJourney(input, false);
      } else {
        LeegalityModule.openSigningJourney(input); // for iOS
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter the signing URL below</Text>
      <TextInput
        editable
        onChangeText={text => setInput(text)}
        value={input}
        style={styles.input}
      />
      <Button
        title="Click to open web view"
        color="#841584"
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 300,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#333',
    padding: 8,
  },
});

export default LegalitySignDocument;
