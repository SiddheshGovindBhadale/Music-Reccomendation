import { SafeAreaView, ScrollView, StyleSheet, Text, Linking, TextInput, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MusicItem from '../components/home/MusicItem';
import { playListData } from '../constants'


const Home = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get the user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userData');

      setUserData(JSON.parse(userId));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);

      const userId = await AsyncStorage.getItem('userData');
      setUserData(JSON.parse(userId));
      showToast('Error loading Data : Check Internet Connection');
      setIsLoading(false);
    }
  };

  //search fuction 
  const clearSearch = () => {
    setSearchText('');
  };

  const handleSearch = () => {
    // navigation.navigate('Issued', { data: searchText })
  };

  const searchYT = (searchTerm) => {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + ' ' + 'songs')}`;

    Linking.openURL(searchUrl);
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#0A071E', height: '100%' }}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#6156E2" />
      ) : (
        <ScrollView>
          <View style={styles.mainContainer}>
            {/* user Details */}
            <View style={styles.userProfile}>
              <View style={styles.profileRight}>
                <Image style={styles.profileImage} source={require('../assets/icon/user.png')} />
              </View>
              <View style={styles.profileLeft}>
                <View style={styles.top}>
                  <Text style={styles.hi}>Hi</Text>
                  <Text style={styles.userName}>{userData.name}</Text>
                </View>
                <Text style={styles.welcome}>Welcome back to Music</Text>
              </View>
            </View>

            {/* search bar  */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBarLeft}>
                <TextInput
                  style={styles.searchBar}
                  placeholder="Search..."
                  placeholderTextColor={'#8E8E8E'}
                  value={searchText}
                  onChangeText={(text) => setSearchText(text)}
                />
                {searchText ? (
                  <TouchableOpacity onPress={clearSearch} style={styles.cutButton}>
                    <Ionicons name="close" size={20} color="#8E8E8E" />
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                <Ionicons name="search" size={20} color="#8E8E8E" />
              </TouchableOpacity>
            </View>


            {/* category */}
            <View style={styles.categorySection}>
              <Text style={styles.recommendText}>Category</Text>
              <View style={styles.categoryContainer}>
                <ScrollView horizontal={true}>
                  <View style={styles.itemContainer}>
                    <TouchableOpacity style={styles.item} onPress={() => { searchYT('Wake Up') }}>
                      <View style={styles.catImageContainer}>
                        <Image style={styles.catImage} source={require('../assets/category/wakeup.jpg')} />
                      </View>
                      <Text style={styles.catText}>Wake Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => { searchYT('Traning') }}>
                      <View style={styles.catImageContainer}>
                        <Image style={styles.catImage} source={require('../assets/category/traning.jpg')} />
                      </View>
                      <Text style={styles.catText}>Traning</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemContainer}>
                    <TouchableOpacity style={styles.item} onPress={() => { searchYT('Party') }}>
                      <View style={styles.catImageContainer}>
                        <Image style={styles.catImage} source={require('../assets/category/party.jpg')} />
                      </View>
                      <Text style={styles.catText}>Party</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => { searchYT('Panjabi') }}>
                      <View style={styles.catImageContainer}>
                        <Image style={styles.catImage} source={require('../assets/category/panjabi.jpg')} />
                      </View>
                      <Text style={styles.catText}>Panjabi</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemContainer}>
                    <TouchableOpacity style={styles.item} onPress={() => { searchYT('Gangster') }}>
                      <View style={styles.catImageContainer}>
                        <Image style={styles.catImage} source={require('../assets/category/gangster.jpg')} />
                      </View>
                      <Text style={styles.catText}>Gangster</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => { searchYT('Love') }}>
                      <View style={styles.catImageContainer}>
                        <Image style={styles.catImage} source={require('../assets/category/love.jpg')} />
                      </View>
                      <Text style={styles.catText}>Love</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemContainer}>
                    <TouchableOpacity style={styles.item} onPress={() => { searchYT('Sad') }}>
                      <View style={styles.catImageContainer}>
                        <Image style={styles.catImage} source={require('../assets/category/sad.jpg')} />
                      </View>
                      <Text style={styles.catText}>Sad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => { searchYT('Concert') }}>
                      <View style={styles.catImageContainer}>
                        <Image style={styles.catImage} source={require('../assets/category/consert.jpg')} />
                      </View>
                      <Text style={styles.catText}>Concert</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* recommended music */}
            <View style={styles.recommendSection}>
              <Text style={styles.recommendText}>Recommended for you</Text>
              <View style={styles.recomendContainer}>
                <MusicItem song={playListData[0]} />
                <MusicItem song={playListData[1]} />
                <MusicItem song={playListData[2]} />
                <MusicItem song={playListData[3]} />
                <MusicItem song={playListData[4]} />
                <MusicItem song={playListData[5]} />
                <MusicItem song={playListData[6]} />
              </View>
              <TouchableOpacity style={styles.exploreButton} onPress={() => {navigation.navigate('LatestSongs')}}>
                <Text style={styles.exploreButtonText}>Explore more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: '100%'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // user details 
  userProfile: {
    // borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 10
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4
  },
  hi: {
    color: '#F2F2F2',
    fontSize: 14,
    // fontWeight: ''
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F2F2F2',
    textTransform: 'capitalize'
  },
  welcome: {
    fontSize: 12,
    fontWeight: '400',
    color: '#DEDEDE'
  },
  profileRight: {
    width: 38,
    height: 38,
    borderRadius: 100,
    overflow: 'hidden',
    marginRight: 10
    // borderWidth: 1
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  // serach 
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 18,
    marginBottom: 16,
    backgroundColor: '#0A091E',
    height: 40,
    borderWidth: 0.2,
    borderColor: '#8E8E8E'
  },
  searchBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '86%',
  },
  searchBar: {
    display: 'flex',
    paddingVertical: 5,
    color: '#8E8E8E',
    fontSize: 14,
    paddingHorizontal: 10,
    width: '90%'
  },
  cutButton: {
    height: '100%',
  },
  searchButton: {
    width: '12%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // music category 
  categoryContainer: {
    marginTop: 17,
    marginBottom: 15
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  item: {
    marginBottom: 15
  },
  catImageContainer: {
    width: 90,
    height: 90,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 3
  },
  catImage: {
    width: '100%',
    height: '100%',
  },
  catText: {
    color: '#F2F2F2',
    fontSize: 12,
    fontWeight: '400'
  },

  // recommended music 
  recommendText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F2F2F2'
  },
  recomendContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 17,
    // gap: 11
  },
  exploreButton: {
    width: '100%',
    backgroundColor: '#6156E2',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 8
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.25
  }

})

export default Home
