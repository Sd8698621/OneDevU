import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const alertsData = [
  { id: '1', type: 'message', text: 'You have a new message from Ankit.' },
  { id: '2', type: 'mention', text: 'Riya mentioned you in a post.' },
  { id: '3', type: 'job', text: 'Google has posted a new job you might like.' },
  { id: '4', type: 'connection', text: 'Amit has sent you a connection request.' },
];

const iconMap: Record<string, { name: keyof typeof Feather.glyphMap; color: string }> = {
  message: { name: 'message-circle', color: '#007bff' },
  mention: { name: 'at-sign', color: '#28a745' },
  job: { name: 'briefcase', color: '#ff8800' },
  connection: { name: 'user-plus', color: '#6f42c1' },
};

const Alerts = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof alertsData[0] }) => {
    const icon = iconMap[item.type] || { name: 'bell', color: '#333' };

    return (
      <Pressable style={styles.alertItem}>
        <Feather name={icon.name} size={20} color={icon.color} style={styles.icon} />
        <Text style={styles.text}>{item.text}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Alerts</Text>
        <FlatList
          data={alertsData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

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
          <Feather name="bell" size={20} color="#0073b1" />
          <Text style={[styles.footerText, { color: '#0073b1' }]}>Alerts</Text>
        </Pressable>

        <Pressable style={styles.footerItem} onPress={() => router.replace('/jobs')}>
          <Feather name="briefcase" size={20} color="#444" />
          <Text style={styles.footerText}>Jobs</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Alerts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
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
  paddingBottom: 24, // slightly increased
  borderTopWidth: 1,
  borderColor: '#ccc',
  backgroundColor: '#f9f9f9',
  zIndex: 10,
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
