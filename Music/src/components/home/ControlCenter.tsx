import React, {useState, useEffect} from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player'


import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import { playbackService } from '../../../musicPlayerServices'

const ControlCenter = () => {
  const [state, setState] = useState('');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const firstState = await TrackPlayer.getState();
  //       setState(firstState);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       // Handle errors appropriately, e.g., show a user-friendly message
  //     }
  //   };

  //   fetchData();
  // }, []);

    const playBackState = usePlaybackState()
    // next button
    const skipToNext = async () => {
        await TrackPlayer.skipToNext()
    }
    // Previous button
    const skipToPrevious = async () => {
        await TrackPlayer.skipToPrevious()
    }

    const togglePlayback = async (playback: State) => {
        const  currentTrack = await TrackPlayer.getCurrentTrack()
        const playerState = await TrackPlayer.getState();
        setState(playerState)

        if (currentTrack !== null) {
            if (playerState === State.Paused || playerState === State.Ready || playerState === State.Buffering || playerState === State.Connecting) {
                await TrackPlayer.play()
            } else {
                await TrackPlayer.pause()
            }
        }
    }

  return (
    <View style={styles.container}>
        <Pressable onPress={skipToPrevious}>
            <Icon style={styles.icon} name="skip-previous" size={40} />
        </Pressable>
        <Pressable onPress={() => togglePlayback(playBackState)}>
            <Icon 
            style={styles.icon} 
            name={state === '' ? "play-arrow" : state === State.Playing ? "play-arrow" : "pause"} 
            size={75} />
        </Pressable>
        <Pressable onPress={skipToNext}>
            <Icon style={styles.icon} name="skip-next" size={40} />
        </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      marginBottom: 56,
  
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      color: '#FFFFFF',
    },
    playButton: {
      marginHorizontal: 24,
    },
  });

export default ControlCenter