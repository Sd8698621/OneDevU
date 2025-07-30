// app/profile/[id].tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const API_BASE_URL = 'http://10.252.166.129:3000';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (!storedToken || !storedUser) throw new Error('Missing token or userId');
        setToken(storedToken);
        const userObj = JSON.parse(storedUser);
        setCurrentUserId(userObj.id);

        const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const data = await res.json();
        setProfile(data);

        // Check follow status
        const followRes = await fetch(`${API_BASE_URL}/api/users/is-following/${id}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const followData = await followRes.json();
        setIsFollowing(followData?.isFollowing ?? false);
      } catch (err) {
        console.error('❌ Failed to load profile:', err);
        Alert.alert('Error', 'Could not load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleFollow = async () => {
    if (!token || followLoading) return;
    setFollowLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/follow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetId: id }),
      });

      if (!res.ok) throw new Error('Follow/unfollow failed');
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error('Follow error:', err);
      Alert.alert('Error', 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0073b1" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text>❌ User not found</Text>
      </View>
    );
  }

  const bannerUri = profile.profile.banner
    ? profile.profile.banner
    : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const photoUri = profile.profile.photo
    ? profile.profile.photo
    : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: bannerUri }} style={styles.banner} resizeMode="cover" />
      <View style={styles.profileContainer}>
        <Image source={{ uri: photoUri }} style={styles.profilePic} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.bio}>{profile.profile.bio || 'No bio provided'}</Text>

        <View style={styles.stats}>
          <Text style={styles.stat}>
            Followers: {profile.followers?.length ?? 0}
          </Text>
          <Text style={styles.stat}>
            Following: {profile.following?.length ?? 0}
          </Text>
        </View>

        {String(currentUserId) !== String(id) && (
          <Pressable
            onPress={toggleFollow}
            disabled={followLoading}
            style={[
              styles.followButton,
              isFollowing ? styles.following : styles.follow,
              followLoading && { opacity: 0.6 },
            ]}
          >
            <Text style={{ color: isFollowing ? '#0073b1' : '#fff', fontWeight: '600' }}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 160,
    backgroundColor: '#ccc',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 16,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -50,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 12,
  },
  stat: {
    fontSize: 14,
    color: '#444',
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0073b1',
  },
  follow: {
    backgroundColor: '#0073b1',
  },
  following: {
    backgroundColor: '#fff',
  },
});
