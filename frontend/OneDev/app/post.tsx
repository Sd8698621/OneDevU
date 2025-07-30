import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Post = () => {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission required', 'Camera roll permissions are needed.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && !imageUri) {
      Alert.alert('Empty Post', 'Please add some content or media to post.');
      return;
    }

    console.log('Post content:', text);
    console.log('Image/File:', imageUri);

    // Clear form
    setText('');
    setImageUri(null);

    Alert.alert('Posted!', 'Your content has been shared.');
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post</Text>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <TextInput
          multiline
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        )}

        <Pressable style={styles.mediaBtn} onPress={pickImage}>
          <Feather name="image" size={20} color="#0073b1" />
          <Text style={styles.mediaText}>Add Photo/Video</Text>
        </Pressable>

        <Pressable style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Post</Text>
        </Pressable>
      </ScrollView>

      {/* Footer */}
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
          <Feather name="plus-square" size={20} color="#0073b1" />
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

export default Post;

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
  form: {
    paddingBottom: 140,
  },
  input: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  mediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f3ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  mediaText: {
    marginLeft: 8,
    color: '#0073b1',
    fontSize: 14,
    fontWeight: '500',
  },
  preview: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  submitBtn: {
    backgroundColor: '#0073b1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
