import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

const ScreenHeader = ({headerText, width, backButton,headerStyles,onPressBack}) => {
  
  return (
    <View
      style={[
        styles.headerContainer,
        {width: width},
        {justifyContent: backButton ? 'space-between' : 'center'},
      ]}>
      {backButton ? (
        <TouchableOpacity onPress={onPressBack}>
          <Image source={require('../assets/images/back.png')} />
        </TouchableOpacity>
      ) : null}
      <Text style={[styles.headerText,headerStyles]}>{headerText}</Text>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Manrope-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2.2),
  },
  headerContainer: {
    flexDirection: 'row',

    paddingHorizontal: responsiveScreenWidth(7),
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(2),
  },
});
