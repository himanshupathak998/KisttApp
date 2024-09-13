import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/AntDesign';

const CommonTextInput = ({
  placeHolderText,
  handleChange,
  isDropdown,
  onDropdownPress,
  value,
  date,
  onClick,
  borderColor,
  borderWidth,
  editable,
  maxLength,
  keyboardType,
  autoCapitalize,
  onBlur,
}) => {
  const [modal, setModal] = useState(false);
  const modalCLick = () => {
    setModal(!modal);
    onDropdownPress(modal);
  };

  if (date) {
    return (
      <TouchableOpacity onPress={onClick} style={styles.textInputContainerDate}>
        <Text
          style={value ? styles.textInputStyle : styles.placeholderTextStyle}>
          {!value ? 'Date of Birth' : value}
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <View
      style={[
        styles.textInputContainer,
        {borderColor: borderColor},
        {borderWidth: borderWidth},
      ]}>
      <View style={styles.isDropdownView}>
        <TextInput
          editable={editable}
          style={styles.textInputStyle}
          onChangeText={handleChange}
          placeholder={placeHolderText}
          placeholderTextColor={'#9599B5'}
          value={value}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize && 'characters'}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
};

export default CommonTextInput;

const styles = StyleSheet.create({
  textInputContainer: {
    width: responsiveScreenWidth(85),

    backgroundColor: '#F5F6FA',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,

    marginTop: 20,
    gap: 5,
    borderRadius: 10,
  },
  textInputContainerDate: {
    width: responsiveScreenWidth(85),

    backgroundColor: '#F5F6FA',
    alignSelf: 'center',
    paddingHorizontal: 15,

    marginTop: 20,
    gap: 5,
    borderRadius: 10,
  },
  textStyle: {
    fontFamily: 'Manrope-Medium',
    fontSize: responsiveFontSize(2),
    color: '#9599B5',
  },
  textInputStyle: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-Bold',
    width: responsiveScreenWidth(80),
  },
  placeholderTextStyle: {
    color: '#9599B5',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-Bold',
    width: responsiveScreenWidth(80),
  },
  dropDown: {
    marginLeft: 'auto',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  isDropdownView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
