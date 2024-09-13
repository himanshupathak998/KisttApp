import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
  BackHandler,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenHeader from '../components/ScreenHeader';
import Margin from '../components/Margin';
import {Image} from 'react-native';
import CommonButton from '../components/CommonButton';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
 
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClientNoJwtHeaders, {apiHeaderKey, apiKey} from '../utils/baseUrl';
import Loader from '../components/Loader';
import {useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import StageSlider from '../components/StageSlider';
import apiClient from '../utils/interceptor';
import {encryptObjectData} from '../utils/encryptUtils';
 
const {LeegalityModule} = NativeModules;
const {width, height} = Dimensions.get('screen');
 
const SignDocument = props => {
  const iosNavigation = useNavigation();
  // const [msme, setMsme] = useState('');
  const [loading, setLoading] = useState(false);
  const [legalityCalled, setLegalityCalled] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [diableBtn, setDisableBtn] = useState(false);
  const [consent, setConsent] = useState(false);
 
  const {navigation, route} = props;
  // useEffect(() => {
  //   const getMsme = async () => {
  //     const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
 
  //     if (msmeIdentifier) {
  //       setMsme(msmeIdentifier);
  //     }
  //   };
  //   getMsme();
  //   return;
  // }, []);
 
  // useEffect(() => {
  //   if (customerId !== '') {
  //     handleLoanCreation();
  //   }
  // }, [customerId]);
 
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(LeegalityModule);
    let eventListener = eventEmitter.addListener('LeegalityEvent', event => {
      // Your logic for handling the event here. Here I have just logged it
      console.log('LeegalityEventEmit', event.data);
    });
    let resultListener = eventEmitter.addListener('LeegalityResult', event => {
      // Your logic for handling the activity result here. Here I have just logged it
      if (event && event['message']) {
        setDisableBtn(true);
        handleUpdateDBReadAndSignStatus();
        setConsent(true);
      } else {
        setDisableBtn(false);
        setConsent(false);
        console.log('LeegalityResultEmit IN ELSE', event['error']);
        return;
      }
    });
    return () => {
      eventListener.remove();
      // Example (in case of success): LeegalityResultEmit {"message": "The document(s) has been signed successf
      // Example (in case of error): LeegalityResultEmit {"error": "Cancelled"}
      // resultListener.remove();
    };
  }, [legalityCalled]);
 
  // useEffect(() => {
  //   const handleBackPress = () => {
  //     return true;
  //   };
 
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     handleBackPress,
  //   );
 
  //   const unsubscribe = iosNavigation.addListener('beforeRemove', e => {
  //     e.preventDefault();
  //   });
 
  //   return () => {
  //     backHandler.remove();
  //     unsubscribe();
  //   };
  // }, [iosNavigation]);
 
  useEffect(() => {
    getDetailSummary();
  }, []);
 
  const getDetailSummary = async () => {
    setLoading(true);
    const headers = {'x-api-key': apiHeaderKey};
    try {
      const response = await apiClient.get(
        `/user/summary`,
        {},
        {headers: headers},
      );

      if (response.ok) {
        setSummaryData(response?.data?.data[0]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // setApiErrorModalVisible(true);
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDBReadAndSignStatus = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    setLoading(true);
    let data = {
      // msmeIdentifier: msmeIdentifier,
    };
    const headers = {'x-api-key': apiHeaderKey};

    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    console.log('Encrypted Data:->', encryptedData);
    const payload = {
      data: encryptedData,
    };
    try {
      const res = await apiClient.put('/updateReadAndSignStatus', payload, {
        headers: headers,
      });
      if (res.ok) {
        setDisableBtn(true);
        navigation.navigate('ApplicationProcess');
      }
    } catch (err) {
      console.error('Error----->', err);
    } finally {
      setLoading(false);
    }
  };
  const handleReadAndSignStatus = async () => {
    setLoading(true);
    setDisableBtn(true);
    const mobileNumber = await AsyncStorage.getItem('mobileNumber');

    const data = {
      // msmeIdentifier: msme,
      name: summaryData?.full_name,
      mobileNumber: mobileNumber,
    };
    const headers = {'x-api-key': apiHeaderKey};

    console.log('handleReadAndSignStatusData--->', data);
    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    console.log('Encrypted Data:->', encryptedData);
    // const payload = {
    //   data: encryptedData,
    // };
    try {
      const res = await apiClient.get(
        '/get-sign-url',
        {},
        {
          headers: headers,
        },
      );
      console.log('handleReadAndSignStatusRes--->', res);
      if (res.status === 200) {
        onPress(res.data?.Data?.Invitees[0]?.SignUrl);
        // await handleUpdateDBReadAndSignStatus();
      } else {
        setDisableBtn(false); // Re-enable the button if the request fails
      }
    } catch (err) {
      console.error('Error----->', err);
      setDisableBtn(false);
    } finally {
      setLoading(false);
    }
  };

  const onPress = signUrl => {
    try {
      if (Platform.OS === 'android') {
        LeegalityModule.openSigningJourney(signUrl, false);
        setLegalityCalled(true);
      } else {
        LeegalityModule.openSigningJourney(signUrl); // for iOS
      }
    } catch (e) {
      setLoading(false);
    }
  };
  return (
    <View style={styles.main}>
      <Loader loading={loading} loaderSub={'Please Wait!!'} />
      <ScreenHeader
        headerText={'Sign your document'}
        backButton={true}
        width={'85%'}
        onPressBack={() => navigation.goBack()}
      />
      <Margin />
      <View style={{marginTop: 15}}>
        <StageSlider
          loan
          loanDone
          details
          detailsDone
          consent
          consentDone={consent}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.imgView}>
          <Image
            source={require('../assets/images/signing.png')}
            style={{
              height: height * 0.2,
              width: height * 0.2,
              resizeMode: 'contain',
            }}
          />
        </View>

        <Text style={styles.statement}>
          Key Fact Statement, Sanction letter and Loan Agreement
        </Text>
        <Text style={styles.txt}>
          To proceed further please read and accept
        </Text>
        {diableBtn === false ? (
          <CommonButton
            onPress={handleReadAndSignStatus}
            text={'Read & Sign'}
            btnStyles={{width: '90%', marginTop: 'auto'}}
          />
        ) : (
          <CommonButton
            unable
            text={'Read & Sign'}
            btnStyles={{width: '90%', marginTop: 'auto'}}
          />
        )}
      </View>
    </View>
  );
};

export default SignDocument;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    marginHorizontal: 20,
  },
  imgView: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  statement: {
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(2.6),
    color: '#111928',
    marginVertical: 10,
    textAlign: 'center',
  },
  txt: {
    fontFamily: 'Manrope-Medium',
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    textAlign: 'center',
  },
});
