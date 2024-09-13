import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const SMSModal = ({
  showSMS,
  showRecord,
  isVisible,
  onClose,
  customStyles,
  customContentStyles,
  onPressUsing,
  onPressDeny,
}) => {
  const requestLocationPermission = async permissionType => {
    try {
      let result;
      if (permissionType === 'always') {
        result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      } else if (permissionType === 'onlyThisTime') {
        result = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
      } else if (permissionType === 'deny') {
        result = RESULTS.DENIED;
      }

      if (result === RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
          },
          error => {
            console.log(error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else if (result === RESULTS.DENIED) {
        console.log('Permission denied');
      } else if (result === RESULTS.BLOCKED) {
        console.log('Permission blocked');
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={[styles.modalContainer, customStyles]}>
        <View style={[styles.modalContent, customContentStyles]}>
          <View style={styles.imgView}>
            <Image
              style={styles.img}
              source={require('../assets/images/msg.png')}
            />
          </View>
          <Text style={styles.location}>
            Allow
            <Text style={{fontFamily: 'Manrope-Bold'}}>Suryoday</Text>
            Bank to Send & Read your SMS
          </Text>
          <View style={styles.marginLine} />
          <View style={styles.txtView}>
            <TouchableOpacity
              onPress={() => {
                onPressUsing('using');
                requestLocationPermission('always');
              }}>
              <Text style={styles.txt}>Allow</Text>
            </TouchableOpacity>
            <View style={styles.marginLine} />
            <TouchableOpacity
              onPress={() => {
                onPressDeny('deny');
                requestLocationPermission('deny');
              }}>
              <Text style={styles.txt}>Deny</Text>
            </TouchableOpacity>
          </View>
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
    height: responsiveScreenHeight(30),
    width: '80%',
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
    marginBottom: responsiveScreenHeight(2),
    marginTop: 'auto',
    width: responsiveScreenWidth(70),
    backgroundColor: '#3E74DE',
  },
  location: {
    marginHorizontal: responsiveScreenWidth(18),
    fontSize: 13,
    textAlign: 'center',
    color: '#212121',
    lineHeight: 30,
    fontFamily: 'Manrope-Regular',
    marginVertical: 10,
  },
  img: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 10,
  },
  img2: {
    height: 120,
    width: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: responsiveHeight(2.3),
  },
  marginLine: {
    width: responsiveScreenWidth(80),
    backgroundColor: '#9599B5',
    height: responsiveScreenHeight(0.05),
  },
  txt: {
    color: '#3E74DE',
    fontFamily: 'Manrope-Medium',
    marginVertical: 10,
    fontSize: responsiveFontSize(2),
  },
  txtView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SMSModal;
