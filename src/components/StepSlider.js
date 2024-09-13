import {StyleSheet, Text, View,Image} from 'react-native';
import React, {useState} from 'react';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

const StepSlider = ({piSelected,vkycSelected}) => {
  
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: responsiveScreenWidth(7),
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Image source={require('../assets/images/KYC.png')} />
          {/* <Text style={styles.sliderText}>KYC</Text> */}
        </View>
        <View style={[styles.sliderLine,{backgroundColor:piSelected?'#3E74DE' :'lightgrey'}]}></View>
        <View style={{alignItems: 'center'}}>
          {piSelected ? (
            <Image source={require('../assets/images/pi-selected.png')} />
          ) : (
            <Image source={require('../assets/images/pi-unselected.png')} />
          )}
          {/* <Text style={styles.sliderText}>Personal Info</Text> */}
        </View>
        <View style={[styles.sliderLine,{backgroundColor:vkycSelected?'#3E74DE' :'lightgrey'}]}></View>
        <View style={{alignItems: 'center'}}>
          <Image source={require('../assets/images/vkyc-unselected.png')} />
          {/* <Text style={styles.sliderText}>VKYC</Text> */}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: responsiveScreenWidth(8),
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.sliderText}>KYC</Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <Text style={styles.sliderTextl}>Personal Info</Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <Text style={styles.sliderText}>VKYC</Text>
        </View>
      </View>
    </View>
  );
};

export default StepSlider;

const styles = StyleSheet.create({
    sliderText: {
        color: 'black',
        fontSize: responsiveFontSize(2),
        fontFamily: 'Manrope-Bold',
      },
      sliderTextl: {
        color: 'black',
        fontSize: responsiveFontSize(2),
        fontFamily: 'Manrope-Bold',
        marginLeft:responsiveScreenWidth(3)
      },
      sliderLine: {
        // backgroundColor: 'lightgrey',
        height: responsiveScreenHeight(0.5),
        width: responsiveScreenWidth(22),
        borderRadius: 10,
      },
});
