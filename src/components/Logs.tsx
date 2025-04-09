import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Button,
  Platform,
} from 'react-native';
import CallLogs from 'react-native-call-log';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CallRecord} from '../interface';
import {Avatar} from '@rneui/themed';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import {navigate} from '../navigation/NavigationUtils';
import {useDispatch} from 'react-redux';
import {addSyncData} from '../redux/syncDataSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Logs = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [callLog, setCallLog] = useState<CallRecord[]>([]);
  const [filterType, setFilterType] = useState('All');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onFilterSelect = (filter: string) => {
    setFilterType(filter);
    setModalVisible(false);
  };

  const fetchCallLogs = () => {
    setIsFetching(true);
    CallLogs.load(70)
      .then((logs: CallRecord[]) => {
        setCallLog(logs);
        const syncTime = moment().format('YYYY-MM-DD HH:mm:ss');
        dispatch(addSyncData(syncTime, logs));
        setIsLoading(false);
        setIsFetching(false);
      })
      .catch((error: any) => {
        console.log('Error:', error);
        setIsLoading(false);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const getFilteredLogs = () => {
    if (filterType === 'All') return callLog;
    return callLog.filter(log => log.type === filterType);
  };

  const getFormattedDate = (date: Date) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formattedDate = getFormattedDate(new Date());
  const formattedYesterdayDate = getFormattedDate(
    new Date(new Date().setDate(new Date().getDate() - 1)),
  );

  const getLogsByDate = (date: string) => {
    return getFilteredLogs().filter(log => {
      const itemDate = moment(log.dateTime, [
        'DD-MMM-YYYY',
        'MMM DD, YYYY',
      ]).format('DD-MMM-YYYY');
      return itemDate === date;
    });
  };

  const todayLogs = getLogsByDate(formattedDate);
  const yesterdayLogs = getLogsByDate(formattedYesterdayDate);
  const otherLogs = getFilteredLogs().filter(log => {
    const itemDate = moment(log.dateTime, [
      'DD-MMM-YYYY',
      'MMM DD, YYYY',
    ]).format('DD-MMM-YYYY');
    return itemDate !== formattedDate && itemDate !== formattedYesterdayDate;
  });

  const renderItem = ({item}: {item: CallRecord}) => {
    const time = item?.dateTime?.split(' ');
    return (
      <View key={item?.timestamp} style={styles.rowContainer}>
        <View style={styles.iconContainer}>
          {item?.name ? (
            <Avatar
              size={50}
              rounded
              title={item?.name ? item?.name?.split('')[0] : ''}
              containerStyle={{backgroundColor: '#3d4db7'}}
            />
          ) : (
            <Ionicons name="person" color="#3d4db7" size={RFValue(24)} />
          )}
        </View>
        <View>
          {item?.name ? (
            <Text style={{fontSize: RFValue(16)}}>
              {item?.name} ({item?.phoneNumber})
            </Text>
          ) : (
            <Text style={{fontSize: RFValue(16)}}>{item?.phoneNumber}</Text>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Text>
              {item?.type === 'MISSED' ? (
                <MaterialCommunityIcons
                  name="call-missed"
                  size={RFValue(16)}
                  color="red"
                />
              ) : item?.type === 'INCOMING' ? (
                <MaterialCommunityIcons
                  name="phone-incoming"
                  size={RFValue(14)}
                  color="green"
                />
              ) : (
                <MaterialCommunityIcons
                  name="phone-outgoing"
                  size={RFValue(14)}
                  color="blue"
                />
              )}
              <Text style={{color: 'black'}}>India</Text>
            </Text>
            <Text style={{fontSize: RFValue(14)}}>
              {time[1]}
              {time[2]}
            </Text>
            {item?.duration !== 0 && (
              <Text>{formatDuration(item?.duration)}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return hours > 0
      ? `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(
          remainingSeconds,
        )}`
      : `${padNumber(minutes)}:${padNumber(remainingSeconds)}`;
  }

  function padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  const handleRefresh = () => {
    setIsLoading(true);
    fetchCallLogs();
  };

  const handleSettingsPress = () => {
    navigate('Settings');
    setModalVisible(false);
  };

  return (
    <View style={[{paddingTop: Platform.OS === 'ios' ? 0 : insets.top}]}>
      <SafeAreaView />
      <Ionicons
        name="menu"
        size={RFValue(24)}
        color="black"
        style={styles.menuIcon}
        onPress={toggleModal}
      />

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.1}
        style={styles.modal}>
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={styles.modalContent}>
          <Button title="All" onPress={() => onFilterSelect('All')} />
          <Button title="Incoming" onPress={() => onFilterSelect('INCOMING')} />
          <Button title="Outgoing" onPress={() => onFilterSelect('OUTGOING')} />
          <Button title="Missed" onPress={() => onFilterSelect('MISSED')} />
          <Button title="Settings" onPress={handleSettingsPress} />
        </Animatable.View>
      </Modal>

      <View>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={[
              todayLogs.length > 0 && {title: 'Today', data: todayLogs},
              yesterdayLogs.length > 0 && {
                title: 'Yesterday',
                data: yesterdayLogs,
              },
              otherLogs.length > 0 && {title: 'Other Logs', data: otherLogs},
            ].filter(Boolean)}
            renderItem={({item}) => (
              <View>
                {item && 'title' in item && (
                  <Text style={styles.sectionTitle}>{item.title}</Text>
                )}
                {item && 'data' in item && item.data.length > 0 && (
                  <FlatList
                    data={item.data}
                    renderItem={renderItem}
                    keyExtractor={(log, index) => index.toString()}
                  />
                )}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={handleRefresh}
            refreshing={isFetching}
            ListFooterComponent={
              isFetching ? <ActivityIndicator size="small" /> : null
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: '600',
    fontSize: RFValue(16),
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: '#3d4db7',
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    position: 'relative',
    alignSelf: 'flex-end',
    zIndex: 1,
    marginHorizontal: 5,
  },
  modal: {
    justifyContent: 'flex-start',
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'absolute',
    top: -10,
    right: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Logs;
