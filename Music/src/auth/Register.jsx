import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet, SafeAreaView, ScrollView, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail, validatePassword } from '../utils/utils';
import Config from 'react-native-config';


const API_BASE_URL = 'https://digital-wellbing-api.onrender.com';
// const API_BASE_URL = 'http://192.168.32.140:5000'; 

const Register = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const showToast = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    };

    const handleRegister = async () => {
        if (!name || !validateEmail(email) || !validatePassword(password) || password !== confirmPassword) {
            showToast('Invalid Input, Please enter valid details.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${Config.API_URL}/register`, {
                name,
                email,
                password,
            });

            if (response && response.data) {
                const { userData } = response.data;
                showToast('Registration Succesfull!');
                setLoading(false);
                navigation.navigate('Login');
            } else {
                setLoading(false);
                showToast('Registration Failed', 'Invalid response from the server');
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            showToast('Registration Failed', error.response ? error.response.data.message : 'An error occurred');
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#0A071E', height: '100%' }}>
            <ScrollView>
                <View style={styles.mainContainer}>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require('../assets/icon/music.png')} />
                    </View>
                    <View style={styles.bottom_section}>
                        <View style={styles.form}>
                            <View style={styles.input_section}>
                                {/* <Text style={styles.text}>Name</Text> */}
                                <TextInput
                                    style={styles.input}
                                    placeholder='Enter your name'
                                    placeholderTextColor={"#F2F2F2"}
                                    value={name}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={setName}
                                />
                            </View>

                            <View style={styles.input_section}>
                                {/* <Text style={styles.text}>Email</Text> */}
                                <TextInput
                                    style={styles.input}
                                    placeholder='Enter your email'
                                    placeholderTextColor={"#F2F2F2"}
                                    value={email}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={styles.input_section}>
                                {/* <Text style={styles.text}>Password</Text> */}
                                <TextInput
                                    style={styles.input}
                                    placeholder='Create password'
                                    placeholderTextColor={"#F2F2F2"}
                                    value={password}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.input_section}>
                                {/* <Text style={styles.text}>Confirm Password</Text> */}
                                <TextInput
                                    style={styles.input}
                                    placeholder='Re-enter password'
                                    placeholderTextColor={"#F2F2F2"}
                                    value={confirmPassword}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>


                            <View style={styles.button_wrapper}>
                                {loading ? (
                                    <ActivityIndicator size="large" color="#6156F2" />
                                ) : (
                                    <TouchableOpacity style={styles.button} onPress={handleRegister} >
                                        <Text style={styles.button_text}>Sign Up</Text>
                                    </TouchableOpacity>
                                )}

                                <Text style={styles.other_text}>Or continue with</Text>
                                <View style={styles.other_button}>
                                    <TouchableOpacity style={styles.icon_button} >
                                        <Image style={styles.icon} source={require('../assets/icon/google.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.icon_button}>
                                        <Image style={styles.icon} source={require('../assets/icon/facebook.png')} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.change_page}>
                                    <Text style={[styles.text, { color: '#828282' }]}>Already have an account? </Text>
                                    <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Login')} >
                                        <Text style={styles.button_text2}>Sign in</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
    },
    logoContainer: {
        width: 250,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 50,
        alignSelf: 'center'
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    heading: {
        color: '#1E293B',
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 60,
    },
    bottom_section: {
        paddingHorizontal: 31
    },
    input_section: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100',
    },
    text: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 1,
    },
    input: {
        borderWidth: 1,
        color: '#F2F2F2',
        borderRadius: 7,
        paddingHorizontal: 15,
        backgroundColor: '#444444',
        width: '100%',
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 10
    },
    forgetButton: {
        marginBottom: 10,
        width: '100%'
    },
    forgetButtonText: {
        textAlign: 'right',
        color: '#6156F2'
    },
    button_wrapper: {
        marginTop: 5
    },
    button: {
        borderRadius: 7,
        marginTop: -3,
        backgroundColor: '#6156F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginBottom: 10,
        marginTop: 5
    },
    button_text: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    change_page: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    text2: {
        color: '#828282',
    },
    button_text2: {
        color: '#6156F2',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    other_text: {
        color: '#828282',
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 12,
    },
    other_button: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        gap: 30,
        marginBottom: 20,
        marginTop: 10
    },
    icon_button: {
        width: 55,
        height: 55,
        borderWidth: 1,
        borderColor: '#444444',
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    icon_button_text: {
        color: '#6156F2',
        fontSize: 14,
        fontWeight: '400'
    }
});

export default Register;
