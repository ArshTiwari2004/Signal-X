import { colors } from './colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Your existing styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.8,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: colors.lightText,
    fontWeight: 'bold',
    fontSize: 18,
  },
  
  // New profile-specific styles
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: colors.lightGray, // Placeholder background
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: colors.secondaryText || colors.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  section: {
    backgroundColor: colors.cardBackground || colors.background,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  trustscore:{
    display: 'flex',
    aligncontent: 'center',

  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#eee',
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  settingArrow: {
    marginLeft: 'auto',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  historyItem: {
    padding: 12,
    backgroundColor: colors.lightBackground || colors.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border || '#eee',
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  historyItemStatus: {
    fontSize: 14,
    color: colors.secondaryText || colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
  noHistoryText: {
    fontSize: 14,
    color: colors.secondaryText || colors.text,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: colors.danger || '#ff3b30',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: colors.lightText,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});