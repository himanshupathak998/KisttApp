import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RadioButton from './RadioButton';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CommonButton from './CommonButton';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconNew from 'react-native-vector-icons/EvilIcons';

const CommonModal = ({
  isVisible,
  onClose,
  content,
  customStyles,
  customContentStyles,
  onChange,
  onConfirm,
  noButton,
  onSelect,
  kyc,
  fetchDetails,
  noHeader,
  whatsapp,
  onPressYes,
  onPressNo,
  errorModal,
  selectMode,
  whatsappNumber,
  fetchDob,
  fetchName,
  fetchImageUrl,
  fetchFatherName,
  bankName,
  emiAmount,
  bankCode,
  emiErrorModal,
}) => {
  const renderContent = () => {
    switch (content) {
      case 'Select Mode of Authorization':
        return (
          <View>
            <View style={styles.marginLineDark}></View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveScreenWidth(4),
              }}
              onPress={onClose}>
              <Image source={require('../assets/images/card.png')} />
              <Text style={styles.rightText}>ATM/Debit Card</Text>
            </TouchableOpacity>
            <View style={styles.marginLineDark}></View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveScreenWidth(4),
              }}
              onPress={onClose}>
              <Image source={require('../assets/images/card.png')} />
              <Text style={styles.rightText}>Net Banking</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Error Modal':
        return (
          <View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 30,
              }}>
              <Image source={require('../assets/images/Globe.png')} />
              <Text
                style={[
                  styles.rightText,
                  {textAlign: 'center', marginTop: responsiveScreenHeight(2)},
                ]}>
                This services is not available in your city
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Manrope-Medium',
                marginBottom: responsiveScreenHeight(2),
                textAlign: 'center',
              }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's
            </Text>
          </View>
        );
      case 'Error Emi Modal':
        return (
          <View>
            <Image
              source={require('../assets/images/Error-icon.png')}
              style={{height: 78, width: 78, alignSelf: 'center'}}
            />
            <View style={[styles.buttonCont, {flexDirection: 'column'}]}>
              <Text style={[styles.vkycModal, {textAlign: 'center'}]}>
                Your EMI Auto-Debit is Rejected
              </Text>
              {/* <Text style={styles.vkycCaption}>
                All your loan EMIs and other dues,if any, will be automactically
                deducted from your bank account ever month
              </Text> */}
            </View>

            <CommonButton
              btnStyles={styles.okBtn}
              text={'Okay'}
              onPress={onClose}
            />
          </View>
        );
      case 'Whatsapp':
        return (
          <View>
            <View>
              <Text
                style={{
                  fontFamily: 'Manrope-Medium',
                  textAlign: 'center',
                  marginTop: responsiveScreenHeight(1),
                  fontSize: responsiveFontSize(1.8),
                  color: 'black'
                }}>
                <Text style={{fontFamily: 'Manrope-Bold', color: 'black'}}>
                  Suryoday Bank{' '}
                </Text>
                like to confirm if the phone number {whatsappNumber} has
                WhatsApp Account?
              </Text>
            </View>
            <View style={styles.marginLine}></View>
            <View>
              <TouchableOpacity onPress={onPressYes}>
                <Text
                  style={{
                    color: '#3E74DE',
                    fontFamily: 'Manrope-Bold',
                    textAlign: 'center',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.marginLine}></View>
            <View>
              <TouchableOpacity onPress={onPressNo}>
                <Text
                  style={{
                    color: '#3E74DE',
                    fontFamily: 'Manrope-Bold',
                    textAlign: 'center',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'CKYC Consent':
        return (
          <View
            style={{
              marginTop: responsiveScreenHeight(1.5),
              marginBottom: responsiveScreenHeight(5),
            }}>
            <Text style={styles.contentText}>
              I give my consent to Suryoday Small Finance Bank Limited to use my
              PAN Number to fetch my CKYC details from CERSAI, I understand that
              the data provided from CERSAI will not be used for any other
              purpose than processing of application
            </Text>
          </View>
        );
      case 'Fetch Details':
        return (
          <View
            style={{
              marginTop: responsiveScreenHeight(1.5),
              marginBottom: responsiveScreenHeight(5),
            }}>
            <View>
              <Text style={styles.headerText}>Details fetched from Aadhar</Text>
            </View>
            <View style={styles.detailsContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{gap: responsiveScreenHeight(0.5)}}>
                  <Text style={styles.leftText}>Name</Text>
                  <Text style={styles.rightText}>{fetchName}</Text>
                </View>
                <View>
                  {fetchImageUrl ? (
                    <Image
                      src={fetchImageUrl}
                      style={{
                        width: responsiveScreenWidth(16),
                        height: responsiveScreenHeight(8),
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <IconNew name="user" size={50} />
                  )}
                </View>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{gap: responsiveScreenHeight(0.5)}}>
                  <Text style={styles.leftText}>Father’s Name</Text>
                  <Text style={styles.rightText}>{fetchFatherName}</Text>
                </View>
                <View>{/* <IconNew name="user" size={50}/> */}</View>
              </View>
            </View>
          </View>
        );
      case 'Confirm Bank':
        return (
          <View>
            <View style={[styles.buttonCont, {alignSelf: 'flex-start'}]}>
              {/* <Image
                source={require('../assets/images/hdfc.png')}
                style={styles.accIcon}
              /> */}
              <Text
                style={[
                  styles.confirmBankText,
                  {fontSize: responsiveFontSize(2.5)},
                ]}>
                {bankName ?? ''}
              </Text>
            </View>
            <Text
              style={[styles.confirmBankText, {fontFamily: 'Manrope-Regular'}]}>
              Are you confirming that the above selected bank is salary bank.
              You will receive the loan amount in this bank only
            </Text>
            <CommonButton
              btnStyles={styles.okBtn}
              text={'Okay'}
              onPress={onConfirm}
            />
          </View>
        );
      case 'vkyc':
        return (
          <View>
            <Image
              source={require('../assets/images/verify.png')}
              style={{height: 78, width: 78}}
            />
            <View style={[styles.buttonCont, {flexDirection: 'column'}]}>
              <Text style={styles.vkycModal}>VKYC Completed</Text>
              <Text style={styles.vkycCaption}>
                You have successfully completed your VKYC. We'll update you once
                your account is created
              </Text>
            </View>
            <CommonButton
              btnStyles={styles.okBtn}
              text={'Okay'}
              onPress={onClose}
            />
          </View>
        );
      case 'emi':
        return (
          <View>
            <Image
              source={require('../assets/images/verified2.png')}
              style={{height: 78, width: 78, alignSelf: 'center'}}
            />
            <View style={[styles.buttonCont, {flexDirection: 'column'}]}>
              <Text style={[styles.vkycModal, {textAlign: 'center'}]}>
                Your EMI Auto-Debit is Enabled Successfully
              </Text>
              <Text style={styles.vkycCaption}>
                All your loan EMIs and other dues,if any, will be automactically
                deducted from your bank account every month
              </Text>
            </View>
            <View style={styles.bankCardView}>
              <View style={styles.icon}>
                <Image
                  source={require('../assets/images/hdfc.png')}
                  style={styles.logoImg}
                />
                <Text style={styles.nameBank}>{bankCode}</Text>
              </View>
            </View>
            <View style={[styles.bankCardView, {paddingVertical: 10}]}>
              <View style={styles.icon}>
                <Image
                  source={require('../assets/images/coins.png')}
                  style={styles.logoImg}
                />
                <View>
                  <Text style={styles.nameBank}>₹{emiAmount} EMI</Text>
                  <Text style={styles.emi}>5th of every month</Text>
                </View>
              </View>
            </View>
            <CommonButton
              btnStyles={styles.okBtn}
              text={'Okay'}
              onPress={onClose}
            />
          </View>
        );
      default:
        return <Text>Default Content...</Text>;
    }
  };

  const ModalHeader = () => {
    if (kyc) {
      return (
        <View style={styles.modalHeadView}>
          <View style={{gap: responsiveScreenHeight(3)}}>
            <Icon
              name="file-document-edit-outline"
              size={50}
              style={{color: 'black'}}
            />
            <Text style={styles.headTxt}>{content}</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" color={'#131523'} size={24} />
          </TouchableOpacity>
        </View>
      );
    }
    if (emiErrorModal) {
      return (
        <View style={styles.modalHeadView}>
          {/* <Text style={styles.headTxt}>{content}</Text> */}
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" color={'#131523'} size={24} />
          </TouchableOpacity>
        </View>
      );
    }
    if (selectMode) {
      return (
        <View style={styles.modalHeadView}>
          <View style={{gap: responsiveScreenHeight(3)}}>
            {/* <Icon
              name="file-document-edit-outline"
              size={50}
              style={{color: 'black'}}
            /> */}
            <Text style={[styles.headTxt, {fontSize: responsiveFontSize(2.5)}]}>
              {content}
            </Text>
          </View>
          {/* <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" color={'#131523'} size={24} />
          </TouchableOpacity> */}
        </View>
      );
    }
    if (fetchDetails) {
      return (
        <View style={styles.modalHeadView}>
          {/* <View style={{gap: responsiveScreenHeight(3)}}>
            <Icon
              name="file-document-edit-outline"
              size={50}
              style={{color: 'black'}}
            />
            <Text style={styles.headTxt}>{content}</Text>
          </View> */}
          <View style={{width: '100%', alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" color={'#131523'} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (whatsapp) {
      return (
        <View style={styles.modalHeadViewWhatsapp}>
          <View>
            <Image source={require('../assets/images/whatsapp.png')} />
          </View>
          {/* <View style={{ width: '100%', alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" color={'#131523'} size={24} />
            </TouchableOpacity>
          </View> */}
        </View>
      );
    }
    return (
      <>
        {!noHeader && (
          <View style={styles.modalHeadView}>
            <Text style={styles.headTxt}>{content}</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" color={'#131523'} size={24} />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={[styles.modalContainer, customStyles]}>
        <View
          style={[
            styles.modalContent,
            customContentStyles,
            {width: !errorModal ? '80%' : '100%'},
            {marginBottom: !errorModal ? 20 : 0},
          ]}>
          <ModalHeader />
          {/* <View style={styles.marginLine} /> */}
          {renderContent()}
          {/* <View style={styles.marginLine} /> */}
          {!noButton ? (
            <CommonButton
              text={'Confirm'}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    // width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 24,
    // marginBottom: 20,
  },
  modalHeadView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalHeadViewWhatsapp: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headTxt: {
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(3),
    // fontWeight: '700',
    color: '#131523',
  },
  headerText: {
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(2.2),
    // fontWeight: '700',
    color: '#131523',
  },
  confirmBtn: {
    marginBottom: responsiveScreenHeight(1),
    marginTop: responsiveScreenHeight(1),
    width: responsiveScreenWidth(65),
  },
  marginLine: {
    width: responsiveScreenWidth(80),
    backgroundColor: '#9599B5',
    height: responsiveScreenHeight(0.05),
    alignSelf: 'center',
    marginVertical: 20,
  },
  marginLineDark: {
    width: responsiveScreenWidth(100),
    backgroundColor: 'lightgrey',
    height: responsiveScreenHeight(0.1),
    alignSelf: 'center',
    marginVertical: 20,
  },
  confirmBankText: {
    color: 'black',
    fontFamily: 'Manrope-Bold',
    alignSelf: 'center',
    marginTop: 20,
  },
  accIcon: {
    height: 30,
    width: 30,
    marginLeft: 10,
    marginTop: 20,
  },
  buttonCont: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: responsiveScreenWidth(3),
    marginTop: responsiveScreenHeight(1),
  },
  buttonText: {
    color: '#05C16E',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-ExtraBold',
  },
  contentText: {
    fontFamily: 'Manrope-Medium',
  },
  leftText: {
    color: '#9599B5',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Manrope-Medium',
  },
  rightText: {
    color: 'black',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Manrope-Bold',
  },
  detailsContainer: {
    backgroundColor: '#F5F6FA',
    padding: 15,
    marginTop: responsiveScreenHeight(2),
    gap: responsiveScreenHeight(2),
  },
  vkycModal: {
    fontSize: responsiveFontSize(2.7),
    fontFamily: 'Manrope-Bold',
    color: '#111928',
  },
  vkycCaption: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: 'Manrope-Regular',
    color: '#6B7280',
  },
  okBtn: {
    marginTop: 40,
    width: responsiveWidth(70),
  },
  bankCardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    marginVertical: 5,
    width: '100%',
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
  emi: {
    color: '#6B7280',
    fontFamily: 'Manrope-Regular',
    fontSize: responsiveFontSize(1.6),
    marginHorizontal: 20,
  },
  // marginLine: {
  //   width: responsiveScreenWidth(100),
  //   backgroundColor: '#9599B5',
  //   height: responsiveScreenHeight(0.05),
  // },
});

export default CommonModal;
