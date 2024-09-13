import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ScreenHeader from '../../components/ScreenHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import CommonTextInput from '../../components/CommonTextInput';
import {TextInput} from 'react-native-gesture-handler';
import CommonButton from '../../components/CommonButton';
import {useDispatch, useSelector} from 'react-redux';
import {saveAddress} from '../../redux/reducers/authSlice';
import {apiHeaderKey, apiKey} from '../../utils/baseUrl';
import {useNavigation} from '@react-navigation/native';
import StageSlider from '../../components/StageSlider';
import apiClient from '../../utils/interceptor';

const AadharAddress = props => {
  const {navigation, route} = props;
  const iosNavigation = useNavigation();

  const dispatch = useDispatch();
  const {address, state, pincode} = route?.params || {};
  const [selected, setSelected] = useState(null);

  const [selectedNew, setSelectedNew] = useState(null);
  const [addressLine1, setAddressLine1] = useState('');
  const [paddressLine1, setpAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [paddressLine2, setpAddressLine2] = useState('');
  const [addressLine3, setAddressLine3] = useState('');
  const [paddressLine3, setpAddressLine3] = useState('');
  const [pinCode, setPincode] = useState('');
  const [ppinCode, setpPincode] = useState('');
  const [cityVal, setCityVal] = useState('');

  const [stateVal, setStateVal] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  // const [msmeIdentifier, setMsmeidentifier] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDetailSummary();
  }, []);

  const getDetailSummary = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    setLoading(true);
    const headers = {'x-api-key': apiHeaderKey};

    try {
      const response = await apiClient.get(
        '/user/summary',
        {},
        {headers: headers},
      );
      console.log('getDetailSummary----->', response?.data?.data);

      if (response?.ok) {
        if (response?.data?.data[0]?.aadhar_no !== null) {
          setPincode(response?.data?.data[0]?.a_address_pincode);
          setpPincode(response?.data?.data[0]?.a_address_pincode);
          setAddressLine1(response?.data?.data[0]?.a_address_line1);
          setpAddressLine1(response?.data?.data[0]?.a_address_line1);
          setAddressLine2(response?.data?.data[0]?.a_address_line2);
          setpAddressLine2(response?.data?.data[0]?.a_address_line2);
          setAddressLine3(response?.data?.data[0]?.a_address_line3);
          setpAddressLine3(response?.data?.data[0]?.a_address_line3);
          setStateVal(response?.data?.data[0]?.a_address_state);
          setLoading(false);
        }
      } else {
        throw new Error('Failed to fetch loan details');
      }
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      Alert.alert('Error', 'Failed to load loan details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pinCode?.length === 6) {
      getPincode();
    } else {
      setCityVal('');
      setStateVal('');
    }
  }, [pinCode]);

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

  // const getMsme = async () => {
  //   // const identifier = await AsyncStorage.getItem('msmeIdentifier');
  //   // setMsmeidentifier(identifier);
  //   getDetailSummary();
  // };

  // String removeExtraLeadingCharacters(String input) {
  //   final RegExp regExp = RegExp(r'^\s*s/o:\s*', caseSensitive: false);
  //   return input.replaceAll(regExp, '').trim();
  // }

  const getPincode = async () => {
    const headers = {
      'X-Request-ID': 'TNC',
      'Content-Type': 'application/json',
      'X-Correlation-ID': 'DIG123456789056',
      'x-api-key': apiHeaderKey,
    };
    const res = await apiClient.get(`/search-by-pincode/${pinCode}`, {} , {headers});
    if (res.ok === true) {
      setCityVal(res?.data?.Data?.ResponseData?.District);
      setStateVal(res?.data?.Data?.ResponseData?.StateName);
    }
  };
  const validatePincode = pincode => {
    const pincodePattern = /^[1-9][0-9]{5}$/;
    return pincodePattern.test(pincode);
  };

  const saveAdressDB = async () => {
    const data = {
      // msmeIdentifier: msmeIdentifier,
      isAddressSame: selected?.toString() === 'Yes' ? true : false,
      ...(selected?.toString() === 'No' && {
        cAddressLine1: addressLine1,
        cAddressLine2: addressLine2,
        cAddressLine3: addressLine3,
        cAddressCity: cityVal,
        cAddressState: stateVal,
        cAddressCountry: 'India',
        cAddressPincode: pinCode,
      }),
    };
    console.log('SaveAdressDb----->', data);

    dispatch(saveAddress(data)).then(res => {});
    setAddressLine1('');
    setAddressLine2('');
    setPincode('');
    setCityVal('');
    setStateVal('');
    navigation.navigate('BreLoader');
  };

  const handlePress = value => {
    setSelected(value);
  };
  const handlePressNew = value => {
    setSelectedNew(value);
    setIsChecked(true);
  };

  function formatAddress(poa) {
    const {house, street, lm, loc, dist} = poa;
    const parts = [house, street, lm, loc, dist].filter(Boolean); // Filter out falsy values
    return parts.join(', ');
  }

  return (
    <>
      {loading ? (
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
          <View style={{marginTop: responsiveScreenHeight(2)}}>
            <StageSlider />
          </View>
          <ScrollView>
            <View style={{paddingHorizontal: responsiveScreenWidth(6)}}>
              <Text style={styles.headerText}>
                Address Fetched from Aadhaar
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.leftText}>Address</Text>
                <Text style={styles.rightText}>
                  {/* {address} ,{state}-{pincode} */}
                  {paddressLine1}
                  {paddressLine2}
                  {paddressLine3} {stateVal}-{ppinCode}
                </Text>
              </View>
              <View style={{marginTop: responsiveScreenHeight(2)}}>
                <Text style={styles.rightText}>
                  Are you currently staying in the same address?
                </Text>
                <View style={styles.container}>
                  {['Yes', 'No'].map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.radioButton}
                      onPress={() => handlePress(option)}>
                      <View style={styles.radioCircle}>
                        {selected === option && (
                          <Icon name="check-circle" size={20} color={'blue'} />
                        )}
                      </View>
                      <Text style={styles.rightText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {selected?.toString() === 'No' ? (
                <View style={{marginTop: responsiveScreenHeight(2)}}>
                  <Text style={styles.rightText}>Current Address</Text>
                  <View style={{marginTop: responsiveScreenHeight(2)}}>
                    <Text style={styles.addressText}>Address Line 1</Text>
                    <CommonTextInput
                      value={addressLine1}
                      handleChange={setAddressLine1}
                      borderWidth={1}
                      borderColor={'lightgrey'}
                      maxLength={40}
                    />
                  </View>
                  <View style={{marginTop: responsiveScreenHeight(2)}}>
                    <Text style={styles.addressText}>Address Line 2</Text>
                    <CommonTextInput
                      value={addressLine2}
                      handleChange={setAddressLine2}
                      borderWidth={1}
                      borderColor={'lightgrey'}
                      maxLength={40}
                    />
                  </View>
                  <View style={{marginTop: responsiveScreenHeight(2)}}>
                    <Text style={styles.addressText}>Address Line 3</Text>
                    <CommonTextInput
                      value={addressLine3}
                      handleChange={setAddressLine3}
                      borderWidth={1}
                      borderColor={'lightgrey'}
                      maxLength={40}
                    />
                  </View>
                  <View style={{marginTop: responsiveScreenHeight(2)}}>
                    <Text style={styles.addressText}>Pincode</Text>
                    <CommonTextInput
                      value={pinCode}
                      handleChange={setPincode}
                      borderWidth={1}
                      borderColor={'lightgrey'}
                      maxLength={6}
                      keyboardType={'number-pad'}
                    />
                    {!validatePincode(pinCode) && pinCode !== '' ? (
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
                          Enter Valid Pincode
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: responsiveScreenHeight(2),
                    }}>
                    <View>
                      <Text style={styles.addressText}>City</Text>
                      <TextInput
                        value={cityVal}
                        // onChangeText={setCityVal}
                        style={styles.input}
                        editable={false}
                      />
                    </View>
                    <View>
                      <Text style={styles.addressText}>State</Text>
                      <TextInput
                        value={stateVal}
                        onChangeText={setStateVal}
                        style={styles.input}
                        editable={false}
                      />
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
            <View style={styles.footerView}>
              <View style={styles.containerNew}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handlePressNew(0)} // Assuming you only have one option
                >
                  <View style={styles.radioCircleNew}>
                    {selectedNew === 0 && (
                      <Image
                        source={require('../../assets/images/Checkboxitem.png')}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.footerText}>
                  I give my consent to Suryoday Small Finance Bank Limited
                </Text>
              </View>
              {isChecked ? (
                <CommonButton text={'Proceed'} onPress={saveAdressDB} />
              ) : (
                <CommonButton text={'Proceed'} unable />
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};
export default AadharAddress;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  marginLine: {
    width: responsiveScreenWidth(100),
    backgroundColor: '#9599B5',
    height: responsiveScreenHeight(0.05),
  },
  headerText: {
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Manrope-Bold',
    textAlign: 'center',
    marginTop: responsiveScreenHeight(2),
  },
  leftText: {
    color: '#9599B5',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Manrope-Medium',
  },
  rightText: {
    color: 'black',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Manrope-Bold',
  },
  addressText: {
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Manrope-Bold',
    marginLeft: responsiveScreenWidth(1.5),
  },
  detailsContainer: {
    backgroundColor: '#F5F6FA',
    padding: 15,
    marginTop: responsiveScreenHeight(2),
    gap: responsiveScreenHeight(2),
    borderRadius: 15,
  },
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    gap: responsiveScreenWidth(5),
    marginTop: responsiveScreenHeight(2),
  },
  containerNew: {
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    gap: responsiveScreenWidth(2),
    marginVertical: responsiveScreenHeight(2),
    // backgroundColor:'red',
    padding: 5,
    marginHorizontal: responsiveScreenWidth(10),
    marginRight: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleNew: {
    height: 24,
    width: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    height: 24,
    width: 24,
    borderRadius: 5,
    backgroundColor: '#2c3e50',
  },
  radioText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  input: {
    width: responsiveScreenWidth(40),

    backgroundColor: '#F5F6FA',
    alignSelf: 'center',
    padding: 15,

    marginTop: 20,
    gap: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-Bold',
  },
  footerText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Manrope-Medium',
    textAlign: 'left',
    paddingRight: 15,
  },
  footerView: {
    marginTop: responsiveScreenHeight(20),
  },
});
