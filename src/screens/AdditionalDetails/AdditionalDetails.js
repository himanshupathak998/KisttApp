import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  BackHandler,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonTextInput from '../../components/CommonTextInput';
import CommonModal from '../../components/CommonModal';
import ScreenHeader from '../../components/ScreenHeader';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CommonButton from '../../components/CommonButton';
import StepSlider from '../../components/StepSlider';
import {useDispatch} from 'react-redux';
import {SavePersonalDetails} from '../../redux/reducers/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownLabel from '../../components/DropDownLabel';
import {apiHeaderKey} from '../../utils/baseUrl';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../components/Loader';
import ApiErrorModal from '../../components/ApiErrorModel';
import StageSlider from '../../components/StageSlider';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dropdown} from 'react-native-element-dropdown';
import apiClient from '../../utils/interceptor';
import {encryptObjectData} from '../../utils/encryptUtils';

const AdditionalDetails = props => {
  const dispatch = useDispatch();
  const iosNavigation = useNavigation();

  const {navigation} = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');

  const [sector, setSector] = useState(null);
  const [metaData, setMetaData] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});

  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiErrorModalVisible, setApiErrorModalVisible] = useState(false);
  const [apiErrorMsgHeader, setApiErrorMsgHeader] = useState('');

  const [textInputErrorModal, setTextInputErrorModal] = useState(false);
  const [subSectorVal, setSubSectorVal] = useState([]);
  const [subSector, setSubSector] = useState('');
  const [vkyc, setVkyc] = useState(null);
  console.log('Vkyc----->', vkyc);

  useEffect(() => {
    // getMsme();
    getMetaData();
    getDetailSummary();
  }, []);

  const getDetailSummary = async () => {
    setLoading(true);
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    const headers = {'x-api-key': apiHeaderKey};

    try {
      const response = await apiClient.get(
        '/user/summary',
        {},
        {headers: headers},
      );

      if (response?.ok) {
        setSector(response?.data?.data[0]?.sector);
        setVkyc(response?.data?.data[0]?.is_vkyc_required);
      } else {
        throw new Error('Failed to fetch loan details');
      }
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
      Alert.alert('Error', 'Failed to load loan details');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const handleBackPress = () => {
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     handleBackPress,
  //   );

  //   const unsubscribe = iosNavigation.addListener('beforeRemove', e => {
  //     e.preventDefault();
  //   });

  //   return () => {
  //     backHandler.remove();
  //     unsubscribe();
  //   };
  // }, [iosNavigation]);

  const getMetaData = async () => {
    try {
      const headers = {
        'x-api-key': apiHeaderKey,
      };
      let response = await apiClient.get('/meta-data', {}, {headers: headers});
      console.log('MetadataREsponse---->', response.data);
      if (response.status === 200) {
        setMetaData(response.data?.data);
        const subsector = response.data?.data?.filter(
          (e, i) => e.Set === 'SUBSECTOR',
        );
        setSubSectorVal(subsector);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const genderKeyFromValue = value => {
    const genderData = groupedData.GENDER;
    const matchedElement = genderData.find(element => element.Value === value);
    if (matchedElement) {
      return matchedElement.Key;
    } else {
      return value;
    }
  };
  const prefixKeyFromValue = value => {
    const genderData = groupedData.PREFIX;
    const matchedElement = genderData.find(element => element.Value === value);
    if (matchedElement) {
      return matchedElement.Key;
    } else {
      return value;
    }
  };
  const martialStatusKeyFromValue = value => {
    const genderData = groupedData.MARTIALSTATUS;
    const matchedElement = genderData.find(element => element.Value === value);
    if (matchedElement) {
      return matchedElement.Key;
    } else {
      return value;
    }
  };

  // const getMsme = async () => {
  //   const identifier = await AsyncStorage.getItem('msmeIdentifier');
  //   setMsmeidentifier(identifier);
  // };

  const groupDataBySet = data => {
    return data.reduce((acc, item) => {
      if (!acc[item.Set]) {
        acc[item.Set] = [];
      }
      acc[item.Set].push(item);
      return acc;
    }, {});
  };

  const handleSelectPress = type => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleSelect = value => {
    setSelectedValues(prev => ({
      ...prev,
      [modalType]: value,
    }));
    setIsModalVisible(false);
  };

  const handleSavePersonalDetails = async () => {
    setLoading(true);
    const data = {
      fatherName: fatherName,
      motherName: motherName,
      maritalStatus: martialStatusKeyFromValue(selectedValues.MARTIALSTATUS),
      employmentStatus: selectedValues.EMPLOYEESTATUS,
      occupation: selectedValues.OCCUPATION,
      annualIncome: selectedValues.ANNUALINCOME,
      qualification: selectedValues.EDUCATION,
      purposeOfLoan: selectedValues.PURPOSEOFLOAN,
      // sector: selectedValues['SECTOR'],
      subSector: subSector,
      gender: genderKeyFromValue(selectedValues.GENDER),
      prefix: prefixKeyFromValue(selectedValues.PREFIX),
    };
    const headers = {'x-api-key': apiHeaderKey};
    // Encrypt the data
    const encryptedData = encryptObjectData(data, apiHeaderKey);
    console.log('Encrypted Data:->', encryptedData);
    const payload = {
      data: encryptedData,
    };
    try {
      const res = await apiClient.post('/savePersonalInformations', payload, {
        headers: headers,
      });
      if (res.ok) {
        setLoading(false);
        if (vkyc) {
          navigation.navigate('StartVkyc');
        } else {
          navigation.navigate('PaymentMethod');
        }
      } else {
        setLoading(false);
        setApiErrorModalVisible(true);
        setApiErrorMsgHeader('Error in Saving details');
      }
    } catch (error) {
      setLoading(false);
      setApiErrorModalVisible(true);
      setApiErrorMsgHeader('Error in Saving details');
    }
  };

  const handleChange = (set, value) => {
    setSelectedValues(prev => ({
      ...prev,
      [set]: value,
    }));
  };

  const onChangeSubSector = value => {
    if (value.Value) {
      setSubSector(value.Value);
    }
  };

  const setNameToHeading = {
    GENDER: 'Gender',
    PREFIX: 'Prefix',
    OCCUPATION: 'Occupation',
    EDUCATION: 'Education',
    MARTIALSTATUS: 'Marital Status',
    ANNUALINCOME: 'Annual Income',
    EMPLOYEESTATUS: 'Employee Status',
    PURPOSEOFLOAN: 'Purpose of Loan',
  };

  const groupedData = groupDataBySet(metaData);

  // Check if all required fields are filled
  const areAllFieldsFilled = () => {
    return Object.keys(setNameToHeading).every(set => selectedValues[set]);
  };

  return (
    <View style={styles.mainContainer}>
      <ScreenHeader
        headerText={'Additional Details'}
        width={responsiveScreenWidth(77)}
        backButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <Loader
        loading={loading}
        loadingTxt={'Validating'}
        loaderSub={'Please Wait!!'}
      />
      <View style={styles.marginLine} />
      <View style={styles.stepSliderContainer}>
        <StageSlider loan loanDone details />
      </View>

      <ScrollView>
        <View style={styles.textInputContainer}>
          <Text style={styles.textStyle}>Father’s name</Text>
          <TextInput
            value={fatherName}
            onChangeText={e => {
              if (e.length === 0 || e.charAt(0) !== ' ') {
                setFatherName(e);
              }
            }}
            style={styles.textStyleInput}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textStyle}>Mother’s name</Text>
          <TextInput
            value={motherName}
            onChangeText={e => {
              if (e.length === 0 || e.charAt(0) !== ' ') {
                setMotherName(e);
              }
            }}
            style={styles.textStyleInput}
          />
        </View>
        {Object.keys(setNameToHeading).map(set => (
          <View key={set}>
            <DropDownLabel
              labelTxt={setNameToHeading[set]}
              value={selectedValues[set]}
              placeholder={setNameToHeading[set]}
              accessibilityLabel={set}
              labelField="Value"
              valueField="Value"
              renderItem={item => (
                <Text style={styles.selectedItem}>{item.Value}</Text>
              )}
              data={groupedData[set] || []} // Initially empty or fetched data
              onChange={item => handleChange(set, item.Value)}
            />
          </View>
        ))}
        <View style={styles.textInputContainer}>
          <Text style={styles.textStyle}>Sector</Text>
          <TextInput
            value={sector}
            editable={false}
            style={styles.textStyleInput}
          />
        </View>
        <View style={styles.textInputContainer1}>
          {subSector && (
            <Text style={styles.textInputStyle}>{'Sub Sector'}</Text>
          )}
          <Dropdown
            search
            searchPlaceholder="Search here..."
            containerStyle={styles.containerDropdown}
            placeholder={'Sub Sector'}
            accessibilityLabel={'Select'}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            value={subSector}
            labelField={'Value'}
            valueField={'Value'}
            renderItem={item => (
              <Text style={styles.selectedItem}>{item.Value}</Text>
            )}
            data={subSectorVal}
            onChange={onChangeSubSector}
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
        {areAllFieldsFilled() && fatherName !== '' && motherName !== '' ? (
          <CommonButton
            btnStyles={{marginTop: responsiveScreenHeight(5)}}
            text={'Continue'}
            onPress={handleSavePersonalDetails}
          />
        ) : (
          <CommonButton
            btnStyles={{marginTop: responsiveScreenHeight(5)}}
            text={'Continue'}
            unable
            onPress={() => setTextInputErrorModal(true)}
          />
        )}
      </ScrollView>
      <CommonModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        content={modalType}
        onSelect={handleSelect}
      />
      <ApiErrorModal
        errorHeader={apiErrorMsgHeader}
        visible={apiErrorModalVisible}
        onClose={() => setApiErrorModalVisible(false)}
      />
      <ApiErrorModal
        visible={textInputErrorModal}
        onClose={() => setTextInputErrorModal(false)}
        errorMsg={'Please fill of Fields'}
      />
    </View>
  );
};

export default AdditionalDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  stepSliderContainer: {
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(2),
  },
  marginLine: {
    width: responsiveScreenWidth(100),
    backgroundColor: '#9599B5',
    height: responsiveScreenHeight(0.05),
  },
  selectedItem: {
    paddingVertical: 18,
    fontSize: responsiveFontSize(2),
    color: '#131523',
    fontFamily: 'Manrope-Bold',
  },
  textInputContainer: {
    width: responsiveScreenWidth(85),
    backgroundColor: '#F5F6FA',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 20,
    // gap: 5,
    borderRadius: 10,
  },
  textStyle: {
    color: '#9599B5',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-Bold',
    width: responsiveScreenWidth(80),
  },
  textStyleInput: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Manrope-SemiBold',
    width: responsiveScreenWidth(80),
  },
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
  textInputContainer1: {
    width: responsiveScreenWidth(85),
    backgroundColor: '#F5F6FA',
    alignSelf: 'center',
    marginTop: 20,
    // gap: 5,
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
    marginTop: 10,
    height: 'auto',
  },
  iconView: {
    paddingRight: responsiveScreenWidth(2),
  },
});
