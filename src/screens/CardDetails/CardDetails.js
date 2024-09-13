import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CommonButton from '../../components/CommonButton';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {BottomSheet} from 'react-native-btr';
import Icon from 'react-native-vector-icons/FontAwesome';

const CardDetails = ({navigation}) => {
  const iosNavigation = useNavigation();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [open, setOpen] = useState(false);

  const {mobileNumber, email} = useSelector(state => state.user);
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

  const termsAndConditions = `
- I am a tax resident of India above the age of 18 years.

- I am not an existing Customer of Suryoday Bank.

- I authorize the bank to carry out bureau checks as part of the journey.

- I understand, Account opened through this channel is intended for a single user only, and cannot be held jointly.

- I intend to open account with Suryoday Small finance Bank Ltd. I hereby voluntary submit my Aadhar to authenticate me from UIDAI via EKYC and give my consent to use Aadhar/ VID number for my KYC document.

- I am solely responsible for the data made available for opening the account.

- Bank shall not be liable for loss or distortion of data during transmission, technical fault or error during the opening of the account, for any reason whatsoever.

- I hereby authorise the Bank to verify my PAN online through the website of the Income Tax Department.

- I do agree to all the general Terms & Conditions which can be accessed at www.suryodaybank.com.

- I confirm having read, understood, and hereby agree to be bound by the terms & conditions which govern the opening of account(s) with Suryoday Small Finance Bank Limited and various services including but not limited to Micro ATM, Phone Banking, Debit Cards, Mobile Banking, Net Banking, Email Statements etc.

- All amendments there to be made from time to time in the terms and conditions and those relating to various services offered by the Bank as displayed on its notice board/website or as communicated to me including but not limited to the facilities listed in this form will be binding on me.

- I agree that the Bank may at its sole discretion discontinue any of the services completely or partially without any notice to me.

- I agree that the Bank may debit my account for the service charges applicable from time to time.

- Notwithstanding the documentation and the account opening form, the Bank reserves the right to accept/reject the application for account opening. The Bank’s decision in this regard would be final.

- In case of change of address due to relocation or any other reason, I would intimate the new address to the Bank within 2 weeks of such a change with a valid address proof.

- I declare that transactions in the linked account will be made from my legitimate sources only and the account will not be used for any purpose contrary to law.

- I will also keep watch on day-to-day transaction to detect early frauds, if any.

- I hereby declare that the information furnished above is true and correct to the best of my knowledge.

- I consent to receive the information/Service etc from marketing purpose through telephone/mobile/SMS/Email by the Bank/Its Executive.

- All accounts should maintain the stipulated average balance based on the product variant.

- In case of non-maintenance of the stipulated average balance, charges as outlined in the Schedule of Charges from time to time will be applicable.

- Do not call registry- I consent/ do not consent to receive the information/service etc for marketing purpose through “Telephone/mobile/ SMS/Email by the Bank/ its agent. I agree and acknowledge that only direct telephone numbers (not board/ general telephone numbers of offices/ corporates/ employers) will be accepted for registration of “Do Not Call”. I am aware that post registration, I may receive a call from the Bank to verify the correctness of the request for registration.

- Signature will not be updated in account at the time if onboarding as we are not issuing chequebook to customer at the time of onboarding.

- Any service request i.e., Address change, Mobile number updation, Email id updation, Cheque Book request etc, needs to be raised through offline mode by visiting branch post updation of signatures in Core Banking system.
`;

  const RBSheet = () => {
    const termsArray = termsAndConditions.trim().split('\n\n');

    return (
      <BottomSheet
        visible={open}
        style={{height: 700}}
        onBackButtonPress={() => {
          setOpen(false);
        }}
        onBackdropPress={() => {
          setOpen(false);
        }}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Terms and Conditions</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpen(false)}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            {termsArray.map((term, index) => (
              <Text key={index} style={styles.bottom}>
                {term.trim()}
              </Text>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
    );
  };

  return (
    <ScrollView style={styles.main}>
      <View style={styles.headerMain}>
        <Text style={styles.headingText}>Let's begin your process</Text>
        <Text style={styles.subHeadingText}>
          Keep following documents handy before we proceed
        </Text>
      </View>
      <View style={styles.adharContainer}>
        <Image source={require('../../assets/images/aadhaar-card.png')} />
        <Text style={styles.adharText}>Aadhaar Card</Text>
      </View>
      <View style={styles.adharContainer}>
        <Image source={require('../../assets/images/pan-card.png')} />
        <Text style={styles.adharText}>Pan Card</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setToggleCheckBox(!toggleCheckBox)}>
          <View style={styles.radioCircle}>
            {toggleCheckBox && (
              <Image source={require('../../assets/images/Checkboxitem.png')} />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Text style={styles.footerText}>
            By proceeding, you agree to{' '}
            <Text style={{color: '#3E74DE'}}>terms and conditions </Text>and
            <Text style={{color: '#3E74DE'}}> privacy policy</Text>
          </Text>
        </TouchableOpacity>
      </View>
      {toggleCheckBox ? (
        <CommonButton
          text={'Proceed'}
          onPress={() => navigation.navigate('KycVerification')}
        />
      ) : (
        <CommonButton text={'Proceed'} unable />
      )}
      <RBSheet />
    </ScrollView>
  );
};

export default CardDetails;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(8),
    backgroundColor: 'white',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMain: {
    marginTop: responsiveScreenHeight(3),
    gap: responsiveScreenHeight(1),
  },
  headingText: {
    color: 'black',
    fontSize: responsiveFontSize(3),
    fontFamily: 'Manrope-Bold',
  },
  adharText: {
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Manrope-Bold',
  },
  subHeadingText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Manrope-Regular',
    lineHeight: responsiveScreenHeight(3),
  },
  adharContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveScreenHeight(2),
    gap: responsiveScreenHeight(1),
  },
  footerText: {
    fontFamily: 'Manrope-Bold',
    color: '#9599B5',
    fontSize: responsiveFontSize(1.6),
    textAlign: 'center',
  },
  footer: {
    marginVertical: responsiveScreenHeight(3),
    gap: responsiveScreenHeight(1),
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: responsiveScreenWidth(3),
    marginRight: responsiveScreenWidth(4.3),
  },
  checkBox: {
    height: 20,
    width: 20,
    borderColor: '#CACDE1',
    borderWidth: 0.9,
    alignSelf: 'center',
    borderRadius: 4,
  },
  closeButtonText: {
    fontSize: 25,
    color: '#333',
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  closeButton: {
    backgroundColor: '#fff',
    paddingRight: 20,
    marginLeft: 'auto',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1D44E9',
    marginLeft: 'auto',
  },
  scrollView: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 'auto',
  },
  bottom: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
});
