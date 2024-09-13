import React from 'react';
import { Modal, View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { responsiveScreenWidth, responsiveScreenHeight, responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import CommonButton from './CommonButton'; // Make sure to adjust the import based on your project structure
import Icon from 'react-native-vector-icons/AntDesign'
const ApiErrorModal = ({ visible, onClose, errorHeader, errorMsg, imageName, btnText }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.iconView}>
            <Icon name='close' size={24} color={'#131523'} />
          </TouchableOpacity>
          <Image
            source={require('../assets/images/errpop.png')}
            style={styles.logoImg}
          />
          <View style={styles.msgView}>
            <Text style={styles.rightTextHeader}>
              {errorHeader || 'Error'}
            </Text>
            <Text style={styles.rightText}>
              {errorMsg || 'There was an error processing your request. Please try again.'}
            </Text>
          </View>
          <CommonButton
            btnStyles={styles.okBtn}
            text={btnText || 'Okay'}
            onPress={onClose}
            btnTextStyles={styles.btnTxt}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: responsiveScreenWidth(20),
    height: responsiveScreenHeight(20),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  okBtn: {
    marginTop: 10,
    height: responsiveScreenHeight(6),
    borderRadius: 15
  },
  btnTxt: {
    fontSize: 20
  },
  iconView: {
    marginLeft: 'auto',
    marginRight: responsiveScreenWidth(5),
    marginTop: responsiveHeight(2)
  },
  rightText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: responsiveFontSize(1.6),
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4

  },
  rightTextHeader: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: responsiveFontSize(2.5),
    color: '#111928',
  },
  msgView: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ApiErrorModal;
