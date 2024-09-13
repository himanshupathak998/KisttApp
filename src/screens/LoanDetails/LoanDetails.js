import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import React, {useState} from 'react';
import ScreenHeader from '../../components/ScreenHeader';
import LoanSlider from './LoanSlider';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CommonButton from '../../components/CommonButton';
import SuccesModal from './SuccesModal';
import Margin from '../../components/Margin';
import {useDispatch} from 'react-redux';
import {breApi, cfrApi} from '../../redux/reducers/authSlice';

const LoanDetails = props => {
  const dispatch = useDispatch();

  const {navigation} = props;
  const [modalOpen, setModalOpen] = useState(false);
  
  const loanSelection = () => {
    return (
      <View style={styles.card}>
        <Text style={styles.loanHeader}>
          How much Loan You are Looking for?
        </Text>
        <View style={styles.inputTxtView}>
          <TextInput
            style={styles.inputTxt}
            placeholder="Enter the Amount"
            value="₹ 2,70,000"
          />
        </View>
        <View style={styles.minMaxValue}>
          <Text style={styles.minAmount}>₹ 40,000</Text>
          <LoanSlider />
          <Text style={styles.minAmount}>₹ 2,40,000</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.mainContainer}>
      <ScreenHeader
        headerText={'Choose Loan Amount'}
        backButton={true}
        width={'90%'}
      />
      <Margin />
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTxt}>Select Loan Amount</Text>
        <Text style={styles.subHeaderTxt1}>
          Move the Slider or write to select your loan Amount
        </Text>
      </View>
      {loanSelection()}
      <View style={styles.btn}>
        <CommonButton
          text={'Submit'}
          btnStyles={styles.submitBtn}
          onPress={() => setModalOpen(true)}
        />
        <CommonButton
          text={'Submit'}
          btnStyles={styles.submitBtn}
          onPress={handleBre}
        />
      </View>
      <SuccesModal
        buttonText="Okay"
        isVisible={modalOpen}
        onClose={() => {
          navigation.navigate('LoanSummaryTable');
          setModalOpen(false);
        }}
      />
    </View>
  );
};

export default LoanDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loanHeader: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
  },
  progressValue: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: responsiveScreenHeight(2),
  },
  amount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Manrope-Bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  minMaxValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minAmount: {
    fontFamily: 'Manrope-SemiBold',
  },
  btn: {
    marginTop: 'auto',
  },
  submitBtn: {
    backgroundColor: '#00B8F5',
  },
  subHeader: {
    marginHorizontal: responsiveScreenWidth(6),
    paddingVertical: 10,
  },
  subHeaderTxt: {
    fontSize: responsiveFontSize(2.8),
    fontFamily: 'Manrope-ExtraBold',
    color: '#000',
  },
  subHeaderTxt1: {
    fontFamily: 'Manrope-SemiBold',
    color: '#000',
    fontSize: responsiveFontSize(1.6),
  },
  inputTxt: {
    fontSize: responsiveFontSize(3),
    textAlign: 'center',
    fontFamily: 'Manrope-Medium',
  },
  inputTxtView: {
    borderRadius: 20,
    borderWidth: 0.6,
    width: responsiveScreenWidth(50),
    height: responsiveScreenHeight(7),
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 30,
  },
});
