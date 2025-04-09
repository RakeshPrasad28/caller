import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Text, View, StyleSheet, Alert, BackHandler } from 'react-native';
import { navigate } from '../navigation/NavigationUtils';
import { RFValue } from 'react-native-responsive-fontsize';

const Splash = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermissions = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    );
    console.log(granted, 'granted');
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission granted');
      setPermissionGranted(true); 
    } else if (granted === 'denied' || granted === "never_ask_again") {
      Alert.alert('We need permission to access the call logs', '', [
        {
          text: 'NO',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
        {
          text: 'GIVE ACCESS',
          onPress: async () => {
            await requestPermissions(); 
          },
        },
      ]);
      console.log('Permission denied');
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (permissionGranted) {
      navigate('Logs');
    }
  }, [permissionGranted]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Caller</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: RFValue(24),
    color: '#000',
    fontWeight: '700',
  },
});

export default Splash;
