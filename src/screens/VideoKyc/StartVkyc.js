import {
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenHeader from '../../components/ScreenHeader';
import CommonButton from '../../components/CommonButton';
import CommonModal from '../../components/CommonModal';
import Margin from '../../components/Margin';
import { CustomerCreation, updateVkycDB } from '../../redux/reducers/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { vkycApi } from '../../api/api';
import WebView from 'react-native-webview';
import WebViewScreen from '../LoanDetails/WebViewCompVKYC';
import {
  apiHeaderKey,
  apiKey,
  vkyc_group_id,
  vkycHeaders,
} from '../../utils/baseUrl';
import uuid from 'react-native-uuid';
import HelperFunction from '../../utils/HelperFunction';
import Loader from '../../components/Loader';
import ApiErrorModal from '../../components/ApiErrorModel';
import StageSlider from '../../components/StageSlider';
import apiClient from '../../utils/interceptor';
import { encryptObjectData } from '../../utils/encryptUtils';

const StartVkyc = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const { PhotoUrl, adhar, pan, email, mobileNumber } = useSelector(
    state => state.user,
  );
  const [modalOpen, setModalOpen] = useState(props?.route?.params?.isComplete);
  const [summaryData, setSummaryData] = useState(null);

  const [trackingId, setTrackingId] = useState('');
  const [waitPageUrl, setWaitPageUrl] = useState('');
  const [statusVkycCheck, setStatusVkycCheck] = useState('');
  const [resTrackingId, setResTrackingId] = useState('');
  const [showVkyc, setShowVkyc] = useState(false);
  const [pincodeData, setPincodeData] = useState(null);

  const [aadhaarReferenceNumber, setaadhaarReferenceNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [openWebView, setOpenWebView] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [apiErrorModalVisible, setApiErrorModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorMsgHeader, setErrorMsgHeader] = useState('');
  const onCloseModal = () => {
    // CIFCreation();
    setModalOpen(false);
    // navigation.navigate("PaymentMethod")
  };

  const getDetailSummary = async () => {
    // setInitialLoading(true);
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    // const msmeIdentifier =
    //   '4166A574758DACBFF60CDDB575E5585405603182B4B94508D64D1B6ABF09760D';
    // // const url = `http://172.191.44.222:80/api/user/${msmeIdentifier}/summary`;
    const headers = { 'x-api-key': apiHeaderKey };

    try {
      // const response = await fetch(url, {
      //   method: 'GET',
      // });
      // const headers = {'x-api-key': 'ab5a4552-2412-4724-a254-18a05e722e3d'};
      const response = await apiClient.get(
        `/user/summary`,
        {},
        { headers: headers },
      );
      console.log(response.data.data);

      if (response.ok) {
        setSummaryData(response?.data?.data[0]);
        setShowVkyc(true);
        // setInitialLoading(false);
      }
    } catch (error) {
      // setInitialLoading(false);
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };

  useEffect(() => {
    getDetailSummary();
    // generate14DigitRandomNumber();
  }, []);

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  const isWithinTimeRange = (startHour, endHour) => {
    const now = new Date();
    const currentHour = now.getHours();

    return currentHour >= startHour && currentHour < endHour;
  };
  // const generate14DigitRandomNumber = () => {
  //   let randomNumber = '';
  //   for (let i = 0; i < 14; i++) {
  //     randomNumber += Math.floor(Math.random() * 10);
  //   }
  //   setTrackingId(randomNumber);
  // };

  const checkVkycAgent = async () => {
    if (isWithinTimeRange(10, 20)) {
      setLoading(true);
      try {
        // const headers = {
        //   'Content-Type': 'application/json',
        //   'client-id': '101',
        //   timestamp: '1701853931438',
        //   'x-request-id': '82672636-51ab-4271-97d9-80e9283c7af2',
        //   api_key: apiKey,
        //   'Accept-Encoding': '*/*',
        //   'x-api-key': apiHeaderKey,
        // };
        console.log(vkycHeaders, 'vkycHeaders');
        const response = await apiClient.get(
          `/vkycGroup`,
          {},
          { headers: vkycHeaders },
        );

        // const response = await apiClient.get(`/vkycGroup`, {}, {headers});

        setApiErrorModalVisible(false);
        if (response.ok && response?.data?.queueNumber != null) {
          if (response?.data?.queueNumber === -1) {
            setLoading(false);
            setErrorMsgHeader('Vkyc status');
            setErrorMsg('Currently, No agents are available.');
            setApiErrorModalVisible(true);
          } else {
            setApiErrorModalVisible(false);
            handleVkyc();
          }
        } else {
          setLoading(false);
          setApiErrorModalVisible(true);
          setErrorMsgHeader('Error in fetching details');
        }
      } catch (error) {
        setLoading(false);
        setApiErrorModalVisible(true);
        console.log(error, 'error in check vkyc agent');
      }
    } else {
      setErrorMsgHeader('Vkyc status');
      setErrorMsg('Agents will be available from 10 am to 8 pm only.');
      setApiErrorModalVisible(true);
    }
  };

  const handleVkyc = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        'vkyc/customer-data',
        {},
        {
          headers: vkycHeaders,
        },
      );
      console.log('vkyc resp', res);
      if (res.ok) {
        setApiErrorModalVisible(false);
        setLoading(false);
        if (res?.data?.waitPageUrl) {
          setWaitPageUrl(res?.data?.waitPageUrl);
          navigation.navigate('WebViewVKYC', {
            waitPageUrl: res?.data?.waitPageUrl,
          });
          setResTrackingId(res?.data?.trackingId);
        }
        if (res?.data?.trackingId) {
        }
      } else {
        setLoading(false);
        setApiErrorModalVisible(true);
        setErrorMsgHeader('VKYC Error');
      }
    } catch (error) {
      console.log('error in vkyc', error);
      setLoading(false);
      setApiErrorModalVisible(true);
      setErrorMsgHeader('VKYC Error');
    }
  };

  const handleDownlaodVkyc = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    // const headers = {
    //   'client-id': '101',
    //   'X-Request-ID': '1168b770-5c69-40a0-a563-973797274e8d',
    //   timestamp: '1701853931438',
    //   'Content-Type': 'application/json',
    //   api_key: apiKey,
    //   'x-api-key': apiHeaderKey,
    // };
    try {
      const response = await apiClient.get(
        `/vkyc/download/${summaryData?.vkyc_tracking_id}`,
        {},
        {
          headers: vkycHeaders,
        },
      );
      // const response = await apiClient.get(
      //   `/vkyc/download/${summaryData?.vkyc_tracking_id}?msmeIdentifier=${msmeIdentifier}`,
      //   {},
      //   {headers},
      // );
      console.log('checkvkycstatusResponse----->', response?.data?.status);
      const parsedData = JSON.parse(response.data);
      const status = parsedData.status;
      console.log('status----->', status);

      if (response.ok) {
        setApiErrorModalVisible(false);

        setStatusVkycCheck(status);
        console.log('statusnew----->', status);

        if (
          status === 'Approved' ||
          status === 'Successful' ||
          status === 'AuditorReady' ||
          status === 'AuditorAssigned'
        ) {
          navigation.navigate('PaymentMethod');
        } else {
          setApiErrorModalVisible(true);
          setErrorMsgHeader(`VKYC status: ${status}`);
          setErrorMsg('Your application is under review');
        }
      } else {
        console.log('statusnew2----->', status);
        setApiErrorModalVisible(true);
        setErrorMsgHeader('Error in VKYC');
      }
    } catch (error) {
      setApiErrorModalVisible(true);
      setErrorMsgHeader('Error in VKYC');
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };

  // useEffect(() => {
  //   if (
  //     waitPageUrl !== null &&
  //     waitPageUrl !== undefined &&
  //     waitPageUrl !== ''
  //   ) {

  //   }
  // }, [waitPageUrl]);

  useEffect(() => {
    if (props?.route?.params?.isCompleted) {
      handleUpdateVkyc();
    }
  }, [props?.route?.params?.isCompleted]);

  const handleUpdateVkyc = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');

    const data = {
      // msmeIdentifier: msmeIdentifier,
      VkycTrackingId: resTrackingId,
    };

    dispatch(updateVkycDB(data)).then(res => { });
  };

  return (
    <View style={styles.mainContainer}>
      {initialLoading ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <View style={styles.container}>
          <Loader loading={loading} loaderSub={'Please Wait!!'} />

          <ScreenHeader
            headerText={'VKYC Verification'}
            backButton={true}
            width={'70%'}
            onPressBack={() => navigation.navigate('LoanSummary')}
          />

          <Margin />
          <StageSlider loan loanDone details />
          <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <Image
              source={require('../../assets/images/vkyc.png')}
              style={styles.vkycImg}
            />
          </View>
          {!summaryData?.vkyc_tracking_id ? (
            <CommonButton text={'Start VKYC'} onPress={checkVkycAgent} />
          ) : (
            <CommonButton
              text={'Check Vkyc Status'}
              onPress={handleDownlaodVkyc}
            />
          )}
          {/* {statusVkycCheck === 'Open' ? (
            <CommonButton text={'Continue'} />
          ) : null} */}
          <CommonButton
            text={'Temporarily Continue...'}
            onPress={() => navigation.navigate('PaymentMethod')}
          />
          <ApiErrorModal
            visible={apiErrorModalVisible}
            onClose={() => setApiErrorModalVisible(false)}
            errorMsg={errorMsg}
            errorHeader={errorMsgHeader}
          />
        </View>
      )}
    </View>
  );
};

export default StartVkyc;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  vkycImg: {
    height: 400,
    width: 400,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  vkycSuccessModal: {
    justifyContent: 'center',
  },
  loaderView: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});
