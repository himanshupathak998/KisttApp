import {
  Alert,
  Button,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import OTPTextView from 'react-native-otp-textinput';
import CommonButton from '../../components/CommonButton';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import CheckIcon from 'react-native-vector-icons/FontAwesome';

import CommonModal from '../../components/CommonModal';

import {
  dedupeCheck,
  generateOtp,
  WhatsappApi,
  WhatsappStore,
} from '../../redux/reducers/authSlice';

import Loader from '../../components/Loader';
import Geolocation from 'react-native-geolocation-service';
import apiClientNoJwtHeaders, { apiHeaderKey, apiKey } from '../../utils/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserDetails } from '../../redux/reducers/userSlice';
import axios from 'axios';
import WebView from 'react-native-webview';
import ApiErrorModal from '../../components/ApiErrorModel';
import LoaderScreen from '../../components/LoaderScreen';
import {
  getHash,
  removeListener,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';
import { useFocusEffect } from '@react-navigation/native';
import { encryptObjectData } from '../../utils/encryptUtils';
import apiClient from '../../utils/interceptor';
import decodeJWT from '../../utils/jwtExpiryUtil';

const MobileVerification = ({ navigation }) => {
  const { mobileNumber, userReferenceNumber ,pan , udyamNumber} = useSelector(state => state.user)
  const dispatch = useDispatch();
  // const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errorMobileNumber, setErrorMobileNumber] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [otpMobile, setOtpMobile] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [xcodeMobile, setXcodeMobile] = useState(null);

  const [borderColorMobile, setBorderColorMobile] = useState('#E5E7EB');
  const [borderColorEmail, setBorderColorEmail] = useState('#E5E7EB');
  const [wrongOtpMobile, setWrongOtpMobile] = useState(false);
  const [wrongOtpEmail, setWrongOtpEmail] = useState(false);

  const [xcodeEmail, setXcodeEmail] = useState('');
  const [mobileValidatingLoader, SetMobileValidatingLoader] = useState(false);
  const [emailValidatingLoader, SetEmailValidatingLoader] = useState(false);
  const [verifyMobile, SetVerifyMObile] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  // const [msmeIdentifier, setmsmeIdentifier] = useState('');

  const [ipAddress, setIpAddress] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [secondsEmail, setSecondsEmail] = useState(30);
  const [isEmailButtonDisabled, setIsEmailButtonDisabled] = useState(true);
  const [apiErrorModalVisible, setApiErrorModalVisible] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [apiErrorMsg, setApiErrorMsg] = useState('');
  const [apiErrorMsgHeader, setApiErrorMsgHeader] = useState('');

  const [moibleEdit, setMobileEdit] = useState(true);
  const [emailEdit, setEmailEdit] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(null);
  const [isExistingCustomer, setIsExistingCustomer] = useState(null);
  const [customerEmailId, setCustomerEmailId] = useState('');
  const [locGrant, setLocGrant] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setApiErrorModalVisible(false); // Reset modal visibility when the screen is focused
    }, []),
  );

  useEffect(() => {
    getHash()
      .then(hash => {
        // use this hash in the message.
      })
      .catch(console.log);

    startOtpListener(message => {
      if (message) {
        const match = /(\d{6})/g?.exec(message); // Match the regex
        if (match) {
          const otp = match[1]; // Extract the OTP
          setOtpMobile(otp);
        } else {
          console.log('OTP not found in the message');
        }
      } else {
        console.log('No message received or message is null');
      }
    });

    return () => removeListener();
  }, []);

  useEffect(() => {
    getIpAddress();
  }, []);

  useEffect(() => {
    const getPhoneNumber = async () => { };
    getPhoneNumber();
  }, []);

  let otpInputEmail = useRef(null);
  let otpInput = useRef(null);

  const handleMobileNumberChange = useCallback(() => {
    if (mobileNumber?.length === 0) {
      setErrorMobileNumber(false);
      setOtpSent(false);
    } else if (mobileNumber?.length === 10 && !otpSent) {
      setErrorMobileNumber(false);
      setBorderColorMobile('#3E74DE');
      if (!otpSent) {
        mobileNumberStore();
        setTimeout(() => {
          sendOtpMobile();
          setShowMobileOtp(true);
          setOtpSent(true);
        }, 2000);
      }
    } else if (mobileNumber?.length !== 10) {
      setErrorMobileNumber(true);
      setOtpSent(false);
    }
  }, [mobileNumber, otpSent]);

  useEffect(() => {
    handleMobileNumberChange();
  }, [handleMobileNumberChange]);

  useEffect(() => {
    if (email?.length === 0) {
      setErrorEmail(false);
    } else if (email?.length !== 0 && email.includes('@')) {
      setErrorEmail(false);
      setBorderColorEmail('#3E74DE');
    } else {
      setErrorEmail(true);
    }
  }, [email]);

  useEffect(() => {
    if (otpMobile?.length === 6) {
      setTimeout(() => {
        otpValidationMobile();
      }, 2000);
    }
  }, [otpMobile]);

  useEffect(() => {
    if (otpEmail?.length === 6) {
      setTimeout(() => {
        otpValidationEmail();
      }, 2000);
    }
  }, [otpEmail]);

  const handleSetUserDetails = () => {
    const userDetails = {
      mobileNumber: mobileNumber,
      email: email,
      pan:pan,
      udyamNumber:udyamNumber
    };

    dispatch(setUserDetails(userDetails));
  };

  const clearText = () => {
    otpInput.current.clear();
  };

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      async position => {
        setLocationStatus('You are Here');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        await AsyncStorage.setItem('long', currentLongitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        await AsyncStorage.setItem('lat', currentLatitude);
        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const getIpAddress = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiHeaderKey,
    };

    try {
      const response = await axios.get(`https://api.ipify.org`, { headers });
      if (response.status === 200) {
        setIpAddress(response.data);
      }
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };

  const requestPermissions = async () => {
    try {
      const locationGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      const smsPermissionCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      );
      const smsSendCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      );
      const recordPermissionCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      const microPhonePermissionCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      const storagePermissionCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!locationGranted) {
        const permissionCheck = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        // if (permissionCheck === PermissionsAndroid.RESULTS.GRANTED) {
        //   setLocGrant(true);
        //   getOneTimeLocation();
        // }
        if (permissionCheck === PermissionsAndroid.RESULTS.GRANTED || permissionCheck === true) {
          setLocGrant(true);
          getOneTimeLocation();
          if (
            !(
              smsPermissionCheck &&
              smsSendCheck &&
              recordPermissionCheck &&
              microPhonePermissionCheck &&
              storagePermissionCheck
            )
          ) {
            await PermissionsAndroid.requestMultiple([
              'android.permission.ACCESS_FINE_LOCATION',
              'android.permission.CAMERA',
              'android.permission.SEND_SMS',
              'android.permission.READ_SMS',
              'android.permission.RECORD_AUDIO',
              'android.permission.WRITE_EXTERNAL_STORAGE',
            ]);
          }
        }
      } else {
        setLocGrant(true);
        if (locationGranted) {
          getOneTimeLocation();
        }
      }
    } catch (error) {
      console.warn('Error requesting permissions:', error);
    }
  };
  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (locGrant) {
      getOneTimeLocation();
    }
  }, [locGrant]);

  const sendOtpMobile = async () => {
    setApiErrorModalVisible(false);
    setMobileEdit(false);
    const data = {
      Data: {
        MobileNumber: `91${mobileNumber}`,
        CustomerId: '',
        EmailId: '',
        IntFlag: '0',
        TemplateId: 'OTP454',
        IpAddress: ipAddress ? ipAddress : '102.03.02.34',
        Latitude: currentLatitude,
        Longitude: currentLongitude,
        UserReferenceNo: userReferenceNumber,
        DynamicParam: [
          {
            Value: '',
            Name: 'otp',
          },
        ],
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Request-ID': 'COR',
      'x-api-key': apiHeaderKey,
    };

    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    const payload = {
      data: encryptedData,
    };
    try {
      const response = await apiClientNoJwtHeaders.post(`/send-otp`, payload, {
        headers,
      });

      if (response.ok === true) {
        setMobileEdit(false);
        setApiErrorModalVisible(false);
        setXcodeMobile(response.data.Data?.['X-Correlation-ID']);
      } else {
        setMobileEdit(true);
        setShowMobileOtp(false);
        setApiErrorModalVisible(true);
        setApiErrorMsgHeader('Error in receiving the OTP on mobile');
        setApiErrorMsg(
          'Some thing went wrong in getting OTP on mobile, Please try again after sometime',
        );
      }
    } catch (error) {
      setMobileEdit(true);
      setApiErrorModalVisible(true);
      setShowMobileOtp(false);
      setApiErrorMsgHeader('Error in receiving the OTP on mobile');
      setApiErrorMsg(
        'Some thing went wrong in getting OTP on mobile, Please try again after sometime',
      );
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };

  useEffect(() => {
    let timer;
    if (mobileNumber?.length === 10 && seconds > 0) {
      setIsButtonDisabled(true);
      timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsButtonDisabled(false);
    }
    return () => clearInterval(timer);
  }, [seconds, mobileNumber]);

  const resendOtp = () => {
    // Implement the resend OTP logic here
    otpInput?.current?.clear();
    setOtpMobile('');
    sendOtpMobile();
    setSeconds(30); // Reset timer
    setIsButtonDisabled(true); // Disable button again
  };
  const formatTime = secs => {
    return `${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    let timer;
    if (showEmailOtp && email?.length > 0 && secondsEmail > 0) {
      setIsEmailButtonDisabled(true);
      timer = setInterval(() => {
        setSecondsEmail(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (secondsEmail === 0) {
      setIsEmailButtonDisabled(false);
    }
    return () => clearInterval(timer);
  }, [secondsEmail, showEmailOtp]);

  const resendEmailOtp = () => {
    // Implement the resend OTP logic here
    otpInputEmail?.current?.clear();
    setOtpEmail('');
    sendOtpEmail();
    setSecondsEmail(30); // Reset timer
    setIsEmailButtonDisabled(true); // Disable button again
  };
  const sendOtpEmail = async () => {
    setShowEmailOtp(true);
    setEmailEdit(false);
    const data = {
      Data: {
        MobileNumber: `91${mobileNumber}`,
        CustomerId: '',
        EmailId: email,
        IntFlag: '0',
        TemplateId: '|Suryoday_Bank_OTP607',
        UserReferenceNo: userReferenceNumber,
        DynamicParam: [
          {
            Value: '',
            Name: 'otp',
          },
        ],
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Request-ID': 'COR',
      'x-api-key': apiHeaderKey,
    };

    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    const payload = {
      data: encryptedData,
    };

    try {
      const response = await apiClientNoJwtHeaders.post(`/send-otp`, payload, {
        headers,
      });
      if (response.ok === true) {
        setEmailEdit(false);
        setApiErrorModalVisible(false);
        setApiErrorMsg('');
        setXcodeEmail(response.data.Data?.['X-Correlation-ID']);
      } else {
        setEmailEdit(true);
        setShowEmailOtp(false);
        setApiErrorModalVisible(true);
      }
    } catch (error) {
      setEmailEdit(true);
      setApiErrorModalVisible(true);
      setShowEmailOtp(false);
      setApiErrorMsgHeader('Error in receiving the OTP on E-mail');
      setApiErrorMsg(
        'Some thing went wrong in getting OTP on E-mail, Please try again after sometime',
      );
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = text => {
    setEmail(text);
    setIsValidEmail(validateEmail(text));
    setErrorEmail(false);
    setBorderColorEmail('#E5E7EB');
  };

  const handleSubmit = () => {
    if (validateEmail(email)) {
      setErrorEmail('');
      sendOtpEmail();
    } else {
      setErrorEmail('Enter Correct EmailId');
    }
  };

  const otpValidationMobile = async () => {
    SetMobileValidatingLoader(true);
    setMobileEdit(false);
    const headers = {
      'Content-Type': 'application/json',
      'X-Request-ID': 'COR',
      'X-Correlation-ID': xcodeMobile.toString(),
      'x-api-key': apiHeaderKey,
    };

    const data = {
      mobileNumber: `91${mobileNumber}`,
      otp: otpMobile,
    };

    try {
      const response = await apiClientNoJwtHeaders.post(
        `/validate-otp`,
        data,

        { headers: headers },
      );

      if (response?.data?.isOtpVerified === true) {
        setIsOtpVerified(true); //need to check in api
        setIsExistingCustomer(response?.data?.isExistingCustomer); //need to check

        if (response?.data?.customerEmailId !== '') {
          setVerifyEmail(true); // need to check
          setCustomerEmailId(response?.data?.customerEmailId);
        }
        setMobileEdit(false);
        setApiErrorModalVisible(false);
        SetVerifyMObile(true);
        setShowMobileOtp(false);
        // getMsmeIdentifierApi();
        setBorderColorMobile('#05C16E');
        setWrongOtpMobile(false);
      } else {
        setMobileEdit(true);
        SetVerifyMObile(false);
        setWrongOtpMobile(true);
        setBorderColorMobile('red');
        setApiErrorModalVisible(true);
        setApiErrorMsgHeader('OTP Validation Failed!');
      }
    } catch (error) {
      setMobileEdit(true);
      SetVerifyMObile(false);
      setApiErrorModalVisible(true);
      setApiErrorMsgHeader('OTP Validation Failed!');
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    } finally {
      SetMobileValidatingLoader(false);
    }
  };
  const otpValidationEmail = async () => {
    SetEmailValidatingLoader(true);
    setEmailEdit(false);
    const headers = {
      'Content-Type': 'application/json',
      'X-Request-ID': 'COR',
      'X-Correlation-ID': xcodeEmail,
      'x-api-key': apiHeaderKey,
    };

    const data = {
      mobileNumber: `91${mobileNumber}`,
      email: email,
      otp: otpEmail,
    };

    try {
      const response = await apiClientNoJwtHeaders.post(`/validate-otp`, data, {
        headers,
      });
      if (response?.data?.isOtpVerified === true) {
        setEmailEdit(false);
        setApiErrorModalVisible(false);
        setVerifyEmail(true);
        setShowEmailOtp(false);
        setBorderColorEmail('#05C16E');
        setWrongOtpEmail(false);
      } else {
        setEmailEdit(true);
        setWrongOtpEmail(true);
        setBorderColorEmail('red');
        setApiErrorModalVisible(true);
        setApiErrorMsgHeader('OTP validation Failed!');
      }
    } catch (error) {
      setEmailEdit(true);
      setApiErrorModalVisible(true);
      setApiErrorMsgHeader('OTP validation Failed!');
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    } finally {
      SetEmailValidatingLoader(false);
    }
  };

  const handleWhatsapp = async () => {
    const data = {
      Data: {
        Messages: [
          {
            Sender: '917875682343',
            To: mobileNumber,
            TransactionId: '2993b6b548000aa3434fsd',
            Channel: 'wa',
            Type: 'mediaTemplate',
            MediaTemplate: {
              Filename: 'sample-doc',
              Content: 'JJVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovV',
              Parameters: [
                {
                  Name: '1',
                  Value: 'XXX1234',
                },
              ],
              ContentType: 'application/pdf',
              Template: 'onboarding_msme_1',
              LangCode: 'en',
            },
          },
        ],
        ResponseType: 'json',
      },
    };

    // const data = {
    //   Data: {
    //     Messages: [
    //       {
    //         Sender: '917875682343',
    //         To: mobileNumber,
    //         MessageId: '2993b6b54800sfsdffa3431',
    //         TransactionId: '2993b6b548000aa3434fsd',
    //         Channel: wa,
    //         Type: 'mediaTemplate',
    //         MediaTemplate: {
    //           Filename: "",
    //           Content: "",
    //           Parameters: [
    //             {}
    //           ],
    //           ContentType: "application/pdf",
    //           Template: "onboarding_msme_1",
    //           LangCode: "en"
    //         }
    //       }
    //     ],
    //     ResponseType: "json"
    //   }
    // }

    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    const payload = {
      data: encryptedData,
    };

    try {
      const res = await dispatch(WhatsappApi(payload));
      if (res?.meta?.requestStatus === 'fulfilled') {
        setApiErrorModalVisible(false);
        // navigation.navigate('CardDetails');
        // handleSetUserDetails();
      }
    } catch (error) {
      setApiErrorModalVisible(true);
      setApiErrorMsgHeader('WhatsApp Error!');
      setApiErrorMsg('Error in enabling Whatsapp');
      console.error('Error in handleWhatsapp:', error);
      // Optionally, you can handle the error further, e.g., show a user-friendly message
    }
  };

  const mobileNumberStore = async () => {
    await AsyncStorage.setItem('mobileNumber', mobileNumber);
  };

  const getJwtTokenApi = async () => {
    setLoading(true);
    const headers = {
      'x-api-key': apiHeaderKey,
      'Content-Type': 'application/json',
    };
    const data = {
      mobileNumber: `91${mobileNumber}`,
    };
    try {
      const response = await apiClientNoJwtHeaders.post(`/login`, data, {
        headers: headers,
      });

      if (response?.data?.accessToken != null) {
        const decodedPayload = await decodeJWT(response?.data?.accessToken);
        const expiryTimeInSeconds = decodedPayload.exp;

        await AsyncStorage.setItem('accessToken', response?.data?.accessToken);
        await AsyncStorage.setItem(
          'refreshToken',
          response?.data?.refreshToken,
        );
        await AsyncStorage.setItem(
          'expiryTime',
          expiryTimeInSeconds?.toString(),
        );
        setAccessToken(response?.data?.accessToken);
        if (isExistingCustomer === true) {
          getJourneyApi(response?.data?.accessToken);
        } else {
          navigation.navigate('CardDetails');
        }

        // getMsmeIdentifierApi(response?.data?.accessToken);
      } else {
        setLoading(false);
        setApiErrorMsg('Authorization is failed');
        setApiErrorModalVisible(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, 'Error in get jwt token');
    }
  };

  const handleWhatsappStore = async () => {
    const data = {
      mobileNumber: `91${mobileNumber}`,
      isWhatsappMessageEnabled: true,
    };
    const headers = {
      'X-Request-ID': 'COR',
      'x-api-key': apiHeaderKey,
    };
    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    const payload = {
      data: encryptedData,
    };

    try {
      const res = await apiClientNoJwtHeaders.post(
        '/enableWhatsappMessage',
        payload,
        {
          headers,
        },
      );
      if (res.status === 201) {
        getJwtTokenApi();
        // await AsyncStorage.setItem(
        //   'msmeIdentifier',
        //   res?.data?.data?.msmeIdentifier,
        // );
      }
    } catch (error) {
      console.error('Error in handleWhatsappStore:', error);
      // Optionally, you can handle the error further, e.g., show a user-friendly message
    }
  };

  const getJourneyApi = async accessToken => {
    if (accessToken) {
      const headers = {
        'x-api-key': apiHeaderKey,
        // 'Authorization': `Bearer ${accessToken}`
      };
      try {
        // let response = await axios.get(
        //   `http://172.191.44.222:80/api/get-user-journey/${msmeIdentifier}`,
        // );
        const response = await apiClient.get(
          `/get-user-journey`,
          {},
          { headers },
        );

        if (response?.data?.data != null && response?.data?.data?.length > 0) {
          if (
            response?.data?.data[0].is_aadhaar_validated == null ||
            !response?.data?.data[0].is_aadhaar_validated ||
            response?.data?.data[0].is_pan_validated == null ||
            !response?.data?.data[0].is_pan_validated ||
            response?.data?.data[0].udhyam_no == null
          ) {
            navigation.navigate('KycVerification');
          } else if (response?.data?.data[0].is_address_same == null) {
            navigation.navigate('AadharAddress');
          } else if (
            response?.data?.data[0].approved_loan_amount == null ||
            response?.data?.data[0].final_loan_amount == null
          ) {
            navigation.navigate('BreLoader');
          } else if (
            response?.data?.data[0].additional_details_submitted == null ||
            !response?.data?.data[0].additional_details_submitted
          ) {
            navigation.navigate('AdditionalDetails');
          } else if (
            response?.data?.data[0].is_vkyc_done == null ||
            !response?.data?.data[0].is_vkyc_done
          ) {
            navigation.navigate('StartVkyc');
          } else if (response?.data?.data[0].bank_account_number == null) {
            navigation.navigate('PaymentMethod');
          } else if (
            response?.data?.data[0].is_autodebit_enabled == null ||
            !response?.data?.data[0].is_autodebit_enabled
          ) {
            navigation.navigate('AutoDebtEMI');
          } else if (
            response?.data?.data[0].esign_completed == null ||
            !response?.data?.data[0].esign_completed
          ) {
            navigation.navigate('SignDocument');
          } else if (
            response?.data?.data[0].customer_id == null ||
            response?.data?.data[0].loan_account_number == null ||
            response?.data?.data[0].loan_disbusement_refno == null
          ) {
            navigation.navigate('ApplicationProcess');
          }
          //  else if (
          //   response?.data?.data[0].customer_id !== null &&
          //   response?.data?.data[0].loan_account_number !== null &&
          //   response?.data?.data[0].loan_disbusement_refno !== null
          // ) {
          //   await AsyncStorage.setItem('loanProcessed', true);
          //   navigation.navigate('SuccessView');
          // }
        }
      } catch (error) {
        console.log(error, 'ERROR IN GETTING journey');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.main}>
      {loading ? (
        <Loader
          loading={loading}
          loadingTxt="Processing"
          loaderSub="Please Wait!!"
        />
      ) : null}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headingText}>Verify your contact details</Text>
          <Text style={styles.subHeadingText}>
            You will receive OTP on your mobile number and email ID
          </Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberHeading}>10 digit mobile number</Text>
          <View
            style={[
              styles.textInputContainer,
              { borderColor: borderColorMobile },
            ]}>
            <TextInput
              // editable={!moibleEdit ? false : true}
              editable={false}
              style={styles.mobileNumberInput}
              value={mobileNumber}
              // onChangeText={e => {
              //   const digitsOnly = e.replace(/[^0-9]/g, '');
              //   setMobileNumber(digitsOnly);
              //   setBorderColorMobile('#E5E7EB');
              // }}
              placeholder="Enter Number"
              placeholderTextColor={'#6B7280'}
              keyboardType="number-pad"
            />
          </View>
          {errorMobileNumber ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image source={require('../../assets/images/info-circle.png')} />
              <Text style={styles.validationTextError}>
                Enter Valid Mobile Number
              </Text>
            </View>
          ) : null}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            {otpMobile?.length === 6 && !verifyMobile ? (
              <LoaderScreen
                loading={mobileValidatingLoader}
                loadingTxt={'Validating Mobile'}
              />
            ) : null}
            {mobileNumber?.length === 10 && !verifyMobile && showMobileOtp ? (
              <TouchableOpacity
                onPress={resendOtp}
                disabled={isButtonDisabled}
                style={{ marginLeft: 'auto' }}>
                <Text
                  style={[
                    styles.resendText,
                    isButtonDisabled ? styles.disabledText : styles.activeText,
                  ]}>
                  Resend OTP{' '}
                  {seconds > 0 ? `in ${formatTime(seconds)} secs` : ''}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {verifyMobile ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <CheckIcon
                size={25}
                name="check-circle"
                style={{ color: '#05C16E' }}
              />
              <Text style={styles.validationText}>
                Mobile Number verified successfully.
              </Text>
            </View>
          ) : null}
        </View>
        {showMobileOtp ? (
          <View>
            <View style={styles.otpContainer}>
              <OTPTextView
                defaultValue={otpMobile}
                handleTextChange={e => {
                  setOtpMobile(e);
                  setWrongOtpMobile(false);
                }}
                ref={otpInput}
                inputCount={6}
                textInputStyle={styles.otpStyles}
                tintColor={wrongOtpMobile ? 'red' : '#3E74DE'}
                offTintColor={wrongOtpMobile ? 'red' : '#3E74DE'}
                autoFocus={true}
              />
            </View>
            {wrongOtpMobile ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image
                  source={require('../../assets/images/info-circle.png')}
                />
                <Text style={styles.validationTextError}>Incorrect OTP</Text>
              </View>
            ) : null}
          </View>
        ) : null}
        {verifyMobile ? (
          <>
            <View style={styles.numberContainer}>
              <Text style={styles.numberHeading}>Email</Text>
              <View
                style={[
                  styles.textInputContainer,
                  { borderColor: borderColorEmail },
                ]}>
                <TextInput
                  style={styles.mobileNumberInput}
                  value={customerEmailId !== '' ? customerEmailId : email}
                  onChangeText={handleEmailChange}
                  placeholder="Enter Email ID"
                  placeholderTextColor={'#6B7280'}
                  editable={
                    customerEmailId !== '' ? false : !emailEdit ? false : true
                  }
                  onBlur={customerEmailId !== '' ? () => { } : handleSubmit}
                />
              </View>
              {errorEmail ? (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Image
                    source={require('../../assets/images/info-circle.png')}
                  />
                  <Text style={styles.validationTextError}>
                    Enter Valid Email Id
                  </Text>
                </View>
              ) : null}
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {otpEmail?.length === 6 && !verifyEmail ? (
                  <LoaderScreen
                    loading={emailValidatingLoader}
                    loadingTxt={'Validating Email'}
                  />
                ) : null}
                {email?.length > 0 && !verifyEmail && showEmailOtp ? (
                  <TouchableOpacity
                    onPress={resendEmailOtp}
                    disabled={isEmailButtonDisabled}>
                    <Text
                      style={[
                        styles.resendText,
                        isEmailButtonDisabled
                          ? styles.disabledText
                          : styles.activeText,
                      ]}>
                      Resend OTP{' '}
                      {secondsEmail > 0
                        ? `in ${formatTime(secondsEmail)} secs`
                        : ''}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              {verifyEmail || customerEmailId !== '' ? (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <CheckIcon
                    size={25}
                    name="check-circle"
                    style={{ color: '#05C16E' }}
                  />
                  <Text style={styles.validationText}>
                    Email verified successfully.
                  </Text>
                </View>
              ) : null}

              {showEmailOtp && email?.length > 0 ? (
                <View>
                  <View style={styles.otpContainer}>
                    <OTPTextView
                      defaultValue={otpEmail}
                      handleTextChange={e => {
                        setOtpEmail(e);
                        setWrongOtpEmail(false);
                        setBorderColorEmail('#E5E7EB');
                      }}
                      ref={otpInputEmail}
                      inputCount={6}
                      textInputStyle={styles.otpStyles}
                      tintColor={wrongOtpEmail ? 'red' : '#3E74DE'}
                      offTintColor={wrongOtpEmail ? 'red' : '#3E74DE'}
                      autoFocus={true}
                    />
                  </View>
                  {wrongOtpEmail ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <Image
                        source={require('../../assets/images/info-circle.png')}
                      />
                      <Text style={styles.validationTextError}>
                        Incorrect OTP
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
            {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: responsiveScreenHeight(2),
              justifyContent: 'space-between',
            }}>
            <View style={styles.marginLine}></View>
            <Text>OR</Text>
            <View style={styles.marginLine}></View>
          </View>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => setErrorModal(true)}>
            <Text style={styles.signInText}>Sign in with Google</Text>
            <Image source={require('../../assets/images/google.png')} />
          </TouchableOpacity> */}
          </>
        ) : null}
        <View style={styles.footer}>
          {verifyMobile && verifyEmail ? (
            <CommonButton
              text={'Proceed'}
              onPress={
                isExistingCustomer === true
                  ? getJwtTokenApi
                  : () => {
                    setModalOpen(true);
                  }
              }
            />
          ) : (
            <CommonButton
              text={'Proceed'}
              unable
            // onPress={() => navigation.navigate('KycVerification')}
            />
          )}
        </View>
        <CommonModal
          isVisible={modalOpen}
          onClose={() => setModalOpen(false)}
          content={'Whatsapp'}
          customStyles={{ justifyContent: 'center' }}
          whatsapp
          noButton
          onPressNo={() => setModalOpen(false)}
          onPressYes={() => {
            handleWhatsapp();
            handleWhatsappStore();
            handleSetUserDetails();
            setModalOpen(false);
          }}
          whatsappNumber={mobileNumber}
        />
        <CommonModal
          isVisible={errorModal}
          onClose={() => setErrorModal(false)}
          content={'Error Modal'}
          customStyles={{ justifyContent: 'flex-end' }}
          errorModal
          fetchDetails
        />
        <ApiErrorModal
          errorHeader={apiErrorMsgHeader}
          errorMsg={apiErrorMsg}
          visible={apiErrorModalVisible}
          onClose={() => setApiErrorModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

export default MobileVerification;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(6),
    backgroundColor: 'white',
    // height:'auto'
  },
  header: {
    marginTop: responsiveScreenHeight(8),
    gap: responsiveScreenHeight(1),
  },
  headingText: {
    color: 'black',
    fontSize: responsiveFontSize(3),
    fontFamily: 'Manrope-Bold',
  },
  subHeadingText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Manrope-Regular',
    lineHeight: responsiveScreenHeight(3),
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: responsiveScreenHeight(1),
    // borderColor: '#E1E3E8',
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveScreenWidth(2),
    gap: responsiveScreenWidth(1),
  },

  signIn: {
    borderWidth: 2,
    borderRadius: responsiveScreenHeight(1),
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveScreenWidth(2),
    gap: responsiveScreenWidth(1),
    justifyContent: 'center',
    paddingVertical: responsiveScreenHeight(1.5),
    marginTop: responsiveScreenHeight(2),
  },
  signInText: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-Bold',
  },
  countryCodeText: {
    fontSize: responsiveFontSize(2.5),
    color: '#9599B5',
  },
  numberHeading: {
    color: 'black',
    fontSize: responsiveFontSize(2.3),
    fontFamily: 'Manrope-Bold',
  },
  numberContainer: {
    marginTop: responsiveScreenHeight(2),
    gap: responsiveScreenHeight(1),
  },
  mobileNumberInput: {
    fontSize: responsiveFontSize(2.2),
    color: 'black',
    fontFamily: 'Manrope-Regular',

    width: responsiveScreenWidth(70),
  },
  otpContainer: {
    marginTop: responsiveScreenHeight(3),

    alignItems: 'center',
    paddingHorizontal: responsiveScreenWidth(1),
  },
  otpStyles: {
    borderWidth: 1,
    borderRadius: 10,
    height: responsiveScreenHeight(8),
    backgroundColor: '#F5F6FA',

    width: responsiveScreenWidth(12),
  },
  footerText: {
    fontFamily: 'Manrope-Bold',
    color: '#9599B5',
    fontSize: responsiveFontSize(1.6),
    textAlign: 'center',
  },
  footer: {
    marginTop: responsiveScreenHeight(15),
  },
  validationText: {
    color: '#05C16E',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Manrope-Bold',
  },
  validationTextError: {
    color: '#F05252',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Manrope-Bold',
  },
  marginLine: {
    width: responsiveScreenWidth(37),
    backgroundColor: '#9599B5',
    height: responsiveScreenHeight(0.05),
  },
  timerText: {
    textAlign: 'right',
    marginRight: responsiveScreenWidth(3),
    marginTop: responsiveScreenHeight(1),
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Manrope-SemiBold',
    color: 'black',
  },

  resendText: {
    fontSize: responsiveFontSize(1.6),
    marginTop: responsiveScreenHeight(1.5),
    textAlign: 'right',
  },
  disabledText: {
    color: 'gray',
  },
  activeText: {
    color: 'blue',
  },
});
