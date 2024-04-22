import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, TextInput, Modal, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios'; 

const ProfileScreen: React.FC = () => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setUserData] = useState<any>(null); 

  useEffect(() => {
    fetchUserData(); 
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('https://party-renting-platform-aa30573d1765.herokuapp.com/api/account');
      setUserData(response.data);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setEditingProfile(false);
  };

  return (
    <View style={styles.container}>
      {userData && (
        <>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userData.imageUrl }} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
          <Text style={styles.email}>{userData.email}</Text>

        </>
      )}
      <Pressable style={styles.editButtonContainer} onPress={handleEditProfile}>
        <View style={styles.editIconContainer}>
          <FontAwesome name="edit" size={24} color="blue" style={styles.editIcon} />
        </View>
        <Text style={styles.editProfileButtonText}>Chỉnh sửa hồ sơ</Text>
      </Pressable>
      <View style={styles.aboutContainer}>
        <Text style={styles.sectionHeader}>Giới thiệu về tôi</Text>
       <Text style={styles.aboutText}>Một bữa tiệc, hoặc party, là một sự kiện xã hội hoặc lễ hội được tổ chức để kỷ niệm, vui chơi, gặp gỡ bạn bè hoặc gia đình, hoặc đơn giản là để thư giãn và giải trí. Các loại bữa tiệc có thể khác nhau tùy thuộc vào mục đích và phong cách của sự kiện.</Text>
      </View>

      <Modal visible={editingProfile} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
          <Button title="Save" onPress={handleSaveProfile} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center', 
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10, 
  },
  editButtonContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 10,
    padding: 8,
  },
  editIconContainer: {
    marginRight: 5,
  },
  editIcon: {
    fontSize: 24,
  },
  editProfileButtonText: {
    color: 'blue',
    fontSize: 18,
  },
  aboutContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    fontSize: 16,
    color: 'gray', 
    marginBottom:10,
  },
  input: {
    width: '80%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default ProfileScreen;
