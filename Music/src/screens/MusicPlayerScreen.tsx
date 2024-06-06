import React, { useState, useEffect } from 'react'
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import TrackPlayer, {
  Event,
  Track,
  useTrackPlayerEvents
} from 'react-native-track-player'
import { playListData } from '../constants';
import SongInfo from '../components/home/SongInfo';
import SongSlider from '../components/home/SongSlider';
import ControlCenter from '../components/home/ControlCenter';



const { width } = Dimensions.get('window')

const MusicPlayerScreen = ({ route }) => {
  const { music } = route.params;
  // console.log(music)
  const [track, setTrack] = useState < Track | null > ()

  useEffect(() => {
    getMyTrack()
  }, []);

  const getMyTrack = async () => {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    await TrackPlayer.skip(music.id-1);
    setTrack(trackObject)
  }

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    switch (event.type) {
      case Event.PlaybackTrackChanged:
        const playingTrack = await TrackPlayer.getTrack(event.nextTrack)
        setTrack(playingTrack)
        break;

    }
  })

  const renderArtWork = () => {
    return (
      <View style={styles.listArtWrapper}>
        <View style={styles.albumContainer}>
          {track?.artwork && (
            <Image
              style={styles.albumArtImg}
              source={{ uri: track?.artwork?.toString() }}
            />
          )}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#0A071E', height: '100%' }}>
      <ScrollView>
        <View style={styles.container}>
          {/* <FlatList
        horizontal
        data={playListData}
        renderItem={renderArtWork}
        keyExtractor={song => song.id.toString()}
        /> */}

          <View style={styles.listArtWrapper}>
            <View style={styles.albumContainer}>
              {track?.artwork && (
                <Image
                  style={styles.albumArtImg}
                  source={{ uri: track?.artwork?.toString() }}
                />
              )}
            </View>
          </View>

          <SongInfo track={track} />
          <SongSlider />
          <ControlCenter />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listArtWrapper: {
    width: width,
    marginTop: 80,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumContainer: {
    width: 300,
    height: 300,
  },
  albumArtImg: {
    height: '100%',
    borderRadius: 4,
  },
});


export default MusicPlayerScreen
