import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import SuccesModal from '../LoanDetails/SuccesModal';
import { useDispatch, useSelector } from 'react-redux';
import { breApi } from '../../redux/reducers/authSlice';
import { apiHeaderKey, apiKey } from '../../utils/baseUrl';
import { setUserDetails } from '../../redux/reducers/userSlice';
import { useNavigation } from '@react-navigation/native';
import { finishScreenTransition } from 'react-native-reanimated';
import ApiErrorModal from '../../components/ApiErrorModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../utils/interceptor';
import { encryptObjectData } from '../../utils/encryptUtils';

const BreLoader = ({ navigation }) => {
  const iosNavigation = useNavigation();
  const [rate, setRate] = useState('');

  const [maxTenure, setMaxTenure] = useState('');
  const [minTenure, setMinTenure] = useState();
  const [procFees, setProcFees] = useState();
  const [eligibleAmount, setEligibleAmount] = useState();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [permanentAddressLine1, setPermanentAddressLine1] = useState('');
  const [permanentAddressLine2, setPermanentAddressLine2] = useState('');
  const [permanentAddressLine3, setPermanentAddressLine3] = useState('');
  const [currentAddressLine1, setCurrentAddressLine1] = useState('');
  const [currentAddressLine2, setCurrentAddressLine2] = useState('');
  const [currentAddressLine3, setCurrentAddressLine3] = useState('');
  const [udayam, setUdayam] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [pan, setPan] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [udayamIncDate, setUdayamIncDate] = useState('');
  const [entityTypeUdyam, setEntityTypeUdyam] = useState('');
  const [udayamName, setUdayamName] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [breErrorMsg, setBreErrorMsg] = useState('');
  const [cPincode, setcPincode] = useState('');

  useEffect(() => {
    handleBre();
    // setModalVisible(true);
    // handleBre();
  }, []);

  // useEffect(() => {
  //   if (dob !== '') {
  //     getPincod();
  //   }
  // }, [dob]);

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

  function formatToIndianCurrency(amount) {
    const x = amount?.toString();
    const lastThree = x?.substring(x?.length - 3);
    const otherNumbers = x?.substring(0, x?.length - 3);
    const formattedNumber =
      otherNumbers !== ''
        ? otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
        : lastThree;
    return formattedNumber;
  }

  const getGender = initial => {
    if (initial === 'M') {
      return 'Male';
    } else if (initial === 'F') {
      return 'Female';
    } else {
      return 'Unknown';
    }
  };

  const handleBre = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');

    const headers = {
      'x-api-key': apiHeaderKey,
    };

    setLoading(true);
    // Encrypt the data

    try {
      const res = await apiClient.get(`bre/status`, {}, {headers: headers});
      console.log('Response------>', res);

      if (res?.status === 200) {
        setEligibleAmount(res?.data['Highest Surrogate']['Eligible Amt']);
        setMaxTenure(res?.data['Highest Surrogate']['Maximum Tenure(months)']);
        setMinTenure(res?.data['Highest Surrogate']['Minimum Tenure(months)']);
        setProcFees(res?.data['Highest Surrogate']['Processing Fee']);
        setRate(res?.data['Highest Surrogate']['Interest Rate(%)']);
        if (res?.data['Highest Surrogate']['Maximum Tenure(months)'] !== null) {
          setModalVisible(true);
        }
        setLoading(false);
      } else {
        if (res?.data['Highest Surrogate']['Failure Reason'] !== '') {
          setBreErrorMsg(res?.data['Highest Surrogate']['Failure Reason']);
          setLoading(false);
          setErrorModal(true);
        } else {
          setBreErrorMsg('Bre Failed');
          setLoading(false);
          setErrorModal(true);
        }
      }
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
      setLoading(false);
      // Optionall, handle specific error cases here
    }
  };

  const handleSetUserDetails = async () => {
    const userDetails = {
      rate: rate,
      minTenure: minTenure,
      maxTenure: maxTenure,
      eligibleAmount: eligibleAmount,
      procFees: procFees,
      name: name,
    };

    await dispatch(setUserDetails(userDetails));
  };

  return (
    <View style={styles.main}>
      <Loader
        loading={loading}
        loadingTxt={'Validating'}
        loaderSub={'Please Wait!!'}
      />
      <View
        style={{
          marginTop: responsiveScreenHeight(20),
          alignItems: 'center',
          paddingHorizontal: responsiveScreenWidth(10),
        }}>
        <Text style={styles.headingText}>Please Wait!</Text>
        <Text style={styles.subHeadingText}>
          We are verifying your profile to create a suitable offer for you
        </Text>
      </View>
      <SuccesModal
        buttonText="Okay"
        isVisible={modalVisible}
        eligibleAmount={formatToIndianCurrency(eligibleAmount)}
        processingFees={formatToIndianCurrency(procFees)}
        roi={rate}
        onClose={() => {
          handleSetUserDetails();
          navigation.navigate('LoanSummaryTable');
          setModalVisible(false);
        }}
      // onClose={handleBre}
      />
      <ApiErrorModal
        visible={errorModal}
        onClose={() => setErrorModal(false)}
        errorMsg={breErrorMsg}
      />
    </View>
  );
};

export default BreLoader;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent:'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
});

