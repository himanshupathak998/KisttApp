import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { Dropdown } from 'react-native-element-dropdown';

import ScreenHeader from '../../components/ScreenHeader';
import CommonButton from '../../components/CommonButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonModal from '../../components/CommonModal';
import { useSelector } from 'react-redux';
import { apiHeaderKey, apiKey } from '../../utils/baseUrl';
import ApiErrorModal from '../../components/ApiErrorModel';
import Loader from '../../components/Loader';
import StageSlider from '../../components/StageSlider';
import apiClient from '../../utils/interceptor';

const AccountDetails = props => {
  const { navigation } = props;
  const { name } = useSelector(state => state.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [IFSCCode, setIFSCCODE] = useState('');
  const [accNo, setAccNo] = useState('');
  const [confirnAcc, setConfirmAcc] = useState('');
  const [isValid, setIsValid] = useState(true);

  const [bankDetails, setBankDetails] = useState([]);
  const [summaryData, setSummaryData] = useState(null);

  const [apiErrorModalVisible, setApiErrorModalVisible] = useState(false);
  const [apiErrorMsgHeader, setApiErrorMsgHeader] = useState('');
  const [accountErr, setAccountErr] = useState('');
  const [bnkErr, setBnkErr] = useState('');
  const [bankLoader, setBankLoader] = useState(false);

  useEffect(() => {
    getBankListApi();
    getDetailSummary();
  }, []);

  const getBankListApi = async () => {
    // const url = 'http://172.191.44.222:80/api/all-live-banks';
    const headers = { 'x-api-key': apiHeaderKey };
    try {
      const response = await apiClient.get(
        '/all-live-banks',
        {},
        { headers: headers },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.ok) {
        setBankDetails(response?.data.data);
      }
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };

  const getDetailSummary = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    const headers = { 'x-api-key': apiHeaderKey };
    try {
      const response = await apiClient.get(
        '/user/summary',
        {},
        { headers: headers },
      );
      if (response.ok) {
        setSummaryData(response?.data?.data[0]);
      }
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      throw error;
    }
  };

  const pennyDropAPi = async () => {
    setBankLoader(true);
    if (accNo !== confirnAcc) {
      setBankLoader(false);
      setAccountErr("Account Number and confirm Account number doesn't match");
      return;
    } else if (value === null) {
      setBankLoader(false);
      setBnkErr('Please Select the bank');
      return;
    } else {
      const headers = {
        'Content-Type': 'application/json',
        'X-Request-ID': 'MHL',
        'X-User-ID': 'MHL123',
        'X-Transaction-ID': 'MHL1234567890',
        'x-api-key': apiHeaderKey,
      };

      try {
        console.log('IFSCCode', IFSCCode);
        const response = await apiClient.get(
          `pennyDropAccountVerification/${accNo}?consent=Y&ifsc=${IFSCCode}`,
          {},
          {headers},
        );
        console.log('pennyDropresponse----->', response);

        console.log('summaryData?.full_name---->', summaryData?.full_name);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = response.data?.Response?.Data;
        console.log(
          'responseData?.Result?.AccountName---->',
          responseData?.Result?.AccountName,
        );
        if (
          responseData?.Status === '00' &&
          responseData?.Result?.AccountName?.toUpperCase() !==
          summaryData?.full_name?.toUpperCase()
        ) {
          navigation.navigate('PaymentMethod', { nameError: true });
        } else if (responseData?.Status === 'FAILED') {
          navigation.navigate('PaymentMethod', { failed: true });
        } else {
          setBankLoader(false);
          setModalOpen(true);
        }
      } catch (error) {
        setBankLoader(false);
        setApiErrorModalVisible(true);
        setApiErrorMsgHeader('Error while adding the account!');
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
        throw error;
      }
    }
  };

  const handleIFSC = text => {
    const regex = /^[A-Z]{4}0[0-9]{6}$/;
    setIFSCCODE(text);
    setIsValid(regex.test(text));
  };

  const renderDropdownItem = item => {
    return (
      <Text style={[styles.renderBankTxt, { margin: 3 }]}>{item.bank_name}</Text>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Loader loading={bankLoader} loaderSub={'Please wait...'} />
      <ScreenHeader
        headerText={'Account Verification'}
        width={responsiveScreenWidth(80)}
        backButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.marginLine}></View>
      <View style={{ marginTop: 15 }}>
        <StageSlider loan loanDone details detailsDone consent />
      </View>

      <View style={styles.headContainer}>
        <Icon name="bank" size={25} color={'#00B8F5'} />
        <Text style={styles.headingText}>Verify Account</Text>
      </View>
      <ScrollView>
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.bankText}>Bank</Text>
            <TouchableOpacity style={styles.dropdownContainer}>
              <Dropdown
                search
                searchField={'bank_name'}
                searchPlaceholder="Search Bank..."
                placeholder={
                  value?.bank_name ? value?.bank_name : 'Select Bank'
                }
                accessibilityLabel="Select Bank"
                style={styles.dropdown}
                placeholderStyle={styles.bankText}
                selectedTextStyle={styles.selectedTextStyle}
                value={value?.bank_name}
                labelField="Select Bank"
                valueField="bank_id"
                renderItem={renderDropdownItem}
                data={bankDetails}
                onChange={item => {
                  setValue(item);
                }}
              />
            </TouchableOpacity>
          </View>
          {bnkErr !== '' ? <Text style={styles.errMsg}>{bnkErr}</Text> : null}
          <View style={styles.inputContainer}>
            <Text style={styles.bankText}>Enter IFSC Code</Text>
            <TextInput
              value={IFSCCode}
              onChangeText={handleIFSC}
              maxLength={11}
              style={[
                styles.textInput,
                { borderColor: isValid ? '#6D6D6D' : 'red' },
              ]}
              autoCapitalize="characters"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.bankText}>Enter Account Number</Text>
            <TextInput
              value={accNo}
              onChangeText={setAccNo}
              style={styles.textInput}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.bankText}>Confirm Account Number</Text>
            <TextInput
              value={confirnAcc}
              onChangeText={setConfirmAcc}
              style={styles.textInput}
            />
          </View>
          {accountErr !== '' ? (
            <Text style={styles.errMsg}>{accountErr}</Text>
          ) : null}
          <View style={styles.textContainer}>
            <Text style={styles.belowText}>
              Note: Your loan amount will be tranferred to and EMIs be deducted
              from this account.
            </Text>
          </View>
        </View>

        <View style={styles.btnView}>
          <CommonButton text={'Verify Now'} onPress={pennyDropAPi} />
        </View>
      </ScrollView>
      <CommonModal
        bankName={value?.bank_name}
        isVisible={modalOpen}
        content={'Confirm Bank'}
        onConfirm={() => {
          setModalOpen(false);
          navigation.navigate('AutoDebtEMI', {
            BankId: value?.bank_id,
            BankName: value?.bank_name,
            BankAccNo: accNo,
            BankIFSC: IFSCCode,
            BenificiaryName: summaryData?.full_name,
            SSFB: false,
          });
        }}
        noButton={true}
        customStyles={{ justifyContent: 'center' }}
      />
      <ApiErrorModal
        visible={apiErrorModalVisible}
        errorHeader={apiErrorMsgHeader}
        onClose={() => setApiErrorModalVisible(false)}
      />
    </View>
  );
};

export default AccountDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  dropdown: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: '100%',
    paddingVertical: responsiveScreenHeight(1),
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  marginLine: {
    width: responsiveScreenWidth(100),
    backgroundColor: '#9599B5',
    height: responsiveScreenHeight(0.05),
  },
  headingText: {
    fontFamily: 'Manrope-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2.4),
  },
  bankText: {
    color: '#484B63',
    fontFamily: 'Manrope-Medium',
    fontSize: responsiveFontSize(2.2),
    padding: 5,
  },
  renderBankTxt: {
    color: '#111928',
    fontFamily: 'Manrope-Medium',
    fontSize: responsiveFontSize(2.2),
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: responsiveScreenWidth(7),
    marginTop: responsiveScreenHeight(1),
    gap: responsiveScreenWidth(2),
  },
  belowText: {
    textAlign: 'center',
    color: '#6D6D6D',
    fontFamily: 'Manrope-Medium',
    fontSize: responsiveFontSize(1.8),
  },
  textContainer: {
    paddingHorizontal: responsiveScreenWidth(3),
    marginTop: responsiveScreenHeight(2),
  },
  btnView: {
    marginTop: responsiveScreenHeight(10),
  },
  contentContainer: {
    backgroundColor: '#F5F6FA',
    padding: 20,
    marginHorizontal: responsiveScreenWidth(7),
    marginTop: responsiveScreenHeight(3),
    borderRadius: 10,
  },
  dropdownContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#6D6D6D',
  },
  inputContainer: {
    marginTop: responsiveScreenHeight(1.5),
  },
  textInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#6D6D6D',
    color: 'black',
    fontFamily: 'Manrope-Medium',
    fontSize: responsiveFontSize(2.2),
  },
  errMsg: {
    color: '#F05252',
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(1.5),
  },
});
