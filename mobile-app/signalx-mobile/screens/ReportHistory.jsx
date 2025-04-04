import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Text, Image } from 'react-native';
import { AppContext } from '../context/AppContext';
// import { colors } from '../styles/colors';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const ReportHistory = () => {
  const { reports } = useContext(AppContext);

  const renderItem = ({ item }) => (
    <View style={styles.reportItem}>
      <Image source={{ uri: item.imageUri }} style={styles.reportImage} />
      <View style={styles.reportDetails}>
        <Text style={styles.reportTime}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
        <Text style={styles.reportLocation}>
          {item.location.coords.latitude.toFixed(4)}, {item.location.coords.longitude.toFixed(4)}
        </Text>
        <View style={styles.reportStatus}>
          <Ionicons 
            name={item.verified ? 'checkmark-circle' : 'time'} 
            size={16} 
            color={item.verified ? colors.success : colors.warning} 
          />
          <Text style={[styles.statusText, { color: item.verified ? colors.success : colors.warning }]}>
            {item.verified ? 'Verified' : 'Pending'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {reports.length > 0 ? (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text" size={60} color={colors.accent} />
          <Text style={styles.emptyText}>No reports yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 15,
  },
  reportItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
  },
  reportImage: {
    width: 100,
    height: 100,
  },
  reportDetails: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  reportTime: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportLocation: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 5,
  },
  reportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: colors.text,
    opacity: 0.6,
  },
});

export default ReportHistory;