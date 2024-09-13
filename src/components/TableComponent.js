import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const TableComponent = ({
  headers,
  data,
  selectedTenure,
  setSelectedTenure,
  selectedAmount,
  setSelectedAmount,
}) => {
  const formatAmount = amount => {
    return `₹ ${parseInt(amount.replace(/[^\d.-]/g, ''))}`;
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerRow}>
        {headers.map((header, index) => (
          <View key={index} style={styles.headerCell}>
            <Text style={styles.headerText}>{header}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderRow = (rowData, rowIndex) => {
    const isSelected =
      selectedTenure === rowData[0] &&
      selectedAmount === formatAmount(rowData[1]);

    return (
      <TouchableOpacity
        key={rowIndex}
        style={[
          styles.row,
          {
            borderBottomLeftRadius: rowIndex === data?.length - 1 ? 20 : 0,
            borderBottomRightRadius: rowIndex === data?.length - 1 ? 20 : 0,
            backgroundColor: isSelected ? '#E0E0E0' : 'white', // Change color if selected
          },
        ]}
        onPress={() => {
          setSelectedTenure(rowData[0]);
          setSelectedAmount(formatAmount(rowData[1]));
        }}>
        <View style={[styles.radio, isSelected && styles.radioSelected]} />
        {rowData.map((cellData, cellIndex) => (
          <View key={cellIndex} style={styles.cell}>
            <ScrollView>
              <Text style={styles.cellText}>
                {cellIndex === 1 ? formatAmount(cellData) : cellData}
              </Text>
            </ScrollView>
          </View>
        ))}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView horizontal contentContainerStyle={styles.table}>
      {renderHeader()}
      {data.map((rowData, index) => renderRow(rowData, index))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F6FA',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 8,
    marginHorizontal: 20,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveScreenWidth(1.4),
  },
  headerText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Manrope-Bold',
    color: '#212121',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: responsiveScreenHeight(0.8),
    borderWidth: 0.8,
    marginHorizontal: 20,
    borderColor: '#EAECF0',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveScreenWidth(1),
  },
  cellText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Manrope-Bold',
    color: '#212121',
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 20,
    marginLeft: 10,
    alignSelf: 'center',
  },
  radioSelected: {
    backgroundColor: '#3E74DE',
  },
});

export default TableComponent;
