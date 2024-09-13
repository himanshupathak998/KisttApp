import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'

const Margin = () => {
  return (
    <View style={styles.marginLine} />
  )
}

export default Margin

const styles = StyleSheet.create({
  marginLine: {
    width: responsiveScreenWidth(100),
    backgroundColor: '#9599B5',
    height: responsiveScreenHeight(0.05),
  }
})