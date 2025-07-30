import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
// @ts-ignore
import { API_HOST, API_PORT } from '@env';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const router = useRouter();

  const BASE_URL = `http://${API_HOST}:${API_PORT}`;

  const handleEmailSubmit = async () => {
    if (!email) {
      Alert.alert('Please enter your email');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Email verified', data.message);
        setStep('otp');
      } else {
        Alert.alert('Failed', data.error || 'Email not found');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'Unable to connect to the server');
    }
  };

  const handlePasswordReset = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/forgot-password/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        router.replace('/login');
      } else {
        Alert.alert('Failed', data.error || 'Could not reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'Unable to connect to the server');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.heading}>Reset Password</Text>

      {step === 'email' && (
        <>
          <TextInput
            placeholder="Enter your registered email"
            placeholderTextColor="#555"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={handleEmailSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Verify Email</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'otp' && (
        <>
          <TextInput
            placeholder="Enter OTP"
            placeholderTextColor="#555"
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Enter new password"
            placeholderTextColor="#555"
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => router.back()} style={styles.linkButton}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 26,
    color: '#222',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    color: '#000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007bff',
    fontSize: 14,
  },
});
