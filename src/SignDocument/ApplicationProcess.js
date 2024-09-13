import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import ScreenHeader from '../components/ScreenHeader';
import Margin from '../components/Margin';
import CommonButton from '../components/CommonButton';
import {apiHeaderKey} from '../utils/baseUrl';
import {useFocusEffect} from '@react-navigation/native';
import apiClient from '../utils/interceptor';
import {encryptObjectData} from '../utils/encryptUtils';

const {width, height} = Dimensions.get('screen');

const ApplicationProcess = props => {
  useEffect(() => {
    handleProcessLoan();
  }, []);
  const {navigation} = props;

  const handleProcessLoan = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiHeaderKey,
    };

    try {
      const response = await apiClient.post(
        '/process-loan',
        {},
        {headers: headers},
      );
      console.log('HandleLoanResponse------>', response);
      if (
        response.data?.cifCreated &&
        response.data?.loanCreated &&
        response.data?.loanDisbursed
      ) {
        if (
          (!response?.data?.isSsfbAccountExists && response?.data?.imps) ||
          response?.data?.isSsfbAccountExists
        ) {
          // handleLoanCreationSms();
          // handleLoanDisbursementSms();
          // await AsyncStorage.setItem('loanProcessed', true);
          navigation.navigate('SuccessView');
        } else {
          console.log('Inner Else');
        }
      } else {
        // await AsyncStorage.setItem('loanProcessed', false);
        console.log('Outter Else');
      }
    } catch (error) {
      console.log(error, 'error in processing loan');
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const checkAndProcessLoan = async () => {
  //       const hasProcessed = await AsyncStorage.getItem('loanProcessed');
  //       if (!hasProcessed) {
  //         await handleProcessLoan();
  //       } else {
  //         console.log('Loan processing skipped, already processed.');
  //       }
  //     };

  //     checkAndProcessLoan();
  //   }, []),
  // );

  return (
    <View style={styles.mainView}>
      <ScreenHeader
        headerText={'Success'}
        backButton={true}
        onPressBack={() => navigation.goBack()}
        width={'70%'}
      />
      <Margin />
      <View style={styles.subView}>
        <Image
          source={require('../assets/images/inprocess.png')}
          style={styles.imgView}
        />
      </View>
      <View>
        <Text style={styles.appHead}>Application is being processed!</Text>
        <Text style={styles.sub}>
          Your application is being reviewed. Once your identity is verified,
          you will be updated.
        </Text>
      </View>
      <View>
        <Text style={styles.closeTxt}>You can close the Tab</Text>
      </View>
      {/* <CommonButton
        text={'Close'}
        btnStyles={styles.btn}
        onPress={() => navigation.navigate('SignDocument')}
      /> */}
    </View>
  );
};

export default ApplicationProcess;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  subView: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: height * 0.04,
  },
  imgView: {
    height: width * 0.25,
    width: width * 0.25,
    resizeMode: 'contain',
  },
  appHead: {
    fontSize: responsiveFontSize(2.3),
    fontFamily: 'Manrope-ExtraBold',
    color: '#3E74DE',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: width * 0.18,
    lineHeight: height * 0.045,
  },
  sub: {
    color: '#727272',
    fontFamily: 'Manrope-SemiBold',
    fontSize: responsiveFontSize(1.4),
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: width * 0.18,
    lineHeight: height * 0.04,
  },
  closeTxt: {
    color: '#3E74DE',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Manrope-Regular',
    textAlign: 'center',
    marginTop: height * 0.15,
  },
  btn: {
    marginTop: 'auto',
  },
});
