import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import ScreenHeader from '../components/ScreenHeader';
import CommonButton from '../components/CommonButton';
import Margin from '../components/Margin';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {apiHeaderKey, apiKey} from '../utils/baseUrl';
import ApiErrorModal from '../components/ApiErrorModel';
import StageSlider from '../components/StageSlider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../utils/interceptor';

const {width, height} = Dimensions.get('screen');

const PaymentMethod = props => {
  const navigation = useNavigation(); // use navigation hook for consistent navigation
  const error = props?.route?.params || {};
  const {mobileNumber} = useSelector(state => state.user);
  const [bankList, setBankList] = useState({});
  const [bankListSSFB, setBankListSSFB] = useState([]);
  const [isSSFB, setIsSSFB] = useState(false);
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [apiErrorModalVisible, setApiErrorModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  console.log('selectedBank---->', selectedBank);
  console.log('isSSFB---->', isSSFB);

  const generateTimestamp = () => {
    const now = new Date();
    const isoTimestamp = now.toISOString();
    const formattedTimestamp = isoTimestamp
      .replace(/-/g, '')
      .replace(/:/g, '')
      .replace(/\./g, '')
      .replace('T', 'T')
      .replace('Z', 'Z');

    return `TNC${formattedTimestamp}`;
  };
  // const getBankSUPI = async () => {
  //   // const url = 'http://172.191.44.222:80/api/upiFetchManner';
  //   const data = {
  //     Data: {
  //       ClientReferenceId: generateTimestamp(),
  //       MerchantId: 'MER0000000000002',
  //       MerchantVpa: 'suryodayav@suryoday',
  //       UPINumber: mobileNumber,
  //     },
  //   };
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     'Api_key': 'kyqak5muymxcrjhc5q57vz9v',
  //   };

  //   try {
  //     // const response = await fetch(url, {
  //     //   method: 'POST',
  //     //   headers: headers,
  //     //   body: JSON.stringify(data),
  //     // });
  //     const response = await apiClient.post(
  //       `/upiFetchManner`,
  //       { headers },
  //       JSON.stringify(data),
  //     );
  //     console.log(response);

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     if (response.ok) {
  //       setBankList(response.data?.Data);
  //     }
  //   } catch (error) {
  //     console.error(
  //       'There has been a problem with your fetch operation:',
  //       error,
  //     );
  //     throw error;
  //   }
  // };

  useEffect(() => {
    if (!!error?.nameError || !!error?.failed) {
      setErrorModalVisible(true);
    } else {
      setErrorModalVisible(false);
    }
  }, [error]);

  const getBankSUPI = async () => {
    setLoading(true);
    // const msmeIdentifier =
    //   // '045E91863DC9DA3B5FD6B404B382AA46B6A5260450D560450EC47CA031CB14B2';
    //   await AsyncStorage.getItem('msmeIdentifier');
    // const url = 'http://172.191.44.222:80/api/upiFetchManner';

    const data = {
      Data: {
        ClientReferenceId: generateTimestamp(),
        MerchantId: 'MER0000000000002',
        MerchantVpa: 'suryodayav@suryoday',
        UPINumber: mobileNumber,
      },
    };
    const headers = {
      'Content-Type': 'application/json',
      'X-Request-ID': 'TNC',
      'x-api-key': apiHeaderKey,
    };

    try {
      // const response = await fetch(url, {
      //   method: 'POST',
      //   headers: headers,
      //   body: JSON.stringify(data),
      // });
      // http://137.117.104.94:80/api/upiFetchManner/?api_key=kyqak5muymxcrjhc5q57vz9v&msmeIdentifier=045E91863DC9DA3B5FD6B404B382AA46B6A5260450D560450EC47CA031CB14B2
      const response = await apiClient.post(
        `/upiFetchManner`,
        {},
        {headers: headers},
      );
      console.log('getBankResponse----->', response);

      if (!response.ok) {
        setLoading(false);
      }
      if (response.ok) {
        setLoading(false);
        if (response?.data?.ssfb) {
          setIsSSFB(true);
          setBankListSSFB(response.data?.data?.Data);
        } else {
          setBankList(response.data?.data?.Data); // we need to confirm
        }
        if (response?.data?.is_customer_exists) {
          setIsExistingCustomer(true);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
    }
  };
  useEffect(() => {
    if (!!error?.nameError || !!error?.failed) {
      setErrorModalVisible(true);
    } else {
      setErrorModalVisible(false);
    }
  }, [error]);

  useEffect(() => {
    getBankSUPI();
  }, []);

  // useEffect(() => {
  //   const handleBackPress = () => {
  //     return true; // return true to prevent default back behavior
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     handleBackPress,
  //   );

  //   const unsubscribe = navigation.addListener('beforeRemove', (e) => {
  //     e.preventDefault();
  //   });

  //   return () => {
  //     backHandler.remove();
  //     unsubscribe();
  //   };
  // }, [navigation]);

  const Header = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerView}>Select bank Amount</Text>
      </View>
    );
  };

  // const renderBankDetails = () => {
  //   return (
  //     <>
  //       <TouchableOpacity
  //         onPress={() => setIsChecked(!isChecked)}
  //         style={[
  //           styles.bankCardView,
  //           { borderColor: isChecked ? '#05C16E' : 'black' },
  //         ]}>
  //         <View style={styles.icon}>
  //           {/* <Image
  //             source={require('../assets/images/bankLogo.png')}
  //             style={styles.logoImg}
  //           /> */}
  //           <Text style={styles.nameBank}>
  //             {bankList.BankName} XXX {bankList?.PayeeAccountNumber?.slice(-4)}{' '}
  //           </Text>
  //         </View>
  //         {/* <Text style={styles.remove}>Remove</Text> */}
  //       </TouchableOpacity>
  //       <AddBankButton />
  //     </>
  //   );
  // };

  const renderBankDetails = () => {
    const handleBankSelect = bank => {
      setSelectedBank(bank);
    };

    return (
      <>
        {/* Render when bankList is an object with data */}
        {Object?.keys(bankList)?.length > 0 && (
          <TouchableOpacity
            onPress={() => handleBankSelect(bankList)}
            style={[
              styles.bankCardView,
              {
                borderColor:
                  selectedBank?.PayeeAccountNumber ===
                  bankList.PayeeAccountNumber
                    ? '#05C16E'
                    : 'black',
              },
            ]}>
            <View style={styles.icon}>
              <Text style={styles.nameBank}>
                {bankList?.IFSC?.substring(0, 4)} XXX{' '}
                {bankList?.PayeeAccountNumber?.slice(-4)}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Render when bankListSSFB is an array with data */}
        {bankListSSFB.length > 0 &&
          bankListSSFB.map((bank, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleBankSelect(bank)}
              style={[
                styles.bankCardView,
                {
                  borderColor:
                    selectedBank?.AccountNumber === bank.AccountNumber
                      ? '#05C16E'
                      : 'black',
                },
              ]}>
              <View style={styles.icon}>
                <Text style={styles.nameBank}>
                  {'SSFB'} XXX {bank?.AccountNumber?.slice(-4)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

        {!isSSFB && <AddBankButton />}
      </>
    );
  };

  const AddBankButton = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AccountDetails')}
        style={styles.addBank}>
        <AntDesign name="plus" size={24} color={'#000'} />
        <Text style={styles.btnTxt}>ADD BANK ACCOUNT</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {loading ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size={'large'} />
          <Text>Please Wait...</Text>
        </View>
      ) : (
        <View style={styles.main}>
          <ScreenHeader
            headerText={'Payment Method'}
            backButton={true}
            width={'75%'}
            onPressBack={() => navigation.goBack()}
          />
          <Margin />
          <View style={{marginTop: 15}}>
            <StageSlider loan loanDone details detailsDone consent />
          </View>
          <Header />
          {renderBankDetails()}
          {/* <View style={styles.err}>
            {error?.failed ? (
              <Text style={styles.errTxt}>
                Error in adding Account. Please try with different account
                Number.
              </Text>
            ) : null}
            {error?.nameError ? (
              <Text style={styles.errTxt}>
                Name as per Aadhaar is not matching with the name in given
                Account Number. Please try with different account Number.
              </Text>
            ) : null}
          </View> */}
          <View style={styles.btn}>
            {selectedBank ? (
              <CommonButton
                text={'Continue'}
                onPress={() =>
                  navigation.navigate('AutoDebtEMI', {
                    BankId: isSSFB ? '' : selectedBank?.IFSC?.substring(0, 4),
                    BankName: isSSFB
                      ? 'SSFB'
                      : selectedBank?.IFSC?.substring(0, 4),
                    BankAccNo: isSSFB
                      ? selectedBank?.AccountNumber
                      : selectedBank?.PayeeAccountNumber,
                    BankIFSC: isSSFB ? 'SURY0000011' : selectedBank?.IFSC,
                    BenificiaryName: isSSFB
                      ? selectedBank?.AcctName
                      : selectedBank?.VerifiedName ?? '',
                    isExistingCustomer: isExistingCustomer,
                    SSFB: isSSFB,
                  })
                }
              />
            ) : null}
          </View>
          <ApiErrorModal
            visible={errorModalVisible}
            errorHeader={"This bank doesn't support auto debit"}
            errorMsg={
              error?.nameError
                ? 'Name as per Aadhaar is not matching with the name in given Account Number.Please try with different account Number.'
                : error?.failed
                ? 'Error in adding Account.Please try with different account Number.'
                : 'There was an error processing your request. Please try again.'
            }
            btnText={'Add New Bank'}
            onClose={() => setErrorModalVisible(false)}
          />
        </View>
      )}
    </>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  headerView: {
    color: '#131523',
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(2.4),
    marginVertical: 10,
  },
  headTxt: {
    color: '#484B63',
    fontFamily: 'Manrope-Regular',
    fontSize: responsiveFontSize(1.5),
    lineHeight: 27,
  },
  header: {
    paddingHorizontal: 25,
  },
  main: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  logoImg: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  bankCardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 4,
    marginVertical: 10,
  },
  nameBank: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: responsiveFontSize(1.8),
    color: '#000',
    marginLeft: 10,
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: responsiveScreenHeight(2),
  },
  remove: {
    color: '#FF5B5B',
    marginHorizontal: 20,
  },
  addBank: {
    backgroundColor: '#98DDFF',
    marginHorizontal: 23,
    borderRadius: 10,
    flexDirection: 'row',
    paddingVertical: 16,
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  btnTxt: {
    color: '#000',
    fontSize: responsiveFontSize(1.7),
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Medium',
  },
  btn: {
    marginTop: 'auto',
  },
  err: {
    marginHorizontal: width * 0.07,
  },
  errTxt: {
    color: 'red',
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});
