import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenHeader from '../../components/ScreenHeader';
import Margin from '../../components/Margin';
import {
  responsiveFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CommonButton from '../../components/CommonButton';
import {BottomSheet} from 'react-native-btr';
import CommonModal from '../../components/CommonModal';
import {WebView} from 'react-native-webview';
import {FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
import uuid from 'react-native-uuid';
import {useDispatch} from 'react-redux';
import {apiHeaderKey, enachApi} from '../../utils/baseUrl';
import Loader from '../../components/Loader';
import {useNavigation} from '@react-navigation/native';
import ApiErrorModal from '../../components/ApiErrorModel';
import apiClient from '../../utils/interceptor';
import {encryptObjectData} from '../../utils/encryptUtils';
 
const AutoDebtEMI = props => {
  const {navigation, route} = props;
  const iosNavigation = useNavigation();
 
  const {
    BankId,
    BankName,
    BankAccNo,
    BankIFSC,
    BenificiaryName,
    isExistingCustomer,
    SSFB,
  } = route?.params || {};
  const dispatch = useDispatch();
  console.log(route?.params, 'route?.params ');
 
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
 
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [htmlContent, setHtmlContent] = useState(null);
 
  const [availableMode, setAvailableMode] = useState([]);
  const [bankBenfName, setBankBenfName] = useState('');
  const [bankIfscCode, setbankIfscCode] = useState('');
  const [bankAccNum, setBankAccNum] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [refNumber, setRefNumber] = useState('');
 
  const [umrn, setUmrn] = useState('');
  console.log('umrn----->', umrn);
  const [referenceNumber, setReferenceNumber] = useState('');
  console.log('refrenceNumber---->', referenceNumber);
  const [status, setStatus] = useState('');
  console.log('refNumber------>', refNumber);
  const [errorDescription, setErrorDescription] = useState('');
  const [finalLoanAmount, setFinalLoanAmount] = useState('');
  const [loanInterestRate, setLoanInterestRate] = useState(null);
  const [selectedTenure, setSelectedTenure] = useState(null);
  const [eligibleAmount, setEligibleAmount] = useState(null);
  const [processingFees, setProcessingFees] = useState(null);
  const [emiAmount, setEmiAmount] = useState('');
  const [emiStartDate, setEmiStartDate] = useState(null);
  const [emiEndDate, setEmiEndDate] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [loanAccountNumber, setLoanAccountNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiErrorModalVisible, setApiErrorModalVisible] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState('');
 
  // useEffect(() => {
  //   if (status) {
  //     // handleSaveNpciDetails();
  //     if (status.toString() === 'Authorization Request Accepted') {
  //       setHtmlContent('');
  //       saveAccountDetails();
  //       // CIFCreation();
  //       navigation.navigate('SignDocument');
  //     } else {
  //       setLoading(false);
  //       setHtmlContent('');
  //       setModalError(true);
  //       setModalOpen(false);
  //     }
  //   }
  // }, [status]);
 
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
    console.log('ssfb', SSFB);
    if (SSFB) {
      console.log('ssfb1', SSFB);
      saveAccountDetails();
    } else {
      console.log('ssfb2', SSFB);
      getDetailSummary();
    }
  }, [SSFB]);
 
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
 
  function removeHyphensFromUUID(uuid) {
    return uuid.replace(/-/g, '');
  }
 
  let refNo = `ESPL${removeHyphensFromUUID(uuid.v4())
    .replace(/\D/g, '')
    .substring(0, 3)}`;
 
  const eNaachApiCall = async item => {
    //  setLoading(true)
    const refNo = `ESPL${removeHyphensFromUUID(uuid.v4())
      .replace(/\D/g, '')
      .substring(0, 3)}`;
    console.log('item--->', item);
    const mobileNumber = await AsyncStorage.getItem('mobileNumber');
    const url = enachApi;
 
    const data = {
      clientId: 'e762644e-a02e-4088-a09e-9656ec2b0a92',
      productCode: 'DEFAULT',
      referenceNumber: refNo,
      utilityCode: 'NACH00000000000019',
      categoryCode: 'L002',
      schmNm: 'Personal Loan',
      consRefNo: `ESPL${removeHyphensFromUUID(uuid.v4())
        .replace(/\D/g, '')
        .substring(0, 3)}`,
      seqTp: 'RCUR',
      frqcy: 'MNTH',
      frstColltnDt: emiStartDate,
      fnlColltnDt: emiEndDate,
      amountTp: 'MAXA',
      colltnAmt: emiAmount,
      dbtrNm: fullName,
      mobile: mobileNumber?.toString(),
      bnkId: 'ONMG',
      dbtrAccTp: 'SAVINGS',
      dbtrAccNo: BankAccNo,
      authMode: item,
      // authMode: 'NetBanking',
    };
 
    console.log('DataEnach---->', data);
 
    const urlParams = new URLSearchParams(data).toString();
 
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: 'JSESSIONID=E6E3066E44785DA71F5E31FAA5541392',
      'x-api-key': apiHeaderKey,
    };
 
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: urlParams,
      });
 
      const htmlResponse = await response.text();
      setHtmlContent(htmlResponse);
      console.log('ENachResponse------->', response);
 
      if (response.ok) {
        setRefNumber(refNo);
      }
 
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setBottomSheetOpen(false);
    } catch (error) {
      setLoading(false);
      setApiErrorModalVisible(true);
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };
 
  const handleStatus = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    const data = {
      referenceNumber: refNumber,
      // msmeIdentifier: msmeIdentifier,
    };
 
    const headers = {
      'x-api-key': apiHeaderKey,
      'Content-Type': 'application/json',
    };
    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    console.log('Encrypted Data:->', encryptedData);
    const payload = {
      data: encryptedData,
    };
    try {
      const response = await apiClient.post('/emandate/status', payload, {
        headers,
      });

      console.log('responseEMandate----->', response);

      if (response?.data?.Data?.RequestStatus === 'Authorized') {
        setModalError(false);
        setHtmlContent('');
        saveAccountDetails();
        // CIFCreation();
        setModalOpen(true);
      } else {
        setLoading(false);
        setHtmlContent('');
        setModalError(true);
        setModalOpen(false);
      }
    } catch (error) {
      console.log('error--->', error);
    }
  };
 
  // const handleSaveNpciDetails = async () => {
  //   setLoading(true);
  //   const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
  //   const data = {
  //     msmeIdentifier: msmeIdentifier,
  //     npciUmrn: umrn ?? '',
  //     npciReferenceNo: referenceNumber ?? '',
  //     npciStatus: status ?? '',
  //     npciTransactionDescription: errorDescription ?? '',
  //   };
  //   const headers = {'x-api-key': apiHeaderKey};
  //   try {
  //     const res = await apiClient.post('/saveNpciDetails', data, {
  //       headers: headers,
  //     });
  //     if (res.ok) {
  //     } else {
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     setApiErrorModalVisible(true);
  //   }
  // };
 
  const InfoCard = () => {
    return (
      <View style={styles.infoView}>
        <Text style={styles.autoEmi}>Enable EMI Auto-Debit</Text>
        <Text style={styles.confirm}>
          For easy repayment of your loan, it’s important that you set up EMI
          auto-debit. To enable,just log in securely with your NetBanking
          Credentials.
        </Text>
        <View style={styles.table}>
          <Text style={styles.rowTxt}>Loan Amount</Text>
          <Text style={styles.rowTxt}>
            {finalLoanAmount
              ? `₹ ${formatToIndianCurrency(finalLoanAmount)}`
              : 'Processing...'}
          </Text>
        </View>
        <View style={styles.table}>
          <Text style={styles.rowTxt}>EMI</Text>
          <Text style={styles.rowTxt}>
            {' '}
            {finalLoanAmount
              ? `₹ ${formatToIndianCurrency(emiAmount)}`
              : 'Processing...'}
          </Text>
        </View>
      </View>
    );
  };
 
  const BankCard = () => {
    return (
      <View style={styles.bankCardView}>
        <Text style={styles.nameBank}>
          {BankName} XXX{BankAccNo?.slice(-4)}
        </Text>
      </View>
    );
  };
 
  const getBankDetails = async () => {
    setLoading(true);
    // const url = `http://172.191.44.222:80/api/${BankId}/bank-details`;
    const headers = {'x-api-key': apiHeaderKey};
    try {
      const response = await apiClient.get(
        `/${BankId}/bank-details`,
        {},
        {headers: headers},
      );
 
      if (!response.ok) {
        // setApiErrorModalVisible(true);
        setLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
 
      if (response.ok) {
        setLoading(false);
        setAvailableMode(response?.data.data[0]?.available_modes);
        setBottomSheetOpen(true);
      }
    } catch (error) {
      setApiErrorModalVisible(true);
      setLoading(false);
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };
 
  const saveAccountDetails = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    // const url = `http://172.191.44.222:80/api/saveBankDetails`;
    const data = {
      bankName: BankName,
      bankAccountNumber: BankAccNo,
      bankIfscCode: BankIFSC,
      bankBenificiaryName: BenificiaryName,
    };
    const headers = {'x-api-key': apiHeaderKey};
    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    console.log('Encrypted Data:->', encryptedData);
    const payload = {
      data: encryptedData,
    };
    try {
      // const response = await fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      const response = await apiClient.post(`/saveBankDetails`, payload, {
        headers: headers,
      });
 
      if (!response.ok) {
        setLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response.data, 'res in save');
      if (response?.ok) {
        getDetailSummary();
        // navigation.navigate('SignDocument');
      }
    } catch (error) {
      setLoading(false);
      setApiErrorModalVisible(true);
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };
 
  const getDetailSummary = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    const headers = {'x-api-key': apiHeaderKey};
    try {
      // const response = await fetch(url, {
      //   method: 'GET',
      // });
      const response = await apiClient.get(
        `/user/summary`,
        {},
        {headers: headers},
      );
      console.log(response.data.data[0], 'res');
 
      if (response.ok) {
        setSummaryData(response?.data?.data[0]);
        setBankAccNum(response?.data?.data[0]?.bank_account_number);
        setBankBenfName(response?.data?.data[0]?.bank_beneficiary_name);
        setbankIfscCode(response?.data?.data[0]?.bank_ifsc_code);
        // setCustomerId(response?.data?.data[0]?.customer_id);
        setFinalLoanAmount(response?.data?.data[0]?.final_loan_amount);
        setLoanInterestRate(response?.data?.data[0]?.loan_interest_rate);
        setSelectedTenure(
          response?.data?.data[0]?.loan_total_duration_in_months,
        );
        setEligibleAmount(response?.data?.data[0]?.approved_loan_amount);
        setProcessingFees(response?.data?.data[0]?.processing_fees);
        setEmiAmount(response?.data?.data[0]?.monthly_emi_amount);
        setEmiStartDate(response?.data?.data[0]?.loan_first_emi_date);
        setEmiEndDate(response?.data?.data[0]?.loan_last_emi_date);
        setPhoneNumber(response?.data?.data[0]?.mobile_no);
        setFullName(response?.data?.data[0]?.full_name);
      }
      if (response?.data?.data[0]?.bank_account_number != null) {
        // if (errorModal === false) {
        //   setModalOpen(true);
        // } else {
        //   setModalOpen(false);
        // }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setApiErrorModalVisible(true);
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };
 
  const renderAvailableModes = ({item, index}) => {
    return (
      <View style={{width: '100%', backgroundColor: '#fff'}}>
        {/* <TouchableOpacity style={styles.cardsView} onPress={saveAccountDetails}> */}
        <TouchableOpacity
          style={styles.cardsView}
          onPress={() => eNaachApiCall(item)}>
          {/* <TouchableOpacity style={styles.cardsView} onPress={handleLoanCreation}> */}
          <Image
            source={require('../../assets/images/card.png')}
            style={styles.cardImg}
          />
          <Text style={styles.cardTxt}>{item}</Text>
        </TouchableOpacity>
        <Margin />
      </View>
    );
  };
 
  const RBSheet = () => {
    return (
      <BottomSheet
        visible={bottomSheetOpen}
        style={{height: 300}}
        onBackButtonPress={() => {
          setModalOpen(false);
          setBottomSheetOpen(false);
        }}
        onBackdropPress={() => {
          setModalOpen(false);
          setBottomSheetOpen(false);
        }}>
        <View
          style={{width: '100%', backgroundColor: '#fff', marginTop: 'auto'}}>
          <Text style={styles.bottom}>Select Mode of Authorization</Text>
          <Margin />
          <FlatList
            data={availableMode}
            renderItem={renderAvailableModes}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </BottomSheet>
    );
  };
  const onMessage = event => {
    const data = event.nativeEvent.data;
 
    // Extract information using regular expressions
    const umrnMatch = data.match(/UMRN: <span>(.*?)<\/span>/);
    const referenceNumberMatch = data.match(
      /Reference Number: <span>(.*?)<\/span>/,
    );
    const statusMatch = data.match(/Status: <span>(.*?)<\/span>/);
    const errorDescriptionMatch = data.match(
      /Error Description: <span>(.*?)<\/span>/,
    );
 
    console.log('UmrnMatch----->', umrnMatch);
    console.log('statusMatch----->', statusMatch);
 
    if (umrnMatch) setUmrn(umrnMatch[1]);
    console.log('umrnMatch----->', umrnMatch);
    if (referenceNumberMatch) setReferenceNumber(referenceNumberMatch[1]);
    console.log('referenceNumber----->', referenceNumber);
    if (statusMatch) setStatus(statusMatch[1]);
    console.log('status----->', status);
    if (errorDescriptionMatch) setErrorDescription(errorDescriptionMatch[1]);
  };
 
  const injectedJavaScript = `
  (function() {
    function getHtmlContent() {
      const htmlContent = document.documentElement.outerHTML;
      window.ReactNativeWebView.postMessage(htmlContent);
    }
 
    // Call getHtmlContent initially to send the HTML content
    getHtmlContent();
    // Optionally, you can set up a MutationObserver if you want to track changes dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
          getHtmlContent();
        }
      });
    });
 
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(document.body, config);
  })();
`;
 
  const handleNavigationChange = navState => {
    console.log('navState------>', navState);
    if (
      navState?.url === 'https://sandbox-hog.paycorp.io/closewebview' &&
      navState?.loading === true
    ) {
    }
  };
 
  const handleShouldStartLoadWithRequest = request => {
    const url = request.url;
    console.log('REquest---->', request);
    console.log('request.url---->', request?.url);
 
    if (request.url.startsWith('https://sandbox-hog.paycorp.io/closewebview')) {
      // setHtmlContent('');
      handleStatus();
      saveAccountDetails();
 
      return false;
    }
 
    return true;
  };
 
  return (
    <View style={styles.main}>
      {finalLoanAmount === '' ||
      finalLoanAmount === undefined ||
      finalLoanAmount === null ? (
        <ActivityIndicator
          style={{marginTop: 'auto', marginBottom: 'auto'}}
          size={'large'}
        />
      ) : (
        <View style={styles.main}>
          {htmlContent ? (
            <View style={{flex: 1}}>
              <WebView
                originWhitelist={['*']}
                source={{html: htmlContent}}
                style={{flex: 1}}
                onMessage={onMessage}
                injectedJavaScript={injectedJavaScript}
                onNavigationStateChange={handleNavigationChange}
                onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
              />
            </View>
          ) : (
            <View>
              <ScreenHeader
                headerText={'Enable EMI Auto-Debit'}
                backButton={true}
                width={'83%'}
                onPressBack={() => navigation.goBack()}
              />
              <Loader
                loading={loading}
                loadingTxt={'Processing'}
                loaderSub={'Please Wait!!'}
              />
              <ScrollView>
                <Margin />
                <Image
                  source={require('../../assets/images/autoemi.png')}
                  style={styles.img}
                />
                <InfoCard />
                <BankCard />
                <CommonButton text={'Enable Now'} onPress={getBankDetails} />
                <RBSheet />
                <CommonModal
                  customStyles={styles.modal}
                  customContentStyles={styles.customModal}
                  isVisible={modalOpen}
                  onClose={() => {
                    setModalOpen(false);
                    navigation.navigate('SignDocument');
                  }}
                  noHeader={true}
                  content={'emi'}
                  noButton={true}
                  emiAmount={emiAmount}
                  bankCode={`${BankName} XXX${BankAccNo.slice(-4)}`}
                />
              </ScrollView>
              {/* <CommonModal
                isVisible={errorModal}
                onClose={() => setErrorModal(false)}
                content={'Select Mode of Authorization'}
                customStyles={{justifyContent: 'flex-end'}}
                errorModal
                fetchDetails
                noButton
                selectMode
 
                // onSelect={handleSelect}
              /> */}
              <CommonModal
                isVisible={modalError}
                onClose={() => {
                  setModalError(false);
                  navigation.navigate('PaymentMethod');
                }}
                content={'Error Emi Modal'}
                customStyles={styles.modal}
                customContentStyles={styles.customModal}
                errorModal
                fetchDetails
                noButton
                emiErrorModal
 
                // onSelect={handleSelect}
              />
            </View>
          )}
          <ApiErrorModal
            visible={apiErrorModalVisible}
            onClose={() => setApiErrorModalVisible(false)}
          />
        </View>
      )}
    </View>
  );
};
 
export default AutoDebtEMI;
 
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  img: {
    height: responsiveFontSize(33),
    width: responsiveFontSize(33),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  autoEmi: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: responsiveFontSize(2.5),
    color: '#000',
    marginVertical: 20,
    textAlign: 'center',
  },
  confirm: {
    fontFamily: 'Manrope-Light',
    fontSize: responsiveFontSize(2.1),
    color: '#747B88',
    marginHorizontal: responsiveScreenWidth(2),
  },
  infoView: {
    marginHorizontal: responsiveScreenWidth(10),
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  table: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  rowTxt: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-MediumBold',
    color: '#000',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  bankCardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: responsiveScreenWidth(10),
    paddingVertical: 15,
    marginVertical: 20,
  },
  nameBank: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: responsiveFontSize(2),
    color: '#000',
    marginLeft: 15,
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  logoImg: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  bottom: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: responsiveFontSize(2.1),
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  cardImg: {
    height: 40,
    width: 40,
  },
  cardTxt: {
    fontFamily: 'Manrope-Medium',
    color: '#000',
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 20,
  },
  cardsView: {
    flexDirection: 'row',
    alignContent: 'center',
    padding: 15,
    marginHorizontal: 20,
  },
  modal: {
    justifyContent: 'center',
  },
  customModal: {
    width: '92%',
  },
});