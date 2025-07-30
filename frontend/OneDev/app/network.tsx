import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const connections = [
  { id: '1', name: 'Ankit Kumar', title: 'Web Developer', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Riya Sharma', title: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Amit Patel', title: 'Data Scientist', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Sakshi Verma', title: 'Product Manager', avatar: 'https://i.pravatar.cc/150?img=4' },
];

const Network = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof connections[0] }) => (
    <View style={styles.connectionItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Pressable style={styles.connectButton}>
        <Text style={styles.connectText}>Message</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Network</Text>
      <FlatList
        data={connections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.footerItem} onPress={() => router.replace('/home')}>
          <Feather name="home" size={20} color="#444" />
          <Text style={styles.footerText}>Home</Text>
        </Pressable>

        <Pressable style={styles.footerItem} onPress={() => router.replace('/network')}>
          <Feather name="users" size={20} color="#0073b1" />
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
    </View>
  );
};

export default Network;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 14,
    color: '#666',
  },
  connectButton: {
    backgroundColor: '#0073b1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  connectText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
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
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
    color: '#444',
  },
});
