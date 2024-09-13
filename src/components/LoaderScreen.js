import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

const LoaderScreen = ({ loading, loadingTxt, loaderSub }) => {
  if (!loading) return null;
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#3E74DE" />
      {loadingTxt ? <Text style={styles.laodtxt}>{loadingTxt}</Text> : null}
      {loaderSub ? <Text style={styles.laodtxtSub}>{loaderSub}</Text> : null}
    </View>
  );
};
export default LoaderScreen;

const styles = StyleSheet.create({
  container: {
    marginVertical: responsiveScreenHeight(1),
    flexDirection:'row'
  },
  laodtxt: {
    fontSize: responsiveFontSize(1.6),
    color: '#1F1F1F',
    fontFamily: 'Manrope-Bold',
    marginHorizontal:responsiveScreenWidth(2)
  },
  laodtxtSub: {
    fontSize: responsiveFontSize(1.4),
    color: '#FFF',
    fontFamily: 'Manrope-SemiBold',
    paddingVertical: responsiveScreenHeight(2)
  }
})
