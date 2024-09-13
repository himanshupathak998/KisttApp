import { View, useWindowDimensions } from 'react-native';
import React from 'react';
import RenderHTML from 'react-native-render-html';
import WebView from 'react-native-webview';

const WebViewComp = (props) => {
  const { width } = useWindowDimensions();
  const { params } = props.route;
  const source = {
    html: params?.htmlResponse
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <WebView
        source={source}
      />
      {/* <RenderHTML
        contentWidth={width}
        source={source}
      /> */}
    </View>
  );
};

export default WebViewComp;
