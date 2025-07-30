import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  Image,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';

const API_HOST = Constants.expoConfig?.extra?.API_HOST || 'localhost';
const API_PORT = Constants.expoConfig?.extra?.API_PORT || '3000';
const API_BASE_URL = `http://10.252.166.129:3000`;

const mockPosts = [
  {
    id: '1',
    author: 'Sayan Dutta',
    title: '🚀 Launched New App!',
    content: 'Our dev tool is now live. Check GitHub!',
  },
  {
    id: '2',
    author: 'Team Ekko',
    title: '📢 Recruitment Alert!',
    content: 'Join us and build awesome tech.',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const userJson = await AsyncStorage.getItem('user');
        if (!storedToken || !userJson) {
          router.replace('/login');
          return;
        }
        setToken(storedToken);
        setUser(JSON.parse(userJson));
        setLoading(false);
      } catch (err) {
        console.error('Failed to load user:', err);
        router.replace('/login');
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Logged out', 'You have been successfully logged out.');
      router.replace('/login');
    } catch (err) {
      console.error('Logout error:', err);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query || !token) return;

    try {
      setSearchLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Invalid response from server');
      }

      const data = await res.json();
      if (res.ok) {
        setSearchResults(data.users || []);
      } else {
        console.warn('Search failed:', data.error || 'Unknown error');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const UserCard = ({ user }: { user: any }) => (
    <View key={user._id} style={styles.card}>
      <Text style={styles.author}>{user.name}</Text>
      <Text style={styles.content}>{user.email}</Text>
    </View>
  );

  const PostCard = ({ post }: { post: typeof mockPosts[0] }) => (
    <View key={post.id} style={styles.card}>
      <Text style={styles.author}>{post.author}</Text>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0073b1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/profile')}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/300' }}
            style={styles.profilePic}
            onError={() => console.log('Image load failed')}
          />
        </Pressable>
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <Pressable onPress={() => router.push('/messages')}>
          <Feather name="message-circle" size={20} color="#333" />
        </Pressable>
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {searchQuery.length > 0 ? (
          searchLoading ? (
            <ActivityIndicator size="small" color="#0073b1" style={{ marginTop: 20 }} />
          ) : (
            searchResults.map((user) => <UserCard key={user._id} user={user} />)
          )
        ) : (
          mockPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {[
          { icon: 'home', route: '/home' },
          { icon: 'users', route: '/network' },
          { icon: 'plus-square', route: '/post' },
          { icon: 'bell', route: '/alerts' },
          { icon: 'briefcase', route: '/jobs' },
        ].map(({ icon, route }) => (
          <Pressable key={icon} style={styles.footerItem} onPress={() => router.replace(route)}>
            <Feather name={icon as any} size={20} color="#444" />
            <Text style={styles.footerText}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: 18 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  profilePic: { width: 32, height: 32, borderRadius: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
    marginHorizontal: 12,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 6, fontSize: 14, color: '#000' },
  container: { padding: 16, paddingBottom: 80 },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  author: { fontWeight: 'bold', color: '#0073b1', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  content: { fontSize: 14, color: '#444', marginBottom: 10 },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#e60023',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    zIndex: 10,
  },
  footerItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  footerText: { fontSize: 12, textAlign: 'center', color: '#444' },
});
