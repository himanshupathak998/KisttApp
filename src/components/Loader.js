// Loader.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Dimensions } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight } from 'react-native-responsive-dimensions';

const { height, width } = Dimensions.get('window');

const Loader = ({ loading, loadingTxt, loaderSub }) => {
  if (!loading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3E74DE" style={styles.activityIndicator} />
      {loadingTxt ? <Text style={styles.laodtxt}>{loadingTxt}</Text> : null}
      {loaderSub ? <Text style={styles.laodtxtSub}>{loaderSub}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height,
    width,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.3)', // semi-transparent background
  },
  activityIndicator: {
    transform: [{ scaleX: 2 }, { scaleY: 2 }]
  },
  laodtxt: {
    fontSize: responsiveFontSize(2.5),
    color: '#FFF',
    fontFamily: 'Manrope-Bold',
    paddingTop: responsiveScreenHeight(2)
  },
  laodtxtSub: {
    fontSize: responsiveFontSize(1.6),
    color: '#FFF',
    fontFamily: 'Manrope-SemiBold',
    paddingVertical: responsiveScreenHeight(2)
  }
});

export default Loader;
