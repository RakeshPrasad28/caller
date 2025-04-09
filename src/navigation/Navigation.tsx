import React, {FC} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './NavigationUtils';
import Logs from '../components/Logs';
import Splash from '../components/Splash';
import Settings from '../components/Settings';

const Stack = createStackNavigator();

const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Splash'>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Logs" component={Logs} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
