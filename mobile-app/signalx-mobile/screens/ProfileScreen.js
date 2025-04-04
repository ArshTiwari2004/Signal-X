import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import TrustScore from '../components/TrustScore';
import { styles } from '../constants/styles';
import { Feather } from '@expo/vector-icons'; // Assumes you're using Expo

const ProfileScreen = () => {
  // Sample user data - in a real app, this would come from a state management system or API
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profileImage: 'https://via.nibedan.png/150',
    memberSince: 'January 2023',
    location: 'New York, NY',
    trustScore: 85,
  });

  // Sample report history
  const [reportHistory, setReportHistory] = useState([
    { id: 1, timestamp: Date.now() - 86400000, status: 'Resolved' },
    { id: 2, timestamp: Date.now() - 86400000 * 7, status: 'Pending' },
  ]);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.profileImage }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
            <TrustScore score={user.trustScore} />
          </View>
        </View>

        {/* Account Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          
          <View style={styles.detailItem}>
            <Feather name="mail" size={20} color="#555" />
            <Text style={styles.detailText}>{user.email}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Feather name="phone" size={20} color="#555" />
            <Text style={styles.detailText}>{user.phone}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Feather name="map-pin" size={20} color="#555" />
            <Text style={styles.detailText}>{user.location}</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Feather name="user" size={20} color="#555" />
            <Text style={styles.settingText}>Edit Profile</Text>
            <Feather name="chevron-right" size={20} color="#555" style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Feather name="bell" size={20} color="#555" />
            <Text style={styles.settingText}>Notifications</Text>
            <Feather name="chevron-right" size={20} color="#555" style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Feather name="lock" size={20} color="#555" />
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Feather name="chevron-right" size={20} color="#555" style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Feather name="help-circle" size={20} color="#555" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Feather name="chevron-right" size={20} color="#555" style={styles.settingArrow} />
          </TouchableOpacity>
        </View>

        {/* Report History Section */}
        <View style={styles.section}>
          <Text style={styles.historyTitle}>Report History</Text>
          {reportHistory && reportHistory.length > 0 ? (
            reportHistory.map((report, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyItemTitle}>Report #{report.id} - {new Date(report.timestamp).toLocaleDateString()}</Text>
                <Text style={styles.historyItemStatus}>Status: {report.status}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noHistoryText}>No reports submitted yet</Text>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
