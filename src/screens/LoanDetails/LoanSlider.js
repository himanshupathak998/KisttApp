import React, { useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Slider } from '@rneui/themed';

const LoanSlider = (props,{value,setValue,maxValue,minValue,step}) => {
  return (
    <View style={styles.contentView}>
      <Slider
        value={value}
        onValueChange={setValue}
        maximumValue={maxValue}
        minimumValue={minValue}
        step={step}
        allowTouchTrack
        trackStyle={{ height: 5, backgroundColor: '#00B8F5' }}
        thumbStyle={{ height: 20, width: 20, backgroundColor: '#00B8F5', }}
        minimumTrackTintColor='#00B8F5'
        maximumTrackTintColor='#E5E7EB'
        thumbProps={{
          children: (
            <View>
              <Image source={require("../../assets/images/thumb.png")} style={{ height: 28, width: 30, alignSelf: 'center' }} />
            </View>
          ),
        }}
      />
    </View>
  )
}

export default LoanSlider

const styles = StyleSheet.create({
  contentView: {
    width: '60%',
    justifyContent: 'center',
    alignSelf: 'center'
  },
})