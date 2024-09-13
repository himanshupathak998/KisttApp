import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import StepIndicator from 'react-native-step-indicator';
import AntDesign from 'react-native-vector-icons/AntDesign'

const labels = ['KYC', 'Personal details', 'Nominee', 'VKYC'];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 25,
  separatorStrokeWidth: 1.5,
  currentStepStrokeWidth: 2.5,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 2.5,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 10,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#000',
  labelSize: responsiveFontSize(1.6),
  currentStepLabelColor: '#fe7013'
};

const StepSlider = () => {
  const [currentPosition, setCurrentPosition] = useState(0);

  const onPageChange = (position) => {
    setCurrentPosition(position);
  };

  return (
    <StepIndicator
      onPress={onPageChange}
      customStyles={customStyles}
      currentPosition={currentPosition}
      labels={labels}
      stepCount={labels?.length}
      renderStepIndicator={() => (
        <View>
          <AntDesign name="check" size={15} color="#FFF" />
        </View>
      )}
    />
  );
};

export default StepSlider;
