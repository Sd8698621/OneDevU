// app/verify-otp.tsx

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_HOST, API_PORT } from '@env';

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const BASE_URL = `http://${API_HOST}:${API_PORT}`;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      Alert.alert('Debug Mode', 'Email: ' + email + '\nTry OTP: 12345678');
    }
  }, []);

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('Enter OTP', 'Please enter the 8-digit OTP sent to your email.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', data.message || 'Email verified!');
        router.replace('/login');
      } else {
        Alert.alert('Error', data.error || 'Verification failed');
      }
    } catch (err) {
      console.error('Verify OTP Error:', err);
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify Your Email</Text>
      <Text style={styles.subtext}>OTP sent to: {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={8}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity onPress={handleVerify} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.hint}>Hint: OTP is 12345678 😉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  subtext: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  hint: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontStyle: 'italic',
  },
});
