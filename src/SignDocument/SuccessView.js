import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import ScreenHeader from '../components/ScreenHeader';
import Margin from '../components/Margin';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CommonButton from '../components/CommonButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import {useNavigation} from '@react-navigation/native';
import {apiHeaderKey} from '../utils/baseUrl';
import apiClient from '../utils/interceptor';
const {width, height} = Dimensions.get('screen');

const SuccessView = ({navigation}) => {
  const iosNavigation = useNavigation();
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDetailSummary();
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    const unsubscribe = iosNavigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [iosNavigation]);

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

  const getDetailSummary = async () => {
    const headers = {'x-api-key': apiHeaderKey};
    try {
      setLoading(true);
      const response = await apiClient.get(
        '/user/summary',
        {},
        {headers: headers},
      );

      if (response?.data?.message === 'Summary retrieved successfully') {
        setAmount(response?.data?.data[0]?.final_loan_amount);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };
  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <View style={styles.main}>
          {/* <Loader loading={loading} /> */}
          <ScreenHeader
            headerText={'Success'}
            backButton={true}
            width={'65%'}
            onPressBack={() => navigation.goBack()}
          />
          <Margin />
          <View style={styles.content}>
            <Image
              source={require('../assets/images/Success1.png')}
              style={styles.img}
            />
          </View>
          <Text style={styles.grt}>Great</Text>
          <Text style={styles.grt1}>Congratulation!</Text>
          <Text style={styles.txt}>
            Your Loan account has been created successfully & loan amount of Rs
            ₹{formatToIndianCurrency(amount)} has been disbursed to your savings
            account.
          </Text>
          <View
            style={{
              backgroundColor: '#F5F6FA',
              marginHorizontal: responsiveScreenWidth(7),
              padding: 20,
              gap: responsiveScreenHeight(2),
              marginBottom: responsiveScreenHeight(2),
              borderRadius: 30,
              marginTop: responsiveScreenHeight(2),
            }}>
            <Text style={styles.headingText}>Loan Amount</Text>

            <Text style={styles.numberText}>
              ₹{formatToIndianCurrency(amount)}
            </Text>

            <Text style={styles.SubheadingText}>
              The due date is the 5th day of every month
            </Text>
          </View>
          <CommonButton text={'Done'} btnStyles={{marginTop: 'auto'}} />
        </View>
      )}
    </View>
  );
};

export default SuccessView;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  main: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  img: {
    height: 120,
    width: 120,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  grt: {
    color: '#20AE5C',
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
    paddingVertical: 10,
  },
  grt1: {
    color: '#111928',
    textAlign: 'center',
    fontFamily: 'Manrope-ExtraBold',
    fontSize: responsiveFontSize(2.6),
  },
  txt: {
    textAlign: 'center',
    marginHorizontal: 30,
    color: '#727272',
    fontFamily: 'Manrope-Medium',
    fontSize: responsiveFontSize(1.6),
    lineHeight: responsiveScreenHeight(3),
    paddingVertical: 10,
  },
  headingText: {
    color: '#000',
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(2.2),
    textAlign: 'center',
  },
  SubheadingText: {
    color: '#727272',
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(1.5),
    textAlign: 'center',
  },
  numberText: {
    color: '#05C16E',
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(3.5),
    textAlign: 'center',
  },
});
