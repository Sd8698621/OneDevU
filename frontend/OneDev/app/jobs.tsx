import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const jobsData = [
  { id: '1', company: 'Google', title: 'Frontend Developer' },
  { id: '2', company: 'Microsoft', title: 'Backend Engineer' },
  { id: '3', company: 'Amazon', title: 'Cloud Architect' },
  { id: '4', company: 'Netflix', title: 'UI/UX Designer' },
];

const Jobs = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof jobsData[0] }) => (
    <Pressable style={styles.jobItem}>
      <Feather name="briefcase" size={20} color="#0073b1" style={styles.icon} />
      <View>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobCompany}>{item.company}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jobs</Text>
      <FlatList
        data={jobsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 120 }} // prevent overlap
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

        <Pressable style={styles.footerItem} onPress={() => router.replace('/jobs')}>
          <Feather name="briefcase" size={20} color="#0073b1" />
          <Text style={styles.footerText}>Jobs</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Jobs;

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
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  jobCompany: {
    fontSize: 14,
    color: '#666',
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
    paddingBottom: 24, // slight increase for spacing
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
