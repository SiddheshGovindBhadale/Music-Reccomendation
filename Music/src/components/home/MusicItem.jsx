import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';



const MusicItem = ({ song }) => {
    const navigation = useNavigation();

    const handleMusicPress = (music) => {
        navigation.navigate('MusicPlayerScreen', { music });
    };

    return (
        <TouchableOpacity style={styles.item} onPress={() => handleMusicPress(song)}>
            <View style={styles.left}>
                <Image style={styles.musicImage} source={{ uri: song.artwork?.toString() }} />
            </View>
            <View style={styles.right}>
                <Text style={styles.musicName}>{song.title}</Text>
                <Text style={styles.musicArtist}>{song.artist}</Text>
                <Text style={styles.musicViews}>114k / steams</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 15,
        // borderWidth: 1,
        // borderColor: 'red'
    },
    left: {
        width: 90,
        height: 90,
        overflow: 'hidden',
        borderRadius: 10,
        marginRight: 20
    },
    musicImage: {
        width: '100%',
        height: '100%'
    },
    musicName: {
        fontSize: 16,
        fontWeight: '400',
        color: '#F2F2F2',
        marginBottom: 3,
        textAlign: 'left'
    },
    musicArtist: {
        fontSize: 12,
        fontWeight: '400',
        color: '#DEDEDE',
        marginBottom: 1
    },
    musicViews: {
        fontSize: 12,
        fontWeight: '400',
        color: '#DEDEDE'
    },
})

export default MusicItem