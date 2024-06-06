import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import Home from '../screens/Home';
import Menu from '../screens/Menu';
import Search from '../screens/Search';
import MusicPlayer from '../screens/MusicPlayer';
import { setupPlayer, addTrack } from "../../musicPlayerServices"
import { ActivityIndicator, SafeAreaView } from 'react-native';
import LatestSongs from '../screens/LatestSongs';

const BottomNav = () => {
    const [isPlayerReady, setIsPaylerReady] = useState(false)

    async function setup() {
        let isSetup = await setupPlayer()

        if (isSetup) {
            await addTrack()
        }

        setIsPaylerReady(isSetup)
    }

    useEffect(() => {
        setup()
    }, [])

    if (!isPlayerReady) {
        return (
            <SafeAreaView>
                <ActivityIndicator />
            </SafeAreaView>
        )
    }

    const Tab = createBottomTabNavigator();

    const screenOptions = () => ({
        tabBarStyle: [
            {
                display: 'flex',
                paddingTop: 5,
                paddingBottom: 5,
                borderTopWidth: 0,
                height: 55,
                paddingHorizontal: 5,
                backgroundColor: '#0A091E'
            },
            null,
        ],
        tabBarShowLabel: false,
        tabBarInactiveTintColor: '#8E8E8E',
        tabBarActiveTintColor: '#6156E2',
    });

    return (
        <Tab.Navigator
            screenOptions={screenOptions}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ size, color }) => (
                        <AntDesign name='home' size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ size, color }) => (
                        <AntDesign name='search1' size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="LatestSongs"
                component={LatestSongs}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ size, color }) => (
                        <Feather name='music' size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Menu"
                component={Menu}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ size, color }) => (
                        <AntDesign name='user' size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomNav;