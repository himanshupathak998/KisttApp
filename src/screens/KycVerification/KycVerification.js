import {
  ActivityIndicator,
  BackHandler,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import StepSlider from '../../components/StepSlider';
import CommonTextInput from '../../components/CommonTextInput';
import OTPTextView from 'react-native-otp-textinput';
import CommonButton from '../../components/CommonButton';
import CommonModal from '../../components/CommonModal';
import CheckIcon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../../redux/reducers/userSlice';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { apiHeaderKey } from '../../utils/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ApiErrorModal from '../../components/ApiErrorModel';
import LoaderScreen from '../../components/LoaderScreen';
import StageSlider from '../../components/StageSlider';
import apiClient from '../../utils/interceptor';
import { encryptObjectData } from '../../utils/encryptUtils';

const KycVerification = ({ navigation }) => {
  const { mobileNumber, email, pan, udyamNumber } = useSelector(state => state.user);
  // const pan = useSelector(selectPan);
  // const udyamNumber = useSelector(selectUdyamNumber);

  const iosNavigation = useNavigation();

  const dispatch = useDispatch();
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [panAdharLinkModal, setPanAdharLinkModal] = useState(false);
  const [preFilledAdhar, setPreFilledAdhar] = useState(false);
  const [preFilledPan, setPreFilledPan] = useState(false);
  const [adhar, setAdhar] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [adharOtp, setAdharOtp] = useState('');
  const [panVerified, setPanVerified] = useState(false);
  const [adharVerified, setAdarVerified] = useState(false);
  const [adharError, setAdharError] = useState(false);
  const [udhyanVerified, setUdhyamVerified] = useState(false);
  const [udayam, setUdayam] = useState(udyamNumber);

  const [showAdharOtp, setShowAdharOtp] = useState(false);
  const [name, setName] = useState('');
  const [panNo, setPanNo] = useState(pan);
  const [address, setAddress] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [wrongOtp, setWrongOtp] = useState(false);
  const [borderColor, setBorderColor] = useState('#E5E7EB');
  const [loader, setLoader] = useState(false);
  const [panAdharLink, setPanAdharLink] = useState(false);
  const [sector, setSector] = useState('');

  const [PhotoUrl, setPhotoUrl] = useState('');
  const [gender, setGender] = useState('');
  const [adharRes, setAdharRes] = useState(false);
  const [apiErrorModalVisible, setApiErrorModalVisible] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState('');
  const [apiErrorMsgHeader, setApiErrorMsgHeader] = useState('');
  const [seconds, setSeconds] = useState(90);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [dateSelected, setDateSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [panLoder, setPanLoader] = useState(false);
  const [aadhaarLoader, setAadhaarLoader] = useState(false);
  const [udyamLoader, setUdyamLoader] = useState(false);
  const prevAdharRef = useRef('');
  const prevPan = useRef('');
  const prevUdyam = useRef('');

  const convertToISOString = dateString => {
    const date = new Date(dateString);
    date?.setUTCHours(19, 37, 0, 0); // Set the desired time to 19:37:00.000 UTC
    return date?.toISOString();
  };

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
  useFocusEffect(
    useCallback(() => {
      getDetailSummary();
    }, [navigation]),
  );
  const getDetailSummary = async () => {
    setLoading(true);
    const headers = { 'x-api-key': apiHeaderKey };

    try {
      const response = await apiClient.get('/user/summary', {}, { headers });

      if (response?.ok) {
        // setAdhar(response?.data?.data[0]?.aadhar_no);
        console.log('response in get details');
        if (response?.data?.data[0]?.aadhar_no !== null) {
          prevAdharRef.current = response?.data?.data[0]?.aadhar_no;
          setAdhar(response?.data?.data[0]?.aadhar_no);
          setPreFilledAdhar(true);
          setAdarVerified(true);
          setBorderColor('#05C16E');
          setName(response?.data?.data[0]?.full_name);
          setFatherName(response?.data?.data[0]?.father_name);
          setAdharRes(true);
          setPincode(response?.data?.data[0]?.a_address_pincode);
          setAddress(response?.data?.data[0]?.a_address_line1);
          setState(response?.data?.data[0]?.a_address_state);
          setLoading(false);
          if (response?.data?.data[0]?.pan_no !== null) {
            prevPan.current = response?.data?.data[0]?.pan_no;
            setPanNo(response?.data?.data[0]?.pan_no);
            setPreFilledPan(true);
            setPanVerified(true);
            setDateSelected(true);
            setDateOfBirth(convertToISOString(response?.data?.data[0]?.dob));
            if (response?.data?.data[0]?.udhyam_no !== null) {
              prevUdyam.current = response?.data?.data[0]?.udhyam_no;
              setUdayam(response?.data?.data[0]?.udhyam_no);
              setUdhyamVerified(true);
            }
          }
        }
        console.log('response in get details 2');
      } else {
        // throw new Error('Failed to fetch loan details');
      }
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      // Alert.alert('Error', 'Failed to load loan details');
    } finally {
      setLoading(false);
    }
  };

  const handleAdharChange = () => {
    if (adhar?.length === 0) {
      setAdharError(false);
    } else if (adhar?.length === 12 && preFilledAdhar === false) {
      setAdharError(false);
      sendAdharOtp();
      setShowAdharOtp(true);
    } else {
      setAdharError(true);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // This code will run when the screen comes into focus
      if (prevAdharRef.current !== adhar) {
        handleAdharChange();
        prevAdharRef.current = adhar;
      }
    }, [adhar]),
  );

  const storeName = async () => {
    await AsyncStorage.setItem('name', name);
  };

  const handleSetUserDetails = aadharData => {
    console.log(aadharData, 'aadharData');
    setName(aadharData.name);
    setAddress(aadharData.address);
    setFatherName(aadharData.fatherName);
    setState(aadharData.state);
    setCity(aadharData.city);
    setPincode(aadharData.pincode);
    setPhotoUrl(aadharData.photoUrl);
    setGender(aadharData.gender);

    const userDetails = {
      name: aadharData.name,
      address: aadharData.address,
      pincode: aadharData.pincode,
      dateOfBirth: formatDateString(dateOfBirth?.toDateString()),
      state: aadharData.state,
      city: aadharData.city,
      fatherName: aadharData.fatherName,
      PhotoUrl: aadharData.photoUrl,
      gender: aadharData.gender,
      mobileNumber: mobileNumber,
      email: email,
      adhar: adhar,
      pan: pan,
    };

    dispatch(setUserDetails(userDetails));
  };

  const panCheckValidate = () => {
    validatePAN(pan);
    if (pan?.length === 10 && validatePAN(pan)) {
      PanValidation();
    }
  }

  useEffect(() => {
    if (adharOtp?.length === 6) {
      ValidateAdharOtp();
    }
  }, [adharOtp]);

  useEffect(() => {
    let timer;
    if (adhar?.length === 12 && seconds > 0) {
      setIsButtonDisabled(true);
      timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds == 0) {
      setIsButtonDisabled(false);
    }
    return () => clearInterval(timer);
  }, [showAdharOtp, adhar, seconds]);

  const udyamValidateCheck = () => {
    if (udayam?.length === 19 && checkUdyamFormat(udayam) === true) {
      validateUdhayamm();
    }
  }

  const sendAdharOtp = async () => {
    const data = {
      aadharNumber: adhar,
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiHeaderKey,
    };

    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    console.log('Encrypted Data adhar:->', encryptedData);
    const payload = {
      data: encryptedData,
    };
    console.log(headers, 'headers');
    try {
      setLoader(true);

      const response = await apiClient.post(`/ekyc-otp`, payload, {
        headers,
      });
      console.log('SendOtpadarRes--->', response);
      if (response.ok) {
        setApiErrorModalVisible(false);
        setApiErrorMsg('');
        setApiErrorMsgHeader('');
      } else {
        setApiErrorModalVisible(true);
        setApiErrorMsgHeader('Error in send OTP');
        console.error(
          'Error in response:',
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      setApiErrorModalVisible(true);
      setApiErrorMsgHeader('Error in send OTP');
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    } finally {
      // setApiErrorModalVisible(false);
      setLoader(false);
    }
  };

  const ValidateAdharOtp = async () => {
    try {
      setAadhaarLoader(true);
      const data = {
        otp: adharOtp,
        stan: '242796',
        aadhaarNumber: adhar,
      };
      const headers = {
        'X-Request-ID': 'TNC',
        'X-Correlation-ID': '789456123789456',
        'X-User-ID': '12345',
        'x-api-key': apiHeaderKey,
      };

      // Encrypt the data
      const encryptedData = encryptObjectData(data, apiHeaderKey);
      console.log('Encrypted Data:->', encryptedData);
      const payload = {
        data: encryptedData,
      };
      const res = await apiClient.post(`/ekyc-v2`, payload, {
        headers: headers,
      });
      console.log('validateAdharRes---->', res);

      if (res.ok === true) {
        setAdharRes(res.ok);
        handleSetUserDetails(res?.data);
        setShowAdharOtp(false);
        setApiErrorModalVisible(false);
        setAdarVerified(true);
        setWrongOtp(false);
        setBorderColor('#05C16E');
        setAdharOtp('');
      } else {
        setWrongOtp(true);
        setBorderColor('red');
        setAdharOtp('');
        setApiErrorMsgHeader('OTP Validation failed');
        setApiErrorMsg('Something went wrong, please try again after sometime');
      }
    } catch (error) {
      setAdharOtp('');
      setApiErrorModalVisible(true);
      setApiErrorMsg('Something went wrong, please try again after sometime');
      setApiErrorMsgHeader('OTP Validation failed');
      setAadhaarLoader(false);
    } finally {
      setAdharOtp('');
      setAadhaarLoader(false);
    }
  };
  const convertTimestamp = timestamp => {
    const date = new Date(timestamp);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };
  const PanValidation = async () => {
    const data = {
      Data: [
        {
          Pan: pan,
          Name: name,
          FatherName: fatherName ? fatherName : '',
          DateOfBirth: convertTimestamp(dateOfBirth),
        },
      ],
    };
    const headers = {
      'X-Request-ID': 'COR',

      'Content-Type': 'application/json',
      'x-api-key': apiHeaderKey,
    };
    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    console.log('Encrypted Data:->', encryptedData);
    const payload = {
      data: encryptedData,
    };
    try {
      setPanLoader(true);

      const res = await apiClient.post(`/PanCardVerification`, payload, {
        headers: headers,
      });
      console.log(res, 'res in pan');
      if (res.status === 200) {
        if (res.data.panVerified === true) {
          setPanVerified(true);
          if (res.data.panAadhaarLink === true) {
            setPanAdharLink(true);
          } else {
            setPanAdharLinkModal(true);
            setApiErrorMsgHeader('PAN & Aadhaar Linking Issue');
            setApiErrorMsg(
              'Sorry we can not proceed as your PAN and Aadhaar is not linked',
            );
          }
        } else {
          setApiErrorMsg(null);
          setApiErrorModalVisible(true);
          setApiErrorMsgHeader('Error in Validating pan');
          setApiErrorMsg(
            'Please check the pan number entered,try again after sometime',
          );
        }
      } else {
        setPanLoader(false);
        setApiErrorModalVisible(true);
        setApiErrorMsgHeader('Error in Validating pan');
        setApiErrorMsg(
          'Please check the pan number entered,try again after sometime',
        );
      }
    } catch (error) {
      setPanLoader(false);
      setApiErrorModalVisible(true);
      setApiErrorMsgHeader('Error in Validating pan');
      setApiErrorMsg(
        'Please check the pan number entered,try again after sometime',
      );
    }
  };

  const udyamRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;

  const checkUdyamFormat = input => {
    return udyamRegex.test(input);
  };

  const validateUdhayamm = async () => {
    // const identifier = await AsyncStorage.getItem('msmeIdentifier');
    const data = {
      consent: 'Y',
      udyamRegistrationNo: udayam,
      isPDFRequired: 'Y',
      getEnterpriseDetails: 'Y',
      clientData: {
        caseId: 'COB0029218BPM',
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiHeaderKey,
    };
    setUdyamLoader(true);
    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    console.log('Encrypted Data:->', encryptedData);
    const payload = {
      data: encryptedData,
    };
    try {
      const res = await apiClient.post(`/udhyamAadhar`, payload, {
        headers: headers,
      });

      console.log('REsUdayam---->', res);

      if (res?.data?.statusCode === 101) {
        setUdhyamVerified(true);
        // await handleStoreUdyam();
        // setSector(
        //   `${res?.data?.result?.enterpriseType[0]?.enterpriseType} ${res?.data?.result?.industry[0]?.activity}`,
        // );
      } else {
        setApiErrorMsgHeader('Error in UDYAM verification');
        setApiErrorMsg('Something went wrong please try again after sometime.');
      }
    } catch (error) {
      console.error('Error in validateUdhayamm:', error);
      setApiErrorMsgHeader('Error in UDYAM verification');
      setApiErrorMsg('Something went wrong please try again after sometime.');
    } finally {
      // Stop loader only after all operations are completed
      setUdyamLoader(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDateOfBirth(date);
    hideDatePicker();
    setDateSelected(true);
    console.log('OriginalData---->', typeof date);
  };

  const formatDateString = dateString => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  function validatePAN(panNumber) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(panNumber);
  }

  const formatTime = totalSeconds => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const resendOtp = () => {
    // Implement the resend OTP logic here
    sendAdharOtp();
    setSeconds(90); // Reset timer
    setIsButtonDisabled(true); // Disable button again
  };

  const handleChangeAadhaar = e => {
    // Use a regular expression to replace non-digit characters
    const digitsOnly = e.replace(/[^0-9]/g, '');
    setAdhar(digitsOnly);
    setWrongOtp(false);
    setBorderColor('#E5E7EB');
  };
  // const handleChangePan = e => {
  //   const alphaNumeric = e.replace(/[^a-zA-Z0-9]/g, '');
  //   setPanNo(alphaNumeric);
  // };
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );
  const hundredYearsAgo = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate(),
  );

  const handleChangePan = input => {
    // Regular expression to match only capital letters and numbers
    const filteredInput = input.replace(/[^A-Z0-9]/g, '');
    setPanNo(filteredInput);
  };

  const handleUdayamChange = input => {
    // Regular expression to match only capital letters, numbers, and hyphens
    const filteredInput = input.replace(/[^A-Z0-9-]/g, '');
    setUdayam(filteredInput);
  };
  return (
    <>
      {loading && !pan && !udyamNumber ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size={'large'} />
          <Text>Please Wait...</Text>
        </View>
      ) : (
        <SafeAreaView style={styles.main}>
          <ScreenHeader
            headerText={'KYC Verification'}
            backButton={true}
            width={responsiveScreenWidth(75)}
            onPressBack={() => navigation.goBack()}
          />
          <View style={styles.marginLine}></View>
          <ScrollView>
            <View style={{ marginTop: responsiveScreenHeight(2) }}>
              <StageSlider />
            </View>
            <View style={styles.header}>
              <Text style={styles.headingText}>Verify your KYC details</Text>
              <Text style={styles.subHeadingText}>
                Please enter your Aadhar card details to verify your KYC details
              </Text>
            </View>
            <View style={styles.adharContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.adharText}>Aadhaar / VID</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (adharVerified) {
                      setModal2(true);
                    }
                  }}>
                  <Image
                    source={require('../../assets/images/infoNew.png')}
                    style={{
                      height: responsiveScreenHeight(5),
                      width: responsiveScreenWidth(8),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <CommonTextInput
                  editable={adharVerified ? false : true}
                  placeHolderText={'Enter your Aadhaar number'}
                  borderColor={borderColor}
                  borderWidth={1}
                  value={adhar}
                  handleChange={e => handleChangeAadhaar(e)}
                  keyboardType={'number-pad'}
                  maxLength={12}
                />
                {adharError && preFilledAdhar === false ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: responsiveScreenHeight(1),
                    }}>
                    <Image
                      source={require('../../assets/images/info-circle.png')}
                    />
                    <Text style={styles.validationTextError}>
                      Enter valid Aadhaar Number
                    </Text>
                  </View>
                ) : null}
                {adharVerified ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: responsiveScreenHeight(1),
                    }}>
                    <CheckIcon
                      size={25}
                      name="check-circle"
                      style={{ color: '#05C16E' }}
                    />
                    <Text style={styles.validationText}>
                      Aadhar Verified successfully
                    </Text>
                  </View>
                ) : null}
                {showAdharOtp && preFilledAdhar === false ? (
                  <TouchableOpacity
                    onPress={resendOtp}
                    disabled={isButtonDisabled}>
                    <Text
                      style={[
                        styles.resendText,
                        isButtonDisabled
                          ? styles.disabledText
                          : styles.activeText,
                      ]}>
                      Resend OTP{' '}
                      {seconds > 0 ? `in ${formatTime(seconds)} secs` : ''}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {adharOtp?.length === 6 && aadhaarLoader ? (
                  <LoaderScreen
                    loading={aadhaarLoader}
                    loadingTxt={'Validating Aadhaar'}
                  />
                ) : null}
              </View>
            </View>
            {showAdharOtp && preFilledAdhar === false ? (
              <View style={styles.otpContainer}>
                <OTPTextView
                  defaultValue={adharOtp}
                  handleTextChange={e => {
                    setAdharOtp(e);
                    setWrongOtp(false);
                    setBorderColor('#E5E7EB');
                  }}
                  ref={e => (otpInput = e)}
                  inputCount={6}
                  textInputStyle={styles.otpStyles}
                  tintColor={wrongOtp ? 'red' : '#3E74DE'}
                  offTintColor={wrongOtp ? 'red' : '#3E74DE'}
                  autoFocus={true}
                />
                {wrongOtp && preFilledAdhar === false ? (
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
            <View></View>
            <View style={styles.adharContainer}>
              <Text style={styles.adharText}>Date of Birth</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  // if (adharVerified) {
                  showDatePicker();
                  // }
                }}
                style={styles.textInputContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('../../assets/images/calendar.png')}
                    size={20}
                    style={{ marginRight: 10 }} // Adjust the spacing as needed
                  />

                  <View>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                      maximumDate={eighteenYearsAgo}
                      minimumDate={hundredYearsAgo}
                    />

                    {dateOfBirth && (
                      <Text style={styles.textInputStyle}>
                        {formatDateString(dateOfBirth?.toString())}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.adharContainer}>
              <Text style={styles.adharText}>PAN</Text>
              <View>
                <CommonTextInput
                  editable={false}
                  value={!!pan ? pan : panNo}
                  placeHolderText={'Enter your PAN number'}
                  borderColor={panVerified ? '#05C16E' : '#E5E7EB'}
                  borderWidth={1}
                  autoCapitalize={true}
                  maxLength={10}
                />
                {!panVerified &&
                  <TouchableOpacity onPress={panCheckValidate} style={styles.verifyLink}>
                    <Text style={styles.verify}>verify Pan</Text>
                  </TouchableOpacity>
                }
                {validatePAN(pan) === false &&
                  pan !== '' &&
                  preFilledPan === false ? (
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
                      Enter Valid PAN Number
                    </Text>
                  </View>
                ) : null}
                {panVerified ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: responsiveScreenHeight(1),
                    }}>
                    <CheckIcon
                      size={25}
                      name="check-circle"
                      style={{ color: '#05C16E' }}
                    />
                    <Text style={styles.validationText}>
                      PAN Verified successfully
                    </Text>
                  </View>
                ) : null}
                {validatePAN(pan) === true &&
                  pan !== '' &&
                  !panVerified &&
                  panLoder ? (
                  <LoaderScreen
                    loading={panLoder}
                    loadingTxt={'Validating pan'}
                  />
                ) : null}
              </View>
            </View>
            <View style={styles.adharContainer}>
              <Text style={styles.adharText}>Udyam Number</Text>
              <View>
                <>
                  <CommonTextInput
                    editable={
                      adharVerified === false ||
                        panVerified === false ||
                        dateSelected === false ||
                        udhyanVerified
                        ? false
                        : true
                    }
                    placeHolderText={'Enter your Udyam number'}
                    value={udayam}
                    handleChange={e => handleUdayamChange(e)}
                    borderColor={udhyanVerified ? '#05C16E' : '#E5E7EB'}
                    borderWidth={1}
                    autoCapitalize={true}
                  />
                  {!udhyanVerified &&
                    <TouchableOpacity onPress={udyamValidateCheck} style={styles.verifyLink}>
                      <Text style={styles.verify}>verify Udyam</Text>
                    </TouchableOpacity>
                  }
                  {udhyanVerified ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        marginTop: 10
                      }}>
                      <CheckIcon
                        size={25}
                        name="check-circle"
                        style={{ color: udhyanVerified ? '#05C16E' : '' }}
                      />
                      <Text style={styles.validationText}>
                        Udyam Verified successfully
                      </Text>
                    </View>
                  ) : null}

                  {checkUdyamFormat(udayam) === false &&
                    udayam !== '' &&
                    !udhyanVerified ? (
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
                        Enter Valid Udhyam Number
                      </Text>
                    </View>
                  ) : null}
                  {!udhyanVerified && udayam?.length === 19 && udyamLoader ? (
                    <LoaderScreen
                      loading={udyamLoader}
                      loadingTxt={'Validating Udhyam'}
                    />
                  ) : null}
                </>
              </View>
            </View>
            {/* ) : null} */}
            <View style={styles.buttonContainer}>
              {adharRes && adharVerified && panVerified && udhyanVerified ? (
                <CommonButton
                  text={'Proceed'}
                  onPress={() => {
                    if (
                      adharRes &&
                      adharVerified &&
                      panVerified &&
                      udhyanVerified
                    ) {
                      storeName();
                      navigation.navigate('AadharAddress', {
                        address: address,
                        pincode: pincode,
                        state: state,
                      });
                      // handleDedupe();
                    } else {
                      // setApiErrorModalVisible(true);
                    }
                  }}
                />
              ) : (
                <CommonButton text={'Proceed'} unable />
              )}
            </View>
          </ScrollView>
          <CommonModal
            isVisible={modal1}
            onClose={() => setModal1(false)}
            content={'CKYC Consent'}
            customStyles={{ justifyContent: 'center' }}
            kyc={true}
          />
          <CommonModal
            isVisible={modal2}
            onClose={() => setModal2(false)}
            content={'Fetch Details'}
            customStyles={{ justifyContent: 'center' }}
            fetchDetails
            fetchName={name}
            fetchDob={formatDateString(dateOfBirth?.toString())}
            fetchFatherName={fatherName}
            fetchImageUrl={PhotoUrl}
          />
          <ApiErrorModal
            visible={apiErrorModalVisible}
            onClose={() => setApiErrorModalVisible(false)}
            errorHeader={apiErrorMsgHeader}
            errorMsg={apiErrorMsg}
            btnText={'Close'}
          />
          <ApiErrorModal
            visible={panAdharLinkModal}
            onClose={() => setPanAdharLinkModal(false)}
            errorHeader={apiErrorMsgHeader}
            errorMsg={apiErrorMsg}
            btnText={'Close'}
          />
        </SafeAreaView>
      )}
    </>
  );
};

export default KycVerification;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginLine: {
    width: responsiveScreenWidth(100),
    backgroundColor: '#9599B5',
    height: responsiveScreenHeight(0.05),
  },
  header: {
    marginTop: responsiveScreenHeight(2),
    gap: responsiveScreenHeight(1),
    paddingHorizontal: responsiveScreenWidth(9),
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
  adharContainer: {
    paddingHorizontal: responsiveScreenWidth(9),
    marginTop: responsiveScreenHeight(3),
    // backgroundColor:'red',
    // justifyContent:'center',
    // height:responsiveScreenHeight(14),
    marginBottom: responsiveScreenHeight(2),
  },
  adharText: {
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Manrope-Bold',
  },
  otpContainer: {
    marginTop: responsiveScreenHeight(3),
    paddingHorizontal: responsiveScreenWidth(8),

    alignItems: 'center',
    width: responsiveScreenWidth(100),
  },
  otpStyles: {
    borderWidth: 1,
    borderRadius: 10,
    height: responsiveScreenHeight(8),
    backgroundColor: '#F5F6FA',
    tintColor: 'red',
    width: responsiveScreenWidth(12),
  },
  buttonContainer: {
    marginTop: responsiveScreenHeight(10),
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
  textInputContainer: {
    width: responsiveScreenWidth(85),

    backgroundColor: '#F5F6FA',
    alignSelf: 'center',
    paddingHorizontal: responsiveScreenWidth(3),
    gap: responsiveScreenWidth(2),

    marginTop: 20,
    gap: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveScreenHeight(1.5),
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  textInputStyle: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-Bold',
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
    fontSize: 18,
  },
  disabledText: {
    color: 'gray',
  },
  activeText: {
    color: 'blue',
  },
  verifyLink: {
    padding: 2,
  },
  verify: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: 'Manrope-Regular'
  }
});
