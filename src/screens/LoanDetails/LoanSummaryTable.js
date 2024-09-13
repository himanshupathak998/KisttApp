import {
  View,
  Text,
  StyleSheet,
  Image,
  BackHandler,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import TableComponent from '../../components/TableComponent';
import ScreenHeader from '../../components/ScreenHeader';
import CommonButton from '../../components/CommonButton';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Margin from '../../components/Margin';
import {useDispatch, useSelector} from 'react-redux';
import {amlValidate, dedupeCheck} from '../../redux/reducers/authSlice';
import LoanSlider from './LoanSlider';
import {Slider} from '@rneui/themed';
import {setUserDetails} from '../../redux/reducers/userSlice';
import {apiHeaderKey} from '../../utils/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../components/Loader';
import ApiErrorModal from '../../components/ApiErrorModel';
import StageSlider from '../../components/StageSlider';
import apiClient from '../../utils/interceptor';
import {encryptObjectData} from '../../utils/encryptUtils';

const LoanSummaryTable = ({navigation}) => {
  const dispatch = useDispatch();
  const iosNavigation = useNavigation();

  const {rate, minTenure, maxTenure, eligibleAmount, procFees, name} =
    useSelector(state => state.user);
  const [selectedAmountByUser, setSelectedAmountByUser] =
    useState(eligibleAmount);
  const [selectedTenure, setSelectedTenure] = useState(null);
  const [selectedEMIAmount, setSelectedEMIAmount] = useState(null);
  console.log('selectedEMIAmount------>', typeof selectedEMIAmount);

  // const [msmeIdentifier, setMsmeidentifier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiErrorModalVisible, setApiErrorModalVisible] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // useEffect(() => {
  //   getMsme();
  // }, []);

  // const getMsme = async () => {
  //   const identifier = await AsyncStorage.getItem('msmeIdentifier');
  //   setMsmeidentifier(identifier);
  // };

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

  function removeCurrencySymbol(currencyString) {
    // Remove the ₹ symbol and trim any whitespace
    return currencyString.replace(/₹|,/g, '').trim();
  }

  function removeMonthsText(timeString) {
    // Remove the " months" part from the string
    return timeString.replace(' months', '').trim();
  }

  // const maxMonth = 36;
  // const minMonth = 12;
  const ratei = rate;

  const headers = ['Tenure', 'Monthly EMI', 'Interest'];

  const calculateEMI = (principal, tenureMonths, annualRate) => {
    const monthlyRate = annualRate / (12 * 100);
    const numerator =
      principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
    const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
    return numerator / denominator;
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

  // const generateSlabs = (min, max) => {
  //   const slabs = [];
  //   for (let i = min; i <= max; i += 6) {
  //     slabs.push(i);
  //   }
  //   return slabs;
  // };

  // const slabs = generateSlabs(minMonth, maxMonth);
  const slabs = [12, 18, 24, 30, 36];
  const data = slabs.map(tenure => [
    `${tenure} months`,
    `₹ ${calculateEMI(selectedAmountByUser, tenure, ratei).toFixed(2)}`,
    `@ ${ratei}% p.a.`,
  ]);

  const handleSetUserDetails = () => {
    const userDetails = {
      name: name,
      minTenure: minTenure,
      maxTenure: maxTenure,
      eligibleAmount: eligibleAmount,
      procFees: procFees,
      rate: rate,
      selectedTenure: selectedTenure,
      value: selectedAmountByUser,
    };

    dispatch(setUserDetails(userDetails));
    // handleStoreAdharDetails();
  };

  let calculatedProcFees = selectedAmountByUser * 0.04; // 4% of selectedAmountByUser
  const finalProcFees = calculatedProcFees > 3000 ? calculatedProcFees : 3000;
  const finalProcFeeWithGST = finalProcFees + finalProcFees * 0.18;
  const handleSaveLoanInfo = async () => {
    setLoading(true);

    const data = {
      approvedLoanAmount: eligibleAmount.toString(),
      finalLoanAmount: selectedAmountByUser.toString(),
      processingfee: finalProcFeeWithGST.toString(),
      monthlyEMI: removeCurrencySymbol(selectedEMIAmount),
      loanDuration: removeMonthsText(selectedTenure),
      loanInterestRate: rate.toString(),
    };
    const headers = {'x-api-key': apiHeaderKey};
    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    console.log('Encrypted Data:->', encryptedData);
    const payload = {
      data: encryptedData,
    };
    try {
      const res = await apiClient.post('/saveLoanInformations', payload, {
        headers: headers,
      });
      if (res.ok) {
        setLoading(false);
        navigation.navigate('LoanSummary');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setApiErrorModalVisible(true);
    }
  };

  const Header = () => {
    return (
      <View style={styles.instantLoanView}>
        <View style={styles.headerView}>
          <Text style={styles.header}>Get Instant Loan</Text>
          <Text style={styles.amount}>
            ₹ {formatToIndianCurrency(selectedAmountByUser)}
          </Text>
        </View>
        <View>
          <Image
            source={require('../../assets/images/gift.png')}
            style={styles.gift}
          />
        </View>
      </View>
    );
  };

  const handleTenureChange = useCallback(
    newTenure => {
      setSelectedTenure(newTenure);
    },
    [setSelectedTenure],
  );

  const handleAmountChange = useCallback(
    newAmount => {
      setSelectedEMIAmount(newAmount);
    },
    [setSelectedEMIAmount],
  );

  const MemoizedTableComponent = React.memo(TableComponent);
  return (
    <View style={styles.mainView}>
      <ScreenHeader
        headerText={'Choose Loan Amount'}
        backButton={true}
        width={'82%'}
        onPressBack={() => navigation.goBack()}
      />
      <Loader loading={loading} loaderSub={'Please Wait!!'} />
      <Margin />
      <ScrollView style={{flex: 1}}>
        <View style={{marginTop: 5}}>
          <StageSlider loan />
        </View>
        <Header />
        <View style={styles.minMaxValue}>
          <Text style={styles.minAmount}>₹ 50,000</Text>
          <View style={styles.contentView}>
            <Slider
              value={selectedAmountByUser}
              onValueChange={item => {
                setSelectedAmountByUser(item);
                setSelectedTenure(null);
              }}
              maximumValue={eligibleAmount}
              minimumValue={50000}
              step={10000}
              allowTouchTrack
              trackStyle={{height: 5, backgroundColor: '#00B8F5'}}
              thumbStyle={{height: 20, width: 20, backgroundColor: '#00B8F5'}}
              minimumTrackTintColor="#3E74DE"
              maximumTrackTintColor="#E5E7EB"
              thumbProps={{
                children: (
                  <View>
                    <Image
                      source={require('../../assets/images/thumb1.png')}
                      style={{height: 28, width: 30, alignSelf: 'center'}}
                    />
                  </View>
                ),
              }}
            />
          </View>
          <Text style={styles.minAmount}>
            ₹ {formatToIndianCurrency(eligibleAmount)}
          </Text>
        </View>
        <MemoizedTableComponent
          data={data}
          headers={headers}
          selectedTenure={selectedTenure}
          setSelectedTenure={handleTenureChange}
          selectedAmount={selectedEMIAmount}
          setSelectedAmount={handleAmountChange}
        />
        {/* <TableComponent
        data={data}
        headers={headers}
        selectedTenure={selectedTenure}
        setSelectedTenure={setSelectedTenure}
        selectedAmount={selectedEMIAmount}
        setSelectedAmount={setSelectedEMIAmount}
      /> */}

        <View style={styles.caption}>
          <Text style={styles.captionTxt}>
            Suryoday Bank will charge a processing fee of Rs.
            {formatToIndianCurrency(finalProcFeeWithGST)} and Rate of interest
            will be <Text style={{color: 'black'}}> {rate}% </Text>
          </Text>
        </View>
        <View style={{marginBottom: -20}}>
          {selectedTenure ? (
            <CommonButton text={'Continue'} onPress={handleSaveLoanInfo} />
          ) : (
            <CommonButton unable text={'Continue'} />
          )}
        </View>
        <ApiErrorModal
          visible={apiErrorModalVisible}
          onClose={() => setApiErrorModalVisible(false)}
          errorHeader={'Error Saving Loan Info'}
          errorMsg={
            'Something went wrong in saving the information, please try again later'
          }
        />
      </ScrollView>
    </View>
  );
};

export default LoanSummaryTable;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  caption: {
    marginHorizontal: 30,
    marginTop: 'auto',
  },
  captionTxt: {
    lineHeight: 18,
    // marginTop: responsiveScreenHeight(1),
    fontSize: 12,
    fontFamily: 'Manrope-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
  instantLoanView: {
    borderColor: '#00B8F5',
    borderWidth: 0.8,
    marginVertical: 2,
    marginHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gift: {
    height: 150,
    width: 150,
  },
  header: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Manrope-Bold',
    color: '#000',
  },
  amount: {
    fontSize: responsiveFontSize(4),
    fontFamily: 'Manrope-Bold',
    color: '#000',
  },
  headerView: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  minMaxValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveScreenWidth(3.5),
    // marginTop: responsiveScreenHeight(5),
  },
  minAmount: {
    fontFamily: 'Manrope-SemiBold',
    color: 'black',
    // fontSize:responsiveFontSize(2)
  },
  contentView: {
    width: '60%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
