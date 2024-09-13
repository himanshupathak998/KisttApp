import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import CommonButton from '../../components/CommonButton'

const ReviewLoan = () => {
  return (
    <View style={styles.main}>
      <ScreenHeader headerText={"Review Loan Agreement"} backButton={true} width={'80%'} />
      <View style={styles.pdf}>
        <Text style={{ color: '#FFF', fontSize: 20, textAlign: 'center' }}>Agreement Here</Text>
      </View>
      <CommonButton text={"Agree"} btnStyles={styles.agreeBtn} />
    </View>
  )
}

export default ReviewLoan

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  agreeBtn: {
    width: '75%',
  },
  pdf: {
    height: 600,
    backgroundColor: 'gray',
    justifyContent:'center'
  }
})