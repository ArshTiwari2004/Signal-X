import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TrustScore = ({ score }) => {
  // Define trust levels
  const getTrustLevel = () => {
    if (score >= 90) return { level: 'Verified Reporter', color: '#34C759', icon: 'shield-checkmark' };
    if (score >= 70) return { level: 'Trusted Reporter', color: '#30B0C7', icon: 'shield-half' };
    if (score >= 50) return { level: 'Regular Reporter', color: '#5856D6', icon: 'shield-outline' };
    if (score >= 30) return { level: 'New Reporter', color: '#FF9500', icon: 'person' };
    return { level: 'Unverified', color: '#8E8E93', icon: 'alert-circle' };
  };
  
  const trustLevel = getTrustLevel();
  
  // Calculate score bar width
  const scoreBarWidth = `${Math.min(Math.max(score, 0), 100)}%`;
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Trust Score</Text>
        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color: trustLevel.color }]}>{score}</Text>
          <Text style={styles.maxScore}>/100</Text>
        </View>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: scoreBarWidth, backgroundColor: trustLevel.color }
          ]} 
        />
      </View>
      
      <View style={styles.levelContainer}>
        <Ionicons name={trustLevel.icon} size={20} color={trustLevel.color} />
        <Text style={[styles.levelText, { color: trustLevel.color }]}>
          {trustLevel.level}
        </Text>
      </View>
      
      {score >= 90 && (
        <Text style={styles.benefitText}>
          <Ionicons name="star" size={14} color="#FFD700" /> Eligible for free toll passes
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  maxScore: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 2,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  benefitText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  }
});

export default TrustScore;