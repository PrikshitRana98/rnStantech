import { View, Text, AppState, Alert, StyleSheet, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';

import DeviceInfo, { useBatteryLevel, useBatteryLevelIsLow, } from 'react-native-device-info'

const BatteryStatus = () => {
  const batteryLvl = useBatteryLevel();
  const batteryIsLow = useBatteryLevelIsLow();
  const [powerState, setPowerState] = useState({});

  const checkNetworkStatus = async () => {
    try {
      await DeviceInfo.isAirplaneMode().then((airplaneModeOn) => {
        if (airplaneModeOn == true) {
          Alert.alert("Warning", "Please turn off the airplane  ")
          console.log("airplaneModeOn cxfcd of device-->", airplaneModeOn)
        } else {
          console.log("airplaneModeOn of device off-->", airplaneModeOn)
        }

      });
    } catch (err) {
      console.log(err)
    }
  }

  const checkLoctionService = async () => {
    try {
      await DeviceInfo.getAvailableLocationProviders().then((providers) => {
        console.log("checkLoctionService==>", JSON.stringify(providers))
      });
    } catch (err) {
      console.log("location service error", err)
    }
  }



  const checkPowerservice = async () => {
    try {
      await DeviceInfo.getPowerState().then((power) => {
        console.log("pwer ==>", JSON.stringify(power))
        setPowerState({...power})
      });
    } catch (err) {
      console.log("location service error", err)
    }
  }

  

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        
        const powerId=setInterval(()=>{
          checkPowerservice()
        },2000) 
        // checking network and location status status check every 3 minutes
        const intervalId = setInterval(() => {
          checkLoctionService();
          checkNetworkStatus();
        }, 10000);

        return () => {
          clearInterval(powerId);
          clearInterval(intervalId)};
      }
    };

    const listenApp = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      listenApp.remove();
    };
  }, []);


  

return (
  <View>
    <Text style={styles.txt}>Battery Level {batteryLvl ? batteryLvl.toFixed(1) * 100 : 0}%</Text>
    <Text style={{ color: batteryIsLow ? "red" : "green" }}>Battery Info </Text>
    <Text style={styles.txt}>Power Saving Mode : {powerState.lowPowerMode?"ON":"OFF"}</Text>
  </View>
)
}

const styles = StyleSheet.create({
  txt: {
    fontSize: 17,
    color: 'black'
  }
})

export default BatteryStatus