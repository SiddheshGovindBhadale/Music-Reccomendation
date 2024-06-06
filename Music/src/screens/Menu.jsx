import { StyleSheet, Text, View, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Image, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Menu = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        setUserData(JSON.parse(storedUserData));
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading userData:', error);
        setIsLoading(false)
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
    // navigation.navigate('Auth');
    showToast('Logout Succesfull')
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#0A071E', height: '100%' }}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#6156E2" />
      ) : (
        <ScrollView>
          <View style={styles.mainContainer}>
            <View style={styles.topStatusBar}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('FarmerToFarmer')}>
                <Ionicons name="arrow-back" size={22} color="#F2F2F2" />
              </TouchableOpacity>
              <Text style={styles.heading}>Settings</Text>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.imageContainer}>
                <Image style={styles.userImage} source={require('../assets/icon/user.png')} />
              </View>
              <View style={styles.profileDetails}>
                <View style={styles.userDetails}>
                  <Text style={styles.hello}>Hello</Text>
                  <Text style={styles.userName}>{userData.name}</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons style={styles.editButtonIcon} name="create-sharp" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.navButton} onPress={() => { navigation.navigate('LatestSongs') }}>
                <Text style={styles.navButtonText}>Find music</Text>
                <Ionicons style={styles.editButtonIcon} name="chevron-forward-outline" size={16} color="#DEDEDE" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={() => { navigation.navigate('LatestSongs') }}>
                <Text style={styles.navButtonText}>Recommended music</Text>
                <Ionicons style={styles.editButtonIcon} name="chevron-forward-outline" size={16} color="#DEDEDE" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={() => { navigation.navigate('ChangePassword') }}>
                <Text style={styles.navButtonText}>Change Password</Text>
                <Ionicons style={styles.editButtonIcon} name="chevron-forward-outline" size={16} color="#DEDEDE" />
              </TouchableOpacity>
            </View>

            <View style={[styles.buttonContainer, { paddingBottom: 6 }]}>
              <TouchableOpacity style={styles.navButton} onPress={() => { handleLogout() }}>
                <Text style={[styles.navButtonText, { color: '#F93535' }]}>Logout</Text>
                <Ionicons style={styles.editButtonIcon} name="chevron-forward-outline" size={16} color="#F93535" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
      {/* <BottomNavigation /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#0A071E',
    height: '100%'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topStatusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#0A071E'
  },
  backButton: {
    // borderWidth:1,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  heading: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: '600'
  },

  // user profile 
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 10,
    paddingVertical: 35,
    backgroundColor: '#6156E2'
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  imageContainer: {
    height: 60,
    width: 60,
    borderRadius: 100,
    overflow: 'hidden'
  },
  userImage: {
    height: "100%",
    width: "100%",
  },
  hello: {
    color: '#ffffff',
    fontWeight: '400',
    fontSize: 14
  },
  userName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  editButton: {
    borderRadius: 100,
    backgroundColor: '#6f65e6'
  },
  editButtonIcon: {
    paddingVertical: 7,
    paddingHorizontal: 7
  },

  // navigation buttons
  buttonContainer: {
    backgroundColor: '#0c091c',
    paddingTop: 7,
  },
  navButton: {
    borderBottomWidth: 1.5,
    borderColor: '#0A071E',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 5,
    backgroundColor: '#201b38'
  },
  navButtonText: {
    color: '#DEDEDE',

  }
})

export default Menu
