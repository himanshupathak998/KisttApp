import AccountDetails from '../screens/AccountDetails/AccountDetails';
import AdditionalDetails from '../screens/AdditionalDetails/AdditionalDetails';
import Home from '../screens/Home/Home';

import { createStackNavigator } from '@react-navigation/stack';
import VideoKyc from '../screens/VideoKyc/VideoKyc';
import MobileVerification from '../screens/MobileVerification/MobileVerification';
import KycVerification from '../screens/KycVerification/KycVerification';
import AadharAddress from '../screens/AadharAddress/AadharAddress';
import LoanDetails from '../screens/LoanDetails/LoanDetails';
import LoanSummary from '../screens/LoanDetails/LoanSummary';
import ReviewLoan from '../screens/LoanDetails/ReviewLoan';
import LoanSummaryTable from '../screens/LoanDetails/LoanSummaryTable';
import StartVkyc from '../screens/VideoKyc/StartVkyc';
import PaymentMethod from '../Payments/PaymentMethod';
import AutoDebtEMI from '../screens/LoanDetails/AutoDebtEMI';
import SignDocument from '../SignDocument/SignDocument';
import AadharSign from '../SignDocument/AadharSign';
import SuccessView from '../SignDocument/SuccessView';
import CardDetails from '../screens/CardDetails/CardDetails';
import BreLoader from '../screens/BreLoader/BreLoader';
import WebViewComp from '../screens/LoanDetails/WebViewComp';
import WebViewScreen from '../screens/LoanDetails/WebViewCompVKYC';
import LegalitySignDocument from '../SignDocument/LegalitySignDocument';
import ApplicationProcess from '../SignDocument/ApplicationProcess';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="MobileVerification">
      {/* <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      /> */}

      <Stack.Screen
        name="MobileVerification"
        component={MobileVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdditionalDetails"
        component={AdditionalDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoKyc"
        component={VideoKyc}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="KycVerification"
        component={KycVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoanDetails"
        component={LoanDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AadharAddress"
        component={AadharAddress}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoanSummary"
        component={LoanSummary}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewLoan"
        component={ReviewLoan}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoanSummaryTable"
        component={LoanSummaryTable}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StartVkyc"
        component={StartVkyc}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AutoDebtEMI"
        component={AutoDebtEMI}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignDocument"
        component={SignDocument}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AadharSign"
        component={AadharSign}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SuccessView"
        component={SuccessView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CardDetails"
        component={CardDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BreLoader"
        component={BreLoader}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WebView"
        component={WebViewComp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WebViewVKYC"
        component={WebViewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LegalitySignDocument"
        component={LegalitySignDocument}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ApplicationProcess"
        component={ApplicationProcess}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default MyStack;
