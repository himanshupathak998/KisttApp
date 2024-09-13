import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';

const { width, height } = Dimensions.get('window');

const Card = ({ header, data }) => {
  const renderItem = ({ item }) => (
    <View style={styles.content}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
  );

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.header}>{header}</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.04,
    borderWidth: 0.7
  },
  header: {
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
    backgroundColor: '#F5F6FA',
    borderBottomWidth: 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: '#484B63',
    fontFamily: 'Manrope-ExtraBold'
  },
  content: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  title: {
    fontSize: width * 0.035,
    color: '#333',
    marginBottom: height * 0.003,
    fontFamily: 'Manrope-Regular'
  },
  value: {
    fontSize: width * 0.045,
    color: '#484B63',
    fontFamily: 'Manrope-Bold',
  },
});

export default Card;
