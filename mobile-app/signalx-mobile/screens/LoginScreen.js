import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar
} from 'react-native';
import { colors } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  // const handleLogin = () => {
  //   console.log('Login attempted with:', email, password);
  //   navigation.navigate('MainTabs');
  // };
  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    // if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });

      // Store token and user data
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

      // Navigate to main app
      navigation.navigate('MainTabs');

    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      let fieldErrors = { email: '', password: '' };

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data.error || errorMessage;
        
        // Highlight problematic field if specified by backend
        if (error.response.data.field === 'email') {
          fieldErrors.email = errorMessage;
        } else if (error.response.data.field === 'password') {
          fieldErrors.password = errorMessage;
        }
      } else if (error.request) {
        // No response received
        errorMessage = 'Network error. Please check your connection.';
      }

      setErrors(fieldErrors);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
            </View>
            <Text style={styles.title}>Signal-X SOS</Text>
            <Text style={styles.subtitle}>Emergency Response System</Text>
          </View>
          
          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={colors.primary} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={colors.primary} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.orContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#DB4437'}]}>
                <Ionicons name="logo-google" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#000000'}]}>
                <Ionicons name="logo-apple" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#4267B2'}]}>
                <Ionicons name="logo-facebook" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Section */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>New to Signal-X?</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Register')}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Emergency Report Button */}
      <View style={styles.emergencyContainer}>
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => navigation.navigate('Camera')}
          activeOpacity={0.7}
        >
          <View style={styles.emergencyContent}>
            <Ionicons name="warning" size={24} color="white" />
            <Text style={styles.emergencyButtonText}>REPORT BLOCKAGE</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.06,
    paddingBottom: 100, // Space for the emergency button
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.07,
    marginBottom: height * 0.04,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(42, 134, 131, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.8,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
    paddingRight: 10,
  },
  eyeIcon: {
    padding: 12,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 20,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  loginButton: {
    height: 55,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    // Simple gradient effect using shadow
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: colors.lightText,
    fontSize: 17,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E1E1',
  },
  orText: {
    color: colors.text,
    marginHorizontal: 15,
    fontWeight: '500',
    opacity: 0.7,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  registerText: {
    color: colors.text,
    fontSize: 15,
    marginRight: 6,
  },
  registerButton: {
    paddingVertical: 5,
  },
  registerButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  emergencyContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: width * 0.06,
    right: width * 0.06,
  },
  emergencyButton: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  emergencyContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});

export default LoginScreen;