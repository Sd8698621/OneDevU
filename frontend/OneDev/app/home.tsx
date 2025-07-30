import React, { useEffect, useState, useCallback, useRef } from 'react';
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

const API_BASE_URL = 'http://10.252.166.129:3000';

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
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const performSearch = async (query: string) => {
    if (!query || !token) return;
    try {
      setSearchLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!Array.isArray(data)) {
        setSearchResults([]);
        return;
      }

      const enriched = await Promise.all(
        data.map(async (u) => {
          try {
            const checkRes = await fetch(`${API_BASE_URL}/api/users/is-following/${u.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const check = await checkRes.json();
            return { ...u, isFollowing: check.isFollowing };
          } catch {
            return { ...u, isFollowing: false };
          }
        })
      );

      setSearchResults(enriched);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => performSearch(query), 300);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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

  const FollowButton = ({
    isFollowing,
    onPress,
    disabled,
  }: {
    isFollowing: boolean;
    onPress: () => void;
    disabled: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          paddingVertical: 6,
          paddingHorizontal: 16,
          borderRadius: 20,
          backgroundColor: isFollowing ? '#fff' : '#0073b1',
          borderWidth: 1,
          borderColor: '#0073b1',
          alignSelf: 'flex-start',
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Text style={{ color: isFollowing ? '#0073b1' : '#fff', fontWeight: '600' }}>
        {isFollowing ? 'Follow' : 'Following'}
      </Text>
    </Pressable>
  );

  const UserCard = ({ user }: { user: any }) => {
    const [isFollowing, setIsFollowing] = useState(user.isFollowing);
    const [followLoading, setFollowLoading] = useState(false);

    const toggleFollow = async () => {
      if (followLoading) return;
      setFollowLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/follow`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ targetId: user.id }),
        });

        if (!res.ok) throw new Error('Failed to toggle follow');
        setIsFollowing(!isFollowing);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to update follow status');
      } finally {
        setFollowLoading(false);
      }
    };

    return (
      <View style={styles.card}>
        <Pressable onPress={() => router.push(`/profile/${user.id}`)}>
          <Text style={styles.author}>{user.name}</Text>
          <Text style={styles.content}>{user.email || 'No email available'}</Text>
        </Pressable>
        <FollowButton isFollowing={isFollowing} onPress={toggleFollow} disabled={followLoading} />
      </View>
    );
  };

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
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/profile')}>
          <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.profilePic} />
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

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {searchQuery.length > 0 ? (
          searchLoading ? (
            <ActivityIndicator size="small" color="#0073b1" style={{ marginTop: 20 }} />
          ) : (
            searchResults.map((user) => <UserCard key={user.id} user={user} />)
          )
        ) : (
          mockPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.footerItem} onPress={() => router.replace('/home')}>
          <Feather name="home" size={20} color="#0073b1" />
          <Text style={styles.footerText}>Home</Text>
        </Pressable>

        <Pressable style={styles.footerItem} onPress={() => router.replace('/network')}>
          <Feather name="users" size={20} color="#444" />
          <Text style={styles.footerText}>Network</Text>
        </Pressable>

        <Pressable style={styles.footerItem} onPress={() => router.replace('/post')}>
          <Feather name="plus-square" size={20} color="#444" />
          <Text style={styles.footerText}>Post</Text>
        </Pressable>

        <Pressable style={styles.footerItem} onPress={() => router.replace('/alerts')}>
          <Feather name="bell" size={20} color="#444" />
          <Text style={styles.footerText}>Alerts</Text>
        </Pressable>

        <Pressable style={styles.footerItem} onPress={() => router.replace('/jobs')}>
          <Feather name="briefcase" size={20} color="#444" />
          <Text style={styles.footerText}>Jobs</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    gap: 12,
  },
  profilePic: { width: 32, height: 32, borderRadius: 16 },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 36,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14 },
  container: { padding: 12, gap: 12 },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  author: { fontSize: 16, fontWeight: '600', color: '#333' },
  title: { fontSize: 15, fontWeight: '500', marginTop: 4 },
  content: { fontSize: 14, color: '#666', marginTop: 2 },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'center',
  },
  logoutText: { color: '#333' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  footerItem: { alignItems: 'center' },
  footerText: { fontSize: 12, color: '#444', marginTop: 2 },
});
