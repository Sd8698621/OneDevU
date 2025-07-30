import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const messagesData = [
  {
    id: '1',
    name: 'Riya Sharma',
    message: 'Hey, did you check the new post?',
    avatar: 'https://i.pravatar.cc/150?img=1',
    time: '2 min ago',
  },
  {
    id: '2',
    name: 'Amit Verma',
    message: 'Let’s collaborate on the hackathon project!',
    avatar: 'https://i.pravatar.cc/150?img=2',
    time: '10 min ago',
  },
  {
    id: '3',
    name: 'Anjali Mehta',
    message: 'Thanks for connecting!',
    avatar: 'https://i.pravatar.cc/150?img=3',
    time: '1 hr ago',
  },
  {
    id: '4',
    name: 'Google Careers',
    message: 'Your application has been received.',
    avatar: 'https://i.pravatar.cc/150?img=4',
    time: '1 day ago',
  },
];

const Messages = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof messagesData[0] }) => (
    <Pressable style={styles.chatItem} onPress={() => router.push('/chat')}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatTextContainer}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={messagesData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <Pressable style={styles.footerItem} onPress={() => router.replace('/home')}>
          <Feather name="home" size={20} color="#444" />
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

        <Pressable style={styles.footerItem} onPress={() => router.replace('/messages')}>
          <Feather name="message-circle" size={20} color="#0073b1" />
          <Text style={styles.footerText}>Messages</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: '#222',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
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
