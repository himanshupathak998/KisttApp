import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const WebViewScreen = props => {
  const backNavigation = useNavigation();
  const {navigation, route} = props;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Request permissions on component mount
    requestPermissions();
  }, []);

  // useEffect(() => {
  //   const backAction = () => {
  //     navigation.replace('StartVkyc', {isComplete: true});
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  const requestPermissions = async () => {
    const cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
    const audioStatus = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

    if (cameraStatus === RESULTS.GRANTED && audioStatus === RESULTS.GRANTED) {
      console.log('Permissions granted');
    } else {
      console.log('Permissions denied');
    }
  };

  const handlePermissionRequest = event => {
    const {resources, id} = event.nativeEvent;
    let grantedResources = [];

    // Check requested permissions
    resources.forEach(async resource => {
      if (resource === 'android.webkit.resource.VIDEO_CAPTURE') {
        const cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
        if (cameraStatus === RESULTS.GRANTED) {
          grantedResources.push('android.webkit.resource.VIDEO_CAPTURE');
        }
      }

      if (resource === 'android.webkit.resource.AUDIO_CAPTURE') {
        const audioStatus = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (audioStatus === RESULTS.GRANTED) {
          grantedResources.push('android.webkit.resource.AUDIO_CAPTURE');
        }
      }
    });

    if (grantedResources.length > 0) {
      // Use the onPermissionResponse prop to grant permissions
      webViewRef.current.postMessage({
        id,
        action: 'grant',
        resources: grantedResources,
      });
    } else {
      // Deny permissions if not granted
      webViewRef.current.postMessage({
        id,
        action: 'deny',
      });
    }
  };

  const webViewRef = React.useRef(null);
  const handleLoadEnd = syntheticEvent => {
    const {nativeEvent} = syntheticEvent;
    const url = nativeEvent.url;
    if (url.startsWith('kissht://vkyc/completed')) {
      navigation.navigate('StartVkyc', {isCompleted: true});
    }
  };

  // const handleNavigationChange = (newNavState) => {
  //   const { url } = newNavState;
  //   console.log(url,"URL");

  //   // Check if the URL indicates that VKYC process is done
  //   if (url.includes('cmp=true')) {
  //     navigation.navigate("StartVkyc", { isComplete: true });
  //   }
  // };

  return (
    <>
     <View style={styles.header}>
        <TouchableOpacity onPress={() => backNavigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <WebView
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        ref={webViewRef}
        source={{uri: route?.params?.waitPageUrl}}
        // source={{ uri: 'https://google.com' }}
        style={{flex: 1}}
        onLoadEnd={handleLoadEnd}
        // onPermissionRequest={handlePermissionRequest}
        // onNavigationStateChange={handleNavigationChange}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
      
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continue: {
    backgroundColor: '#FFF',
    padding: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'blue',
  },
  header: {
    padding: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
  },
});

export default WebViewScreen;
