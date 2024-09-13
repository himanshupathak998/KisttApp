import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { responsiveFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions';

const CustomSelect = ({ handleChange, placeHolderText, onPress, selectedValue }) => {
  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={handleChange}
        placeholder={placeHolderText || selectedValue}
        placeholderTextColor={'#9599B5'}
        value={selectedValue}
      />
      <TouchableOpacity onPress={() => onPress(true)}>
        <Icon name="down" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  textInputContainer: {
    width: responsiveScreenWidth(85),

    backgroundColor: '#F5F6FA',
    alignSelf: 'center',
    padding: 10,

    marginTop: 20,
    gap: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textInputStyle: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-Bold',

    width: responsiveScreenWidth(70)
  },
});
