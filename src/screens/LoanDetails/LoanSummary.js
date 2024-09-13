import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
  BackHandler,
} from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import CommonButton from '../../components/CommonButton';
import Margin from '../../components/Margin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClientNoJwtHeaders, {apiHeaderKey} from '../../utils/baseUrl';
import {
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../components/Loader';
import StageSlider from '../../components/StageSlider';
import apiClient from '../../utils/interceptor';

const {width, height} = Dimensions.get('window');

const LoanSummary = props => {
  const {navigation} = props;
  const iosNavigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [loanDetails, setLoanDetails] = useState({
    finalLoanAmount: null,
    fullName: null,
    phoneNumber: null,
    loanInterestRate: null,
    selectedTenure: null,
    eligibleAmount: null,
    processingFees: null,
    emiAmount: null,
    firstEmiDate: null,
  });

  useEffect(() => {
    getDetailSummary();
  }, []);

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

  const formatToIndianCurrency = amount => {
    const x = amount?.toString();
    const lastThree = x?.substring(x?.length - 3);
    const otherNumbers = x?.substring(0, x?.length - 3);
    const formattedNumber =
      otherNumbers !== ''
        ? otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
        : lastThree;
    return formattedNumber;
  };

  const getDetailSummary = async () => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    const headers = {'x-api-key': apiHeaderKey};

    try {
      const response = await apiClient.get(
        `/user/summary`,
        {},
        {headers: headers},
      );

      if (response?.ok) {
        // const {
        //   final_loan_amount,
        //   loan_interest_rate,
        //   loan_total_duration_in_months,
        //   approved_loan_amount,
        //   processing_fees,
        //   monthly_emi_amount,
        //   loan_first_emi_date,
        //   mobile_no,
        //   full_name,
        // } = response?.data?.data[0];
        setLoanDetails({
          finalLoanAmount: response?.data?.data[0]?.final_loan_amount,
          loanInterestRate: response?.data?.data[0]?.loan_interest_rate,
          selectedTenure:
            response?.data?.data[0]?.loan_total_duration_in_months,
          eligibleAmount: response?.data?.data[0]?.approved_loan_amount,
          processingFees: response?.data?.data[0]?.processing_fees,
          emiAmount: response?.data?.data[0]?.monthly_emi_amount,
          firstEmiDate: response?.data?.data[0]?.loan_first_emi_date,
          phoneNumber: response?.data?.data[0]?.mobile_no,
          fullName: response?.data?.data[0]?.full_name,
        });
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

  const getUniqueFilePath = async (basePath, fileName) => {
    let filePath = `${basePath}/${fileName}`;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    const fileNameWithoutExtension = fileName.substring(
      0,
      fileName.lastIndexOf('.'),
    );

    for (
      let count = 1;
      await ReactNativeBlobUtil.fs.exists(filePath);
      count++
    ) {
      filePath = `${basePath}/${fileNameWithoutExtension}(${count})${fileExtension}`;
    }

    return filePath;
  };

  const downloadPDF = async fileType => {
    // const msmeIdentifier = await AsyncStorage.getItem('msmeIdentifier');
    setDownloadLoader(true);

    try {
      const {config, fs} = RNFetchBlob;
      let DownloadDir = fs.dirs.DownloadDir;
      const fileName = fileType.includes('.pdf') ? fileType : `${fileType}.pdf`;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mime: 'application/pdf',
          mediaScannable: true,
          title: fileName,
          path: `${DownloadDir}/${fileName}`,
          description: 'Downloading PDF file',
        },
      };

      // Construct the URL using baseURL from apiClient
      const url = `${apiClient.getBaseURL()}/pdf/${fileType}`;
      console.log(url, 'pdf url');
      const res = await config(options).fetch('GET', url);

      if (res && res.path()) {
        Alert.alert('', 'The file saved to ', res.path());
      } else {
        console.error('Error: Response is empty or invalid', res);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      // Stop the loader regardless of the outcome
      setDownloadLoader(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Loader loading={downloadLoader} loadingTxt={'Downloading...'} />
      {loading ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size={'large'} />
          <Text>Please Wait...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <ScreenHeader
            headerText={'Review Loan Summary'}
            backButton={true}
            width={'87%'}
            onPressBack={() => navigation.goBack()}
          />
          <Margin />
          <View style={{marginTop: 15}}>
            <StageSlider loan loanDone />
          </View>
          <ScrollView style={styles.container}>
            <Text style={styles.headerText}>
              You're just a step away from availing a loan. Just review the
              information you provided us with earlier & you're good to go
            </Text>
            <View style={styles.card}>
              <Text style={styles.userName}>{loanDetails?.fullName}</Text>
              <Text style={styles.userPhone}>+{loanDetails?.phoneNumber}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardHeader}>LOAN INFORMATION</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>Loan amount</Text>
                <Text style={styles.infoValue}>
                  ₹ {formatToIndianCurrency(loanDetails?.finalLoanAmount)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>Fee (incl. taxes)</Text>
                <Text style={styles.infoValue}>
                  ₹ {loanDetails?.processingFees}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>Monthly EMI</Text>
                <Text style={styles.infoValue}>₹ {loanDetails?.emiAmount}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>Loan term</Text>
                <Text style={styles.infoValue}>
                  {loanDetails?.selectedTenure} months
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>1st EMI date</Text>
                <Text style={styles.infoValue}>
                  {loanDetails?.firstEmiDate}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>Interest rate</Text>
                <Text style={styles.infoValue}>
                  {loanDetails?.loanInterestRate} %
                </Text>
              </View>
            </View>
            <View style={styles.kfsView}>
              <Text
                style={[
                  styles.headerText,
                  {textAlign: 'center', paddingHorizontal: 4},
                ]}>
                Click here to download
              </Text>
              <TouchableOpacity onPress={() => downloadPDF('kfs.pdf')}>
                <Text style={styles.kfsSanction}> KFS </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.headerText,
                  {textAlign: 'center', paddingHorizontal: 4},
                ]}>
                &
              </Text>
              <TouchableOpacity onPress={() => downloadPDF('sanction.pdf')}>
                <Text style={styles.kfsSanction}>Sanction letter</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <CommonButton
            // btnStyles={{marginBottom: responsiveScreenHeight(5)}}
            text={'Submit'}
            onPress={() => navigation.navigate('AdditionalDetails')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    color: '#484B63',
    marginBottom: 20,
    fontFamily: 'Manrope-Medium',
    lineHeight: 28,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#F5F6FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  userName: {
    fontSize: 18,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Manrope-Bold',
  },
  userPhone: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Manrope-Medium',
  },
  cardHeader: {
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    fontFamily: 'Manrope-ExtraBold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Manrope-SemiBold',
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Manrope-SemiBold',
  },
  kfsSanction: {
    // paddingHorizontal: 5,
    color: '#00B8F5',
    marginTop: 5,
  },
  kfsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: responsiveScreenHeight(1),
    paddingHorizontal: 16,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default LoanSummary;
