import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Dimensions,
  Image
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
//import { createUserWithEmailAndPassword } from 'firebase/auth';
//import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons'; 
import { colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const password = watch("password");

  const onRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
    //   await createUserWithEmailAndPassword(auth, data.email, data.password);
      Alert.alert('Success', 'Registration Successful');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={40} color="#FF0000" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Signal-X SOS and help report emergencies</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color="#007bff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <Controller
              control={control}
              name="email"
              rules={{ 
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color="#007bff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              rules={{ 
                required: 'Password is required', 
                minLength: { 
                  value: 6, 
                  message: 'Password must be at least 6 characters' 
                } 
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#007bff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6e6e6e" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <Controller
              control={control}
              name="confirmPassword"
              rules={{ 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#007bff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6e6e6e" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
          </View>

          {/* Terms & Conditions */}
          <View style={styles.termsContainer}>
            <Controller
              control={control}
              name="terms"
              rules={{ required: 'You must accept the terms' }}
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity 
                  style={styles.checkboxContainer} 
                  onPress={() => onChange(!value)}
                >
                  <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                    {value && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.terms && <Text style={styles.errorText}>{errors.terms.message}</Text>}
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit(onRegister)}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.buttonText}>Creating Account...</Text>
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login Options */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={22} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={22} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={22} color="#4267B2" />
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.06,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: '80%',
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
    color: '#333',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: 'white',
    paddingHorizontal: 5,
  },
  inputError: {
    borderColor: '#ff3b30',
    borderWidth: 1,
  },
  inputIcon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 12,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 13,
    marginTop: 5,
    marginLeft: 2,
  },
  termsContainer: {
    marginVertical: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.primary,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#a0c9ff',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    color: '#666',
    marginHorizontal: 15,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 20,
  },
  loginText: {
    fontSize: 15,
    color: '#666',
    marginRight: 5,
  },
  loginLink: {
    fontSize: 15,
    color: '#FF0000',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
