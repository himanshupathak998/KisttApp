import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { responsiveFontSize } from 'react-native-responsive-dimensions'

const RadioButton = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
      <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
        {selected && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

export default RadioButton

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    height: 13,
    width: 13,
    borderRadius: 15,
    backgroundColor: '#1D44E9',
  },
  radioButtonSelected: {
    borderColor: '#1D44E9',
    borderWidth: 2
  },
  radioButtonLabel: {
    fontSize: responsiveFontSize(1.85),
    color: '#131523',
    fontWeight: '600'
  },
})