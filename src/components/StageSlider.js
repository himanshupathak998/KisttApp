import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

const StageSlider = ({ vkyc, vkycDone, loan, loanDone, details, detailsDone, consent, consentDone }) => {

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingHorizontal: responsiveScreenWidth(7),
          alignItems: 'center',
        }}>
        <View style={{ alignItems: 'center' }}>
          <Image source={require('../assets/images/active.png')} style={{ width: 30, height: 30 }} />
          {/* <Text style={styles.sliderText}>KYC</Text> */}
        </View>
        <View style={[styles.sliderLine, { backgroundColor: '#236AF2' }]}></View>
        <View style={{ alignItems: 'center' }}>
          {/* {loan ? (
            <Image source={require('../assets/images/active.png')} style={{ width: 30, height: 30 }} />
          ) : (
            <Image source={require('../assets/images/Inactive2.png')} style={{ width: 30, height: 30 }} />
          )} */}
          <Image
            source={
              loanDone
                ? require('../assets/images/active.png') // If loan is done
                : loan
                  ? require('../assets/images/Inactive.png') // If loan is active but not done
                  : require('../assets/images/Inactive2.png') // If loan is inactive
            }
            style={{ width: 30, height: 30 }}
          />
          {/* <Text style={styles.sliderText}>Personal Info</Text> */}
        </View>
        <View style={[styles.sliderLine, { backgroundColor: loan ? '#3E74DE' : 'lightgrey' }]}></View>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={
              detailsDone
                ? require('../assets/images/active.png') // If loan is done
                : details
                  ? require('../assets/images/Inactive.png') // If loan is active but not done
                  : require('../assets/images/Inactive3.png') // If loan is inactive
            }
            style={{ width: 30, height: 30 }}
          />
        </View>
        <View style={[styles.sliderLine, { backgroundColor: details ? '#3E74DE' : 'lightgrey' }]}></View>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={
              consentDone
                ? require('../assets/images/active.png') // If loan is done
                : consent
                  ? require('../assets/images/Inactive.png') // If loan is active but not done
                  : require('../assets/images/Inactive4.png') // If loan is inactive
            }
            style={{ width: 30, height: 30 }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingHorizontal: responsiveScreenWidth(2),
          alignItems: 'center',
          marginTop: -10,
          marginLeft:2
        }}>
        <View>
          {vkyc ?
            <Image source={require('../assets/images/activesubK.png')}
              style={styles.subTitle}
            /> :
            <Image source={require('../assets/images/activesubK.png')}
              style={styles.subTitle}
            />
          }
        </View>
        <View style={styles.sliderLine2}></View>

        <View style={{ alignItems: 'center' }}>
          {loan ?
            <Image source={require('../assets/images/activesubL.png')}
              style={styles.subTitle}
            /> :
            <Image source={require('../assets/images/SubL.png')}
              style={styles.subTitle}
            />}
        </View>
        <View style={styles.sliderLine2}></View>

        <View style={{ alignItems: 'center' }}>
          {details ?
            <Image source={require('../assets/images/activesubD.png')}
              style={styles.subTitle}
            /> :
            <Image source={require('../assets/images/SubD.png')}
              style={styles.subTitle}
            />}
        </View>
        <View style={styles.sliderLine2}></View>

        <View style={{ alignItems: 'center' }}>
          {consent ?
            <Image source={require('../assets/images/activesubC.png')}
              style={styles.subTitle}
            /> :
            <Image source={require('../assets/images/SubC.png')}
              style={styles.subTitle}
            />}
        </View>
      </View>
    </View>
  );
};

export default StageSlider;

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
    marginLeft: responsiveScreenWidth(3)
  },
  sliderLine: {
    // backgroundColor: 'lightgrey',
    height: responsiveScreenHeight(0.5),
    width: responsiveScreenWidth(17.5),
    borderRadius: 10,
  },
  sliderLine2: {
    backgroundColor: '#FFF',
    height: responsiveScreenHeight(0.5),
    width: responsiveScreenWidth(7.5),
    borderRadius: 10,
  },
  subTitle: {
    width: 70,
    height: 70,
    resizeMode: 'contain'
  },
});
