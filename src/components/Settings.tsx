import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import React, {FC, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {goBack} from '../navigation/NavigationUtils';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/rootReducer';
import Collapsible from 'react-native-collapsible';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Settings: FC = () => {
  const insets = useSafeAreaInsets();
  const syncLogs = useSelector((state: RootState) => state.syncData.syncLogs);
  const [openSyncTime, setOpenSyncTime] = useState<string | null>(null);

  const toggleAccordion = (syncTime: string) => {
    setOpenSyncTime(openSyncTime === syncTime ? null : syncTime);
  };
  return (
    <View style={[styles.container,{paddingTop:Platform.OS==="ios"?0:insets.top}]}>
      <View style={styles.iconContainer}>
        <Pressable onPress={() => goBack()}>
          <Ionicons name="arrow-back" color="#000" size={RFValue(24)} />
        </Pressable>
        <Text style={styles.settingText}>Settings</Text>
      </View>
      <FlatList
        data={syncLogs}
        renderItem={({item}) => (
          <View style={styles.syncItem}>
            <Text
              style={styles.syncTime}
              onPress={() => toggleAccordion(item.time)}>
              Sync Time: {item.time}
            </Text>

            <Collapsible collapsed={openSyncTime !== item.time}>
              <View style={styles.jsonContainer}>
                <Text style={styles.jsonText}>
                  {JSON.stringify(item.data, null, 2)}
                </Text>
              </View>
            </Collapsible>
          </View>
        )}
        keyExtractor={item => item.time}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingText: {fontSize: RFValue(20), fontWeight: '700'},
  syncItem: {
    marginBottom: 15,
  },
  syncTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  jsonContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
});

export default Settings;
