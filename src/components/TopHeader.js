import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
const bubbleSize = width * 0.25;

const TopHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        <View style={[styles.bubble, styles.bubble1]} />
        <View style={[styles.bubble, styles.bubble2]} />
        <View style={[styles.bubble, styles.bubble3]} />
        <View style={[styles.bubble, styles.bubble4]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingTop: height * 0.05,
    paddingBottom: height * 0.02,
    position: 'relative',
  },
  bubbleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
  },
  bubble1: {
    width: bubbleSize,
    height: bubbleSize,
    backgroundColor: '#3E74DE',
    marginTop: -bubbleSize * 0.45,
    marginLeft: -bubbleSize * 0.45,
  },
  bubble2: {
    width: bubbleSize,
    height: bubbleSize,
    backgroundColor: '#5fba6d',
    marginLeft: width * 0.83,
    marginTop: -bubbleSize * 0.5,
    zIndex: 1,
  },
  bubble3: {
    width: bubbleSize * 0.35,
    height: bubbleSize * 0.35,
    backgroundColor: '#ffcb55',
    top: height * 0.03,
    marginLeft: width * 0.95,
    zIndex: 2,
  },
  bubble4: {
    borderColor: '#f9742b',
    borderWidth: 4,
    height: bubbleSize * 0.5,
    width: bubbleSize * 0.5,
    backgroundColor: '#FFF',
    marginLeft: width * 0.78,
    marginTop: -bubbleSize * 0.3,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  headerText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default TopHeader;
