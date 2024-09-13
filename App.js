import React, { useEffect } from 'react';
import MyStack from './src/router/MyStack';
import { NavigationContainer } from '@react-navigation/native';
import TopHeader from './src/components/TopHeader';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { setUserDetails } from './src/redux/reducers/userSlice';
import DeviceInfo from 'react-native-device-info';
import { AppSecurity } from '@sleiv/react-native-app-security';
import { useFreeRasp } from 'freerasp-react-native';
import apiClientNoJwtHeaders, {
  apiHeaderKey,
  release_certificate_hash_value,
  team_id,
} from './src/utils/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import decodeJWT from './src/utils/jwtExpiryUtil';

const ReduxWrapper = ({
  userReferenceNumber,
  mobileNumber,
  pan,
  udyamNumber,
}) => {

  const dispatch = useDispatch();
  let isRefreshing = true;

  useEffect(() => {
    if (userReferenceNumber && mobileNumber && pan && udyamNumber) {
      dispatch(
        setUserDetails({ userReferenceNumber, mobileNumber, pan, udyamNumber }),
      );
    }
  }, [dispatch, userReferenceNumber, mobileNumber, pan, udyamNumber]);

  useEffect(() => {

    const checkTokenTimeExpiry = async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = await AsyncStorage.getItem('expiryTime');
      const secDiff = 25;
      let tokenTimeDiff = expiryTime - currentTime;
      if (tokenTimeDiff < 0) {
        tokenTimeDiff = 0;
      }

      if ((tokenTimeDiff < secDiff) && tokenTimeDiff >= 0) {
        isRefreshing = false;
        await refreshTokenApi();
      }
    };

    const intervalId = setInterval(async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        checkTokenTimeExpiry();
      }
    }, 20000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const checkTokenTimeExpiry = async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = await AsyncStorage.getItem('expiryTime');
      const secDiff = 25;
      let tokenTimeDiff = expiryTime - currentTime;
      if (tokenTimeDiff < 0) {
        tokenTimeDiff = 0;
      }

      if (tokenTimeDiff < secDiff && tokenTimeDiff >= 0) {
        isRefreshing = false;
        await refreshTokenApi();
      }
    };

    const intervalId = setInterval(async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        checkTokenTimeExpiry();
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const refreshTokenApi = async () => {
    try {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const headers = {
          'x-api-key': apiHeaderKey,
          Authorization: `Bearer ${refreshToken}`,
        };
        const refreshResponse = await apiClientNoJwtHeaders.get(
          '/refresh-token',
          {},
          { headers },
        );

        if (refreshResponse.ok) {
          const newAuthToken = refreshResponse?.data?.accessToken;
          await AsyncStorage.setItem('accessToken', newAuthToken);

          // getting the expiry time from the token using a generic function
          const decodedPayload = decodeJWT(newAuthToken);

          // Get the expiry time (exp)
          const expiryTimeInSeconds = decodedPayload.exp;
          await AsyncStorage.setItem(
            'expiryTime',
            expiryTimeInSeconds.toString(),
          );
        }
      }
    } catch (error) {
      console.log(error, 'Error in refreshing the token api');
    } finally {
      isRefreshing = true;
    }
  };

  // App Configuration
  const config = {
    androidConfig: {
      packageName: 'com.kisttapp',
      certificateHashes: [release_certificate_hash_value],
      // supportedAlternativeStores: ['com.sec.android.app.samsungapps'],
    },
    iosConfig: {
      appBundleId: 'com.kisttapp',
      appTeamId: team_id,
    },
    watcherMail: 'rakesh.kumar@techenhance.com',
    isProd: true,
  };

  // SimCardsManagerModule?.getSimCards({
  //   title: 'App Permission',
  //   message: 'Custom message',
  //   buttonNeutral: 'Not now',
  //   buttonNegative: 'Not OK',
  //   buttonPositive: 'OK',
  // })
  //   .then(array => {
  //     console.log(array);
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });

  // Reactions for Detected Threats
  // const actions = {
  //   // Actions for both Android & iOS
  //   privilegedAccess: () => {
  //     console.log('privilegedAccess');
  //     BackHandler.exitApp();
  //     return;
  //   },
  //   debug: () => {
  //     console.log('debug');
  //     BackHandler.exitApp();
  //     return;
  //   },
  //   simulator: () => {
  //     console.log('simulator');
  //     BackHandler.exitApp();
  //     return;
  //   },
  //   appIntegrity: () => {
  //     console.log('appIntegrity');
  //     BackHandler.exitApp();
  //     return;
  //   },
  //   unofficialStore: () => {
  //     console.log('unofficialStore');
  //     // BackHandler.exitApp();
  //     // return;
  //   },
  //   hooks: () => {
  //     console.log('hooks');
  //     BackHandler.exitApp();
  //     return;
  //   },
  //   deviceBinding: () => {
  //     console.log('deviceBinding');
  //     BackHandler.exitApp();
  //     return;
  //   },
  //   secureHardwareNotAvailable: () => {
  //     console.log('secureHardwareNotAvailable');
  //     BackHandler.exitApp();
  //     return;
  //   },
  //   systemVPN: () => {
  //     console.log('systemVPN');
  //     BackHandler.exitApp();
  //     return;
  //   },
  //   passcode: () => {
  //     console.log('passcode');
  //     BackHandler.exitApp();
  //     return;
  //   },

  //   // iOS-specific Actions
  //   deviceID: () => {
  //     console.log('deviceID');
  //     BackHandler.exitApp();
  //     return;
  //   },

  //   // Android-specific Actions
  //   obfuscationIssues: () => {
  //     console.log('obfuscationIssues');
  //     BackHandler.exitApp();
  //     return;
  //   },
  //   devMode: () => {
  //     console.log('devMode');
  //     // BackHandler.exitApp();
  //     // return;
  //   },
  // };

  // // Initialize FreeRasp
  // useFreeRasp(config, actions);

  return (
    <NavigationContainer independent={true}>
      <TopHeader />
      <MyStack />
    </NavigationContainer>
  );
};

const App = ({ userReferenceNumber, mobileNumber, pan, udyamNumber }) => {
  return (
    <Provider store={store}>
      <ReduxWrapper
        userReferenceNumber={userReferenceNumber}
        mobileNumber={mobileNumber}
        pan={pan}
        udyamNumber={udyamNumber}
      />
    </Provider>
  );
};

export default App;