import { View, Text, Button, PermissionsAndroid, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import BatteryStatus from './BatteryStatus';


const img = require('./Assests/arrow.png')


const MapScreen = () => {
    const mapRef = useRef(null);
    const searchRef = useRef(null);

    // const destination = { latitude: 28.4196475, longitude: 77.2146438 };
    const [initialLoc, setInitialloc] = useState(
        {
            latitude: 28.693602,
            longitude: 77.2146438,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
    )
    const [userLoc, setUserLoc] = useState({
        latitude: 28.693602,
        longitude: 77.2146438,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    })
    const [coordinates, setCoordinates] = useState([]);
    const [destination, setdestination] = useState({
        latitude: 28.49161,
        longitude: 77.01109,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    })

    const onRegionCHange = (x) => {
        console.log("region log00>", x);
    }

    const getLocation = async () => {
        Geolocation.getCurrentPosition(
            (location) => {
                console.log("my current location-->", location.coords);
                setUserLoc({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                })

                //saving cordination to pot polyline 
                setCoordinates([
                    { latitude: location.coords.latitude + 0.05, longitude: location.coords.longitude + 0.05 },
                    { latitude: location.coords.latitude + 0.02, longitude: location.coords.longitude - 0.071 },
                    { latitude: location.coords.latitude - 0.031, longitude: location.coords.longitude - 0.02 },
                    { latitude: location.coords.latitude - 0.021, longitude: location.coords.longitude + 0.021 },
                    { latitude: location.coords.latitude + 0.03, longitude: location.coords.longitude + 0.01 }
                ]);
            },
            (error) => {
                // See error code charts below.

                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Cool Photo App Location Permission',
                    message:
                        ' App needs access to your location ' +
                        '',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the location');
                getLocation()
            } else {
                console.log('Location permission denied');

            }
        } catch (err) {

            console.warn(err);
        }
    };

    useEffect(() => {
        //calling the permission
        requestLocationPermission()
    }, [])

    const onPressAddress = details => {
        console.log("details", details)
    };
    return (
        <View style={{ flex: 1 }}>

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialLoc}
                region={{
                    latitude: userLoc.latitude,
                    longitude: userLoc.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
                scrollEnabled={true}
                zoomEnabled={true}
                mapType={'standard'}
                rotateEnabled={true}
                loadingEnabled={true}
                showsCompass={true}
                onRegionChange={onRegionCHange}
                onPress={x => console.log('x==>', x)}

            >
                <Marker
                    coordinate={{ latitude: userLoc.latitude, longitude: userLoc.longitude }}
                    title={"User Location"}
                />


                {destination && (
                    <>
                        <Marker coordinate={{ latitude: destination.latitude, longitude: destination.longitude }} title='Destination' pinColor="blue" />
                        <MapViewDirections
                            origin={{ latitude: userLoc.latitude, longitude: userLoc.longitude }}
                            destination={{ latitude: destination.latitude, longitude: destination.longitude }}
                            apikey={"AIzaSyD3OB18d519XPRpnpUG3Qwg1KR-Wem7h98"}
                            language='en'
                            strokeWidth={4}
                            strokeColor="black"
                            onStart={(params) => {
                                console.log(`Started routing between "${params.origin}" and "${params.destination}"${(params.waypoints.length ? " using waypoints: " + params.waypoints.join(', ') : "")}`);
                            }}
                            onReady={e => console.log("on ready", e.coordinates.length)}
                            onError={(errorMessage) => {
                                console.log(errorMessage);
                            }}
                            resetOnChange={false}
                        />
                    </>
                )}
                {coordinates && (
                    <>
                        <Polyline coordinates={coordinates} strokeWidth={3} strokeColor="blue" />
                        {coordinates != undefined && coordinates.map((ele, i) => {
                            return (
                                <Marker key={i} coordinate={{ latitude: ele.latitude, longitude: ele.longitude }} pinColor="green" />)
                        })}
                    </>
                )}

            </MapView>


            {/* <TouchableOpacity style={{
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                left: 10,
                right: 10,
                bottom: 10,
                backgroundColor: "red",
            }}
                onPress={getLocation}
            >
                <Text>Location</Text>
            </TouchableOpacity> */}

            <View style={{
                height: 140,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                padding:16,
                left: 1,
                right: 1,
                bottom: 5,
                backgroundColor: "white",}}>
               <BatteryStatus/> 
               
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",

        backgroundColor: "green",
        // height: Dimensions.get('window').height,
        // width: Dimensions.get('window').width,
    },
    map: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    searchContainer: {
        zIndex: 1,
        flex: 0.5,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    markerImage: {
        width: 35,
        height: 35
    }
});

export default MapScreen