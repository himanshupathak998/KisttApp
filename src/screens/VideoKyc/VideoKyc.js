import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StepSlider from './StepSlider';
import CommonButton from '../../components/CommonButton';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const VideoKyc = props => {
  const {navigation} = props;
  return (
    <SafeAreaView style={styles.container}>
      <StepSlider />
      <View style={styles.kycImg}>
        <MaterialIcons name="verified" size={80} color={'#08c46c'} />
      </View>
      <View style={styles.success}>
        <Text style={styles.successMain}>VKYC Completed</Text>
        <Text style={styles.successSub}>
          You have successfully completed your VKYC. We'll update once your
          account is created.
        </Text>
      </View>
      <View style={styles.btnView}>
        <CommonButton
          text={'kyc'}
          onPress={() => navigation.navigate('MobileVerification')}
        />
        <CommonButton
          text={'Loan'}
          onPress={() => navigation.navigate('LoanDetails')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  kycImg: {
    marginHorizontal: 35,
    marginTop: 30,
  },
  success: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
  successMain: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(4.5),
    paddingHorizontal: 8,
    color: '#000',
  },
  successSub: {
    marginVertical: 5,
    fontSize: responsiveFontSize(1.8),
    paddingHorizontal: 10,
    lineHeight: 25,
  },
  btnView: {
    alignSelf: 'center',
    marginTop: 'auto',
  },
});

export default VideoKyc;