import { ActivityIndicator, SafeAreaView, ScrollView, TextInput, TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import MusicItem from '../components/home/MusicItem'
import { playListData } from '../constants'
import Ionicons from 'react-native-vector-icons/Ionicons'


const LatestSongs = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [musicData, setMusicData] = useState([]);
    const [filteredMusic, setFilteredMusic] = useState([]);

    useEffect(() => {
        // setMusicData(playListData)
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);
    })

    const renderItem = ({ item }) => (
        <MusicItem song={item} />
    );

    useEffect(() => {
        handleSearch();
    }, [searchText]);

    // handle search 
    const handleSearch = () => {
        if (searchText === '') {
            setFilteredMusic(playListData)
        } else {
            const keywords = searchText.toLowerCase().split(' ');
            const filtered = playListData.filter((music) => {
                return keywords.every(keyword => {
                    return music.title.toLowerCase().includes(keyword) ||
                        music.artist.toLowerCase().includes(keyword) ||
                        music.album.toLowerCase().includes(keyword) ||
                        music.lang.toLowerCase().includes(keyword) ||
                        music.emotion.some((e) => e.toLowerCase().includes(keyword));
                });
            });

            // const filteredData = musicData.filter(item =>
            //     item.some(val => val && val.toString().toLowerCase().includes(searchText.toLowerCase()))
            // );
            setFilteredMusic(filtered);
        }
    };

    const clearSearch = () => {
        setSearchText('');
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#0A071E', height: '100%' }}>
            {isLoading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#6156E2" />
            ) : (
                <>
                    <View style={styles.mainContainer}>
                        {/* top bar */}
                        <View style={styles.topStatusBar}>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={22} color="#ffffff" />
                            </TouchableOpacity>
                            <Text style={styles.heading}>Latest Songs</Text>
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

                        {/* list loading */}
                        {filteredMusic.length > 0 ? (
                            <FlatList
                                data={filteredMusic}
                                renderItem={renderItem}
                                keyExtractor={item => item.id.toString()}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : (
                            <Text style={{ color: '#ffffff', textAlign: 'center' }}>No Any Music Found For Search Result : {searchText}</Text>
                        )}
                        {/* <MusicItem song={playListData[0]} /> */}
                    </View>
                </>
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
    topStatusBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        gap: 5,
        // paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#0A071E',
        // marginBottom: 5
    },
    backButton: {
        // borderWidth:1,
        paddingVertical: 10,
        paddingRight: 10
    },
    heading: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600'
    },

    // serach 
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
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

})

export default LatestSongs
