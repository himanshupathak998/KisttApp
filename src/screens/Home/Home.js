import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import CommonTextInput from '../../components/CommonTextInput';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ScreenHeader from '../../components/ScreenHeader';
import CommonButton from '../../components/CommonButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch} from 'react-redux';
import {generateOtp, validatePan} from '../../redux/reducers/authSlice';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const [pan, setPan] = useState('');

  const [aadhar, setAadhar] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState(null);

  const [mobileNumber, setMobileNumber] = useState('');
  const [udayan, setUdayan] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // const convertDateFormat = dateString => {
  //   const [month, day, year] = dateString?.split('/');

  //   const formattedDate = `${day}/${month}/${year}`;

  //   return formattedDate;
  // };
  const handleConfirm = date => {
    // console.warn("A date has been picked: ", date);
    setDob(date.toLocaleDateString()); // Convert to a readable date format
    hideDatePicker();
  };

  const handleOtp = () => {
    const data = {
      Data: {
        MobileNumber: `91${mobileNumber}`,
        CustomerId: '',
        EmailId: 'abhishekrathore2610@gmail.com',
        IntFlag: '0',
        TemplateId: 'OTP454|Suryoday_Bank_OTP607',
        DynamicParam: [
          {
            Value: '',
            Name: 'otp',
          },
        ],
      },
    };
    
    dispatch(generateOtp(data)).then(res => {});
  };
  const handlePan = () => {
    const data = {
      Data: [
        {
          Pan: pan,
          Name: 'NATIONAL HIGHWAY AUTHORITY OF INDIA',
          FatherName: '',
          DateOfBirth: dob,
        },
      ],
    };
    dispatch(validatePan(data)).then(res => {});
  };
  return (
    <View style={styles.mainContainer}>
      <ScreenHeader headerText={'Details'} width={responsiveScreenWidth(100)} />
      <View style={styles.marginLine}></View>
      <ScrollView>
        <CommonTextInput
          placeHolderText={'Mobile Number'}
          value={mobileNumber}
          handleChange={e => setMobileNumber(e)}
        />
        <CommonTextInput
          placeHolderText={'Customer Name'}
          value={name}
          handleChange={e => setName(e)}
        />
        <CommonTextInput
          placeHolderText={'Date of Birth'}
          value={dob}
          handleChange={setDob}
          date={true}
          onClick={showDatePicker}
        />
        <CommonTextInput
          placeHolderText={'Pan'}
          value={pan}
          handleChange={e => setPan(e)}
        />
        <CommonTextInput
          placeHolderText={'Aadhar'}
          value={aadhar}
          handleChange={e => setAadhar(e)}
        />

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <CommonTextInput
          placeHolderText={'Udayan Aadhar'}
          value={udayan}
          handleChange={e => setUdayan(e)}
        />
        <CommonButton text={'Continue'} onPress={()=> navigation.navigate('AdditionalDetails')} />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  marginLine: {
    width: responsiveScreenWidth(100),
    backgroundColor: '#9599B5',
    height: responsiveScreenHeight(0.05),
  },
});
