import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
const CommonButton = ({text, onPress, btnStyles, unable, btnTextStyles}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonStyle,
        btnStyles,
        {backgroundColor: unable ? 'lightgrey' : '#3E74DE'},
      ]}
      onPress={onPress}>
      <Text style={[styles.buttonText,btnTextStyles]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  buttonStyle: {
    width: responsiveScreenWidth(80),
    height: responsiveScreenHeight(5),
    // backgroundColor: '#3E74DE',
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: responsiveScreenHeight(5),
    // marginTop: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Manrope-Bold',
    fontSize: responsiveFontSize(2),
  },
});
