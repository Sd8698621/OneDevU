import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileType = {
  photo?: string;
  headline?: string;
  education?: string;
  work?: string;
  skills?: string[];
  bio?: string;
  interests?: string[];
};

type UserType = {
  name: string;
  username: string;
  email: string;
  profile?: ProfileType;
};

const Profile = () => {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://10.252.166.129:3000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>User not found.</Text>
      </View>
    );
  }

  const { name, username, email, profile } = user;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: profile?.photo || 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.username}>@{username}</Text>
      <Text style={styles.email}>{email}</Text>
      {profile?.headline ? <Text style={styles.headline}>{profile.headline}</Text> : null}
      <View style={styles.section}>
        <Text style={styles.label}>Education</Text>
        <Text>{profile?.education || 'N/A'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Work</Text>
        <Text>{profile?.work || 'N/A'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Skills</Text>
        <Text>{profile?.skills?.join(', ') || 'N/A'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <Text>{profile?.bio || 'N/A'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Interests</Text>
        <Text>{profile?.interests?.join(', ') || 'N/A'}</Text>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  email: {
    marginVertical: 5,
    color: '#888',
  },
  headline: {
    fontStyle: 'italic',
    marginBottom: 15,
  },
  section: {
    width: '100%',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
});
