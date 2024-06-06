import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  Platform,
  FlatList,
  TextInput,
  ActivityIndicator,
  LogBox, // Import Platform
} from 'react-native';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import PermissionsService, { isIOS } from '../utils/Permissions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Picker from '@react-native-picker/picker'
import Config from 'react-native-config';

LogBox.ignoreAllLogs();
const languages = [
  { lang: 'Marathi' },
  { lang: 'Hindi' },
  { lang: 'Panjabi' },
  // { lang: 'English' },
];

const Search = ({ navigation }) => {
  const [image, setImage] = useState('');
  const [label, setLabel] = useState('');
  const [result, setResult] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedTab2, setSelectedTab2] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState(0);
  const [selectedSinger, setSelectedSinger] = useState(0);

  //dropdown
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState(languages);
  const [selectedLang, setselectedLang] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
  })

  const emoji = ['Happy', 'Neutral', 'Sad', 'Angry']
  const singers = [
    'Arijit Sing',
    'Sachet Tandon',
    'Mohit Chauhan',
    'Vijay Prakash',
    'Sonu Nigam',
    'Shreya Ghoshal',
    'Neha Kakkar',
    'Sunidhi Chauhan',
    'Dhvani Bhanushali',
    'Sidhu Moose Wala',
    'Honey Singh',
    'Guru Randhawa',
    'Hardy Sandhu'
  ]

  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const options = {
    mediaType: 'photo',
    quality: 1,
    width: 256,
    height: 256,
    includeBase64: true,
  };

  const manageCamera = async type => {
    try {
      if (!(await PermissionsService.hasCameraPermission())) {
        return [];
      } else {
        if (type === 'Camera') {
          openCamera();
        } else {
          openLibrary();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openCamera = async () => {
    launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const uri = response?.assets[0]?.uri;
        const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
        handleImage(path, response);
      }
    });
  };

  const openLibrary = async () => {
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const uri = response.assets[0].uri;
        const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
        handleImage(path, response);
      }
    });
  };

  const handleImage = (path, response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const uri = path;
      const name = response.assets[0]?.fileName;
      const type = response.assets[0]?.type;

      if (!uri || !name || !type) {
        console.log('Invalid image data');
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri,
        name,
        type,
      });

      sendImageToServer(formData);
      setImage(path);
    }
  };


  const sendImageToServer = async (formData) => {
    setLabel('Predicting....');
    console.log(Config.MODEL_URL)
    try {
      const response = await axios.post(`http://192.168.185.152:8000/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.predictions) {
        setLabel(response.data.predictions);
      } else {
        setLabel('Failed to predict');
      }
    } catch (error) {
      console.error('Error sending image:', error);
      setLabel('Failed to predict');
    }
  };

  const handlePress = (searchTerm) => {
    const query = ''
    console.log(searchTerm)
    if (searchTerm.label === '') {
      const query = searchTerm.singer + ' ' + searchTerm.emoji + ' ' + selectedLang + ' ' + 'songs'
      Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    } else {
      const query = searchTerm.singer + ' ' + searchTerm.label + ' ' + selectedLang + ' ' + 'songs'
      Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    }

    // const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    // Use Linking API to open the YouTube app with the search query

    // Linking.openURL(searchUrl);
  };


  const handlePressLocal = (searchTerm) => {
    const query = ''
    if (searchTerm.label === '') {
      const query = searchTerm.emoji + ' ' + selectedLang
      navigation.navigate('SearchResult', { query });
    } else {
      const query = searchTerm.label + ' ' + selectedLang
      navigation.navigate('SearchResult', { query });
    }
  };


  const handleSearch = () => {
    // navigation.navigate('Issued', { data: searchText })
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#0A071E', height: '100%' }}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#6156E2" />
      ) : (
        <ScrollView>
          <View style={styles.mainContainer}>
            <View style={styles.toggleButtons}>
              <TouchableOpacity style={[styles.toggleButton, { backgroundColor: selectedTab === 1 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedTab(1); setLabel(''); setImage('') }}>
                <Text style={styles.toggleButtonText}>YouTube</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleButton, { backgroundColor: selectedTab === 0 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedTab(0); setLabel(''); setImage('') }}>
                <Text style={styles.toggleButtonText}>Music</Text>
              </TouchableOpacity>
            </View>


            {selectedTab === 0 ? (
              <View style={styles.filterContainer}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 5,
                      borderWidth: 0.5,
                      alignSelf: 'center',
                      marginTop: 25,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 15,
                      paddingRight: 15,
                      backgroundColor: '#413c69',
                      borderWidth: 0.2,
                      borderColor: '#8E8E8E'
                    }}
                    onPress={() => {
                      setClicked(!clicked);
                    }}>
                    <Text style={{ fontWeight: '600' }}>
                      {selectedLang == '' ? 'Select lang' : selectedLang}
                    </Text>
                    {clicked ? (
                      <MaterialIcons name="keyboard-arrow-up" size={20} color="#fff" />
                    ) : (
                      <MaterialIcons name="keyboard-arrow-down" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                  {clicked ? (
                    <View
                      style={{
                        elevation: 5,
                        marginTop: 20,
                        height: 300,
                        alignSelf: 'center',
                        width: '100%',
                        backgroundColor: '#413c69',
                        borderRadius: 10,
                      }}>

                      {
                        data.map((item) =>
                          <TouchableOpacity
                            style={{
                              width: '85%',
                              alignSelf: 'center',
                              height: 50,
                              justifyContent: 'center',
                              borderBottomWidth: 0.5,
                              borderColor: '#f2f2f2',
                            }}
                            onPress={() => {
                              setselectedLang(item.lang);
                              setClicked(!clicked);
                            }}>
                            <Text style={{ fontWeight: '600', color: '#ffffff' }}>{item.lang}</Text>
                          </TouchableOpacity>
                        )
                      }
                      {/* <FlatList
                        data={data}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              style={{
                                width: '85%',
                                alignSelf: 'center',
                                height: 50,
                                justifyContent: 'center',
                                borderBottomWidth: 0.5,
                                borderColor: '#f2f2f2',
                              }}
                              onPress={() => {
                                setselectedLang(item.lang);
                                setClicked(!clicked);
                              }}>
                              <Text style={{ fontWeight: '600', color: '#ffffff' }}>{item.lang}</Text>
                            </TouchableOpacity>
                          );
                        }}
                      /> */}
                    </View>
                  ) : null}
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

                <View style={styles.toggleButtons}>
                  <TouchableOpacity style={[styles.toggleButton, { backgroundColor: selectedTab2 === 0 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedTab2(0); setLabel(''); setImage('') }}>
                    <Text style={styles.toggleButtonText}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.toggleButton, { backgroundColor: selectedTab2 === 1 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedTab2(1); setLabel(''); setImage('') }}>
                    <Text style={styles.toggleButtonText}>Emoji</Text>
                  </TouchableOpacity>
                </View>


                {selectedTab2 === 0 ? (
                  <View style={styles.container}>
                    {image ? (
                      <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                      <Text style={styles.instructions}>Select an image to predict</Text>
                    )}

                    {label && <Text style={styles.result}>{label}</Text>}

                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity style={styles.button} onPress={openCamera}>
                        <Text style={styles.buttonText}>Open Camera</Text>
                      </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity style={styles.button} onPress={openLibrary}>
                    <Text style={styles.buttonText}>Open Library</Text>
                  </TouchableOpacity> */}

                  </View>
                ) : (
                  <View style={styles.container}>
                    <View style={styles.emojiContainer}>
                      <TouchableOpacity style={[styles.emojiItem, { backgroundColor: selectedEmoji === 0 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedEmoji(0) }}>
                        <MaterialCommunityIcons name="emoticon-happy-outline" size={40} color="#ffff" />
                        <Text style={styles.emojiText}>Happy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.emojiItem, { backgroundColor: selectedEmoji === 1 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedEmoji(1) }}>
                        <MaterialCommunityIcons name="emoticon-neutral-outline" size={40} color="#fff" />
                        <Text style={styles.emojiText}>Neutral</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.emojiItem, { backgroundColor: selectedEmoji === 2 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedEmoji(2) }}>
                        <MaterialCommunityIcons name="emoticon-sad-outline" size={40} color="#fff" />
                        <Text style={styles.emojiText}>Sad</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.emojiItem, { backgroundColor: selectedEmoji === 3 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedEmoji(3) }}>
                        <MaterialCommunityIcons name="emoticon-angry-outline" size={40} color="#fff" />
                        <Text style={styles.emojiText}>Angry</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}


                {/* <View style={styles.container2}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 10
                  }}>Top Singers :</Text>
                  <ScrollView horizontal={true} style={styles.singerContainer}>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 0 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(0) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://w0.peakpx.com/wallpaper/791/288/HD-wallpaper-arijit-singh.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Arijit Sing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 1 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(1) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Sachet-Tandon.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Sachet Tandon</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 2 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(2) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Mohit-Chauhan.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Mohit Chauhan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 3 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(3) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Vijay-Prakash.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Vijay Prakash</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 4 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(4) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-sonu-nigam-singer.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Sonu Nigam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 5 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(5) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Shreya-Goshal.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Shreya Ghoshal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 6 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(6) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Neha-Kakkar.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Neha Kakkar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 7 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(7) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Sunidhi-Chauhan.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Sunidhi Chauhan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 8 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(8) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Dhvani-Bhanushali.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Dhvani Bhanushali</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 9 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(9) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://static.javatpoint.com/top10-technologies/images/top-10-punjabi-singers1.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Sidhu Moose Wala</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 10 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(10) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://static.javatpoint.com/top10-technologies/images/top-10-punjabi-singers8.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Honey Singh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 11 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(11) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://static.javatpoint.com/top10-technologies/images/top-10-punjabi-singers9.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Guru Randhawa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 12 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(12) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://static.javatpoint.com/top10-technologies/images/top-10-punjabi-singers10.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Hardy Sandhu</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View> */}



                <TouchableOpacity style={styles.mainSearchButton} onPress={() => { handlePressLocal({ label, selectedLang, 'emoji': emoji[selectedEmoji] }) }}>
                  <Text style={styles.mainSearchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.filterContainer}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 5,
                      borderWidth: 0.5,
                      alignSelf: 'center',
                      marginTop: 25,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 15,
                      paddingRight: 15,
                      backgroundColor: '#413c69',
                      borderWidth: 0.2,
                      borderColor: '#8E8E8E'
                    }}
                    onPress={() => {
                      setClicked(!clicked);
                    }}>
                    <Text style={{ fontWeight: '600' }}>
                      {selectedLang == '' ? 'Select lang' : selectedLang}
                    </Text>
                    {clicked ? (
                      <MaterialIcons name="keyboard-arrow-up" size={20} color="#fff" />
                    ) : (
                      <MaterialIcons name="keyboard-arrow-down" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                  {clicked ? (
                    <View
                      style={{
                        elevation: 5,
                        marginTop: 20,
                        height: 300,
                        alignSelf: 'center',
                        width: '100%',
                        backgroundColor: '#413c69',
                        borderRadius: 10,
                      }}>

                      {
                        data.map((item) =>
                          <TouchableOpacity
                            style={{
                              width: '85%',
                              alignSelf: 'center',
                              height: 50,
                              justifyContent: 'center',
                              borderBottomWidth: 0.5,
                              borderColor: '#f2f2f2',
                            }}
                            onPress={() => {
                              setselectedLang(item.lang);
                              setClicked(!clicked);
                            }}>
                            <Text style={{ fontWeight: '600', color: '#ffffff' }}>{item.lang}</Text>
                          </TouchableOpacity>
                        )
                      }

                      {/* <FlatList
                        data={data}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              style={{
                                width: '85%',
                                alignSelf: 'center',
                                height: 50,
                                justifyContent: 'center',
                                borderBottomWidth: 0.5,
                                borderColor: '#f2f2f2',
                              }}
                              onPress={() => {
                                setselectedLang(item.lang);
                                setClicked(!clicked);
                              }}>
                              <Text style={{ fontWeight: '600', color: '#ffffff' }}>{item.lang}</Text>
                            </TouchableOpacity>
                          );
                        }}
                      /> */}
                    </View>
                  ) : null}
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

                <View style={styles.toggleButtons}>
                  <TouchableOpacity style={[styles.toggleButton, { backgroundColor: selectedTab2 === 0 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedTab2(0); setLabel(''); setImage('') }}>
                    <Text style={styles.toggleButtonText}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.toggleButton, { backgroundColor: selectedTab2 === 1 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedTab2(1); setLabel(''); setImage('') }}>
                    <Text style={styles.toggleButtonText}>Emoji</Text>
                  </TouchableOpacity>
                </View>


                {selectedTab2 === 0 ? (
                  <View style={styles.container}>
                    {image ? (
                      <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                      <Text style={styles.instructions}>Select an image to predict</Text>
                    )}

                    {label && <Text style={styles.result}>{label}</Text>}

                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity style={styles.button} onPress={openCamera}>
                        <Text style={styles.buttonText}>Open Camera</Text>
                      </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity style={styles.button} onPress={openLibrary}>
                    <Text style={styles.buttonText}>Open Library</Text>
                  </TouchableOpacity> */}

                  </View>
                ) : (
                  <View style={styles.container}>
                    <View style={styles.emojiContainer}>
                      <TouchableOpacity style={[styles.emojiItem, { backgroundColor: selectedEmoji === 0 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedEmoji(0) }}>
                        <MaterialCommunityIcons name="emoticon-happy-outline" size={40} color="#ffff" />
                        <Text style={styles.emojiText}>Happy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.emojiItem, { backgroundColor: selectedEmoji === 1 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedEmoji(1) }}>
                        <MaterialCommunityIcons name="emoticon-neutral-outline" size={40} color="#fff" />
                        <Text style={styles.emojiText}>Neutral</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.emojiItem, { backgroundColor: selectedEmoji === 2 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedEmoji(2) }}>
                        <MaterialCommunityIcons name="emoticon-sad-outline" size={40} color="#fff" />
                        <Text style={styles.emojiText}>Sad</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.emojiItem, { backgroundColor: selectedEmoji === 3 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedEmoji(3) }}>
                        <MaterialCommunityIcons name="emoticon-angry-outline" size={40} color="#fff" />
                        <Text style={styles.emojiText}>Angry</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}




                <View style={styles.container2}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 10
                  }}>Top Singers :</Text>
                  <ScrollView horizontal={true} style={styles.singerContainer}>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 0 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(0) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://w0.peakpx.com/wallpaper/791/288/HD-wallpaper-arijit-singh.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Arijit Sing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 1 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(1) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Sachet-Tandon.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Sachet Tandon</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 2 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(2) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Mohit-Chauhan.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Mohit Chauhan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 3 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(3) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Vijay-Prakash.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Vijay Prakash</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 4 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(4) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-sonu-nigam-singer.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Sonu Nigam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 5 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(5) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Shreya-Goshal.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Shreya Ghoshal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 6 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(6) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Neha-Kakkar.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Neha Kakkar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 7 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(7) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Sunidhi-Chauhan.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Sunidhi Chauhan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 8 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(8) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://stylesatlife.com/wp-content/uploads/2021/09/Singer-Dhvani-Bhanushali.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Dhvani Bhanushali</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 9 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(9) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://static.javatpoint.com/top10-technologies/images/top-10-punjabi-singers1.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Sidhu Moose Wala</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 10 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(10) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://static.javatpoint.com/top10-technologies/images/top-10-punjabi-singers8.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Honey Singh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 11 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(11) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://static.javatpoint.com/top10-technologies/images/top-10-punjabi-singers9.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Guru Randhawa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.singerItem, { backgroundColor: selectedSinger === 12 ? '#0A071E' : '#413c69' }]} onPress={() => { setSelectedSinger(12) }}>
                      <View style={styles.singerImageContainer}>
                        <Image style={styles.singerImage} source={{ uri: "https://static.javatpoint.com/top10-technologies/images/top-10-punjabi-singers10.jpg" }} />
                      </View>
                      <Text style={styles.catText}>Hardy Sandhu</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>




                <TouchableOpacity style={styles.mainSearchButton} onPress={() => { handlePress({ label, selectedLang, 'emoji': emoji[selectedEmoji], 'singer': singers[selectedSinger] }) }}>
                  <Text style={styles.mainSearchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>
            )}


          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

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

  //toggleButton
  toggleButtons: {
    width: '100%',
    marginTop: 17,
    marginBottom: 2,
    borderWidth: 0.2,
    borderColor: '#8E8E8E',
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 4,
    backgroundColor: '#413c69'
  },
  toggleButton: {
    height: 31,
    width: '50%',
    backgroundColor: '#0A071E',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
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


  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
    paddingVertical: 10,
    backgroundColor: '#413c69',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 20
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '600',
    color: '#fff',
  },
  result: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#ffffff'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: '#0A071E',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  //emoji container 
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%'
  },
  emojiItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10
  },

  //search button 
  mainSearchButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#413c69',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  mainSearchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase'
  },


  // singers
  container2: {
    backgroundColor: '#413c69',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20
  },
  singerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginRight: 10,
    paddingBottom: 10,
    paddingTop: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    // borderWidth:1,
    // borderColor:'#0A071E'
  },
  singerImageContainer: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  },
  singerImage: {
    height: '100%',
    width: '100%',
    borderRadius: 10,

  },
  catText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f2f2f2'
  }

});

export default Search;
