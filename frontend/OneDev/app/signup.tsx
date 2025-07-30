import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import CountryPicker from 'react-native-country-picker-modal';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_HOST, API_PORT } from '@env';

export default function Signup() {
  const router = useRouter();
  const BASE_URL = `http://${API_HOST}:${API_PORT}`;

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [countryCode, setCountryCode] = useState('IN');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    dob: '',
    gender: '',
    location: { country: '', city: '' },
  });

  const handleChange = (key: string, value: string) => {
    if (key === 'country' || key === 'city') {
      setForm({ ...form, location: { ...form.location, [key]: value } });
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is needed for signup.');
        setLoadingLocation(false);
        return;
      }

      const coords = await Location.getCurrentPositionAsync({});
      const placemarks = await Location.reverseGeocodeAsync(coords.coords);

      if (placemarks.length > 0) {
        const place = placemarks[0];
        setForm(prev => ({
          ...prev,
          location: {
            city: place.city || place.subregion || '',
            country: place.country || '',
          },
        }));
      }
    } catch (err) {
      console.error('Error fetching location:', err);
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      handleChange('dob', isoDate);
    }
  };

  const handleSignup = async () => {
    const { name, email, phone, password, dob, gender, location } = form;

    if (!name || !email || !phone || !password || !dob || !gender || !location.country || !location.city) {
      Alert.alert('All fields are required!');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Signup successful', 'Please verify your email using the OTP sent.');
        router.replace({
          pathname: '/verify-otp',
          params: { email },
        });
      } else {
        Alert.alert('Signup failed', data.error || 'Try again later.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create a OneDev Account</Text>

      {loadingLocation && (
        <View style={{ marginBottom: 10 }}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={{ color: '#666', textAlign: 'center' }}>Detecting location...</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={text => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={text => handleChange('email', text)}
      />

      {/* Phone input with country picker */}
      <View style={styles.phoneRow}>
        <CountryPicker
          withFlag
          withCallingCode
          countryCode={countryCode}
          onSelect={(country) => {
            setCountryCode(country.cca2);
            setSelectedCountry(country);
          }}
          withFilter
          containerButtonStyle={styles.flagButton}
        />
        <TextInput
          style={[styles.phoneInput, { marginLeft: 10 }]}
          placeholder="Phone"
          keyboardType="phone-pad"
          onChangeText={text => handleChange('phone', text)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={text => handleChange('password', text)}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { justifyContent: 'center' }]}>
        <Text style={{ color: form.dob ? '#000' : '#888' }}>
          {form.dob || 'Select Date of Birth'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={new Date()}
          maximumDate={new Date()}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.input}>
        <Picker
          selectedValue={form.gender}
          style={{ color: '#000' }}
          dropdownIconColor="#000"
          onValueChange={(value) => handleChange('gender', value)}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Country"
        value={form.location.country}
        onChangeText={text => handleChange('country', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={form.location.city}
        onChangeText={text => handleChange('city', text)}
      />

      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/login')} style={styles.switch}>
        <Text style={styles.switchText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    color: '#000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  flagButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    color: '#000',
    padding: 12,
    borderRadius: 8,
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
  switch: {
    marginTop: 20,
  },
  switchText: {
    color: '#666',
    textAlign: 'center',
  },
});
