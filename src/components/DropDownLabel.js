import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/AntDesign';

const DropDownLabel = ({
  value,
  placeholder,
  searchPlaceholder,
  accessibilityLabel,
  dropdownStyle,
  placeholderStyle,
  selectedTextStyle,
  labelField,
  valueField,
  renderItem,
  data,
  onChange,
  labelTxt,
}) => {
  return (
    <View style={styles.textInputContainer}>
      {value && <Text style={styles.textInputStyle}>{labelTxt}</Text>}
      <Dropdown
        containerStyle={styles.containerDropdown}
        placeholder={(value && value[labelField]) || placeholder}
        accessibilityLabel={accessibilityLabel || 'Select'}
        style={[styles.dropdown, dropdownStyle]}
        placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
        selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
        value={value}
        labelField={labelField}
        valueField={valueField}
        renderItem={renderItem}
        data={data}
        onChange={onChange}
        activeColor={'#FFF'}
        renderRightIcon={() => {
          return (
            <View style={styles.iconView}>
              <Icon name="down" size={20} />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    paddingVertical: responsiveScreenHeight(1),
  },
  bankText: {
    color: '#484B63',
    fontFamily: 'Manrope-Medium',
    fontSize: responsiveFontSize(2.2),
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(2),
    marginHorizontal: 10,
    color: '#9599B5',
    fontWeight: '500',
    fontFamily: 'Manrope-Bold',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
    marginHorizontal: 12,
  },
  textInputContainer: {
    width: responsiveScreenWidth(85),
    backgroundColor: '#F5F6FA',
    alignSelf: 'center',
    marginTop: 20,
    gap: 5,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  textInputStyle: {
    color: '#9599B5',
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Manrope-Bold',
    marginRight: 'auto',
    marginLeft: 10,
  },
  containerDropdown: {
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#E6E9F4',
  },
  iconView: {
    paddingRight: responsiveScreenWidth(2),
  },
});

export default DropDownLabel;
