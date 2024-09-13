import React from 'react';
import {Modal, View, Text, StyleSheet, Image} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CommonButton from '../../components/CommonButton';

const SuccesModal = ({
  isVisible,
  onClose,
  customStyles,
  customContentStyles,
  noButton,
  buttonText,
  eligibleAmount,
  processingFees,
  roi,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={[styles.modalContainer, customStyles]}>
        <View style={[styles.modalContent, customContentStyles]}>
          <Image
            source={require('../../assets/images/crown.png')}
            style={styles.img}
          />
          <Text style={styles.interest}>Your Loan is approved for</Text>
          <Text style={styles.amount}>₹ {eligibleAmount}</Text>
          <Text style={styles.interest}>
            Suryoday Bank will charge a processing fee of Rs. {processingFees}{' '}
            and <Text style={{color: 'black'}}> {roi}% </Text>
            rate of interest
          </Text>
          <View style={styles.celebView}>
            <Image
              source={require('../../assets/images/leftCeleb.png')}
              style={styles.celeb}
            />
            <Image
              source={require('../../assets/images/rightCeleb.png')}
              style={styles.celeb1}
            />
          </View>
          {!noButton ? (
            <CommonButton
              text={buttonText || 'Continue'}
              onPress={onClose}
              btnStyles={styles.confirmBtn}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: responsiveScreenHeight(55),
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  modalHeadView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headTxt: {
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(2.6),
    fontWeight: '700',
    color: '#131523',
  },
  confirmBtn: {
    marginBottom: responsiveScreenHeight(1),
    marginTop: responsiveScreenHeight(3),
    width: responsiveScreenWidth(70),
    backgroundColor: '#3E74DE',
  },
  interest: {
    marginHorizontal: responsiveScreenWidth(18),
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    lineHeight: responsiveScreenHeight(3),
    fontFamily: 'Manrope-SemiBold',
    marginTop: 'auto',
  },
  img: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  celeb: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  celeb1: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  celebView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  amount: {
    fontSize: responsiveFontSize(4),
    textAlign: 'center',
    fontFamily: 'Manrope-ExtraBold',
    color: '#000',
    marginBottom: responsiveScreenHeight(3),
  },
});

export default SuccesModal;
