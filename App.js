import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const API_KEY = "8f2460223f354aff511772d0cda8e4ba";

const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
  Atmosphere: 'cloudy-gusts',
  Snow: 'snow',
  Rain: 'rains',
  Drizzle: 'rain',
  Thunderstorm: 'lightning'
}


export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState(null);
  const [ok, setOk] = useState(true); 

  const getWeather = async() => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if(!granted) {
        setOk(false)
      }

      const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5})
      const location = await Location.reverseGeocodeAsync(
        {latitude, longitude},
        {useGoogleMaps: false}
      )
      setCity(location[0].city)

      // const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`)
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
      const json = await response.json();    
      // console.log('json2', json)
      setDays(json)
      // setDays(null)
  } 


  useEffect(() => {
    getWeather();
  }, [])


  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}> {city} </Text>
      </View>

      <ScrollView 
        pagingEnabled
        horizontal 
        showsHorizontalScrollIndicator={false}
        // indicatorStyle="white"
        contentContainerStyle={styles.weather}
      >
        {days===null
            ? 
            <View style={{...styles.day, alignItems:'center'}}>
              <ActivityIndicator color="white" size="large" style={{marginTop: 10}}/>
            </View>
            : 
            <View style={styles.day}>
              <View 
                style={{flexDirection:'row', 
                  alignItems:'center', 
                  justifyContent:'space-between',
                  width:'100%'
                }}
              >
                <Text style={styles.temp}>{parseFloat(days.main.temp).toFixed(1)}</Text>
                <Fontisto name={icons[days.weather[0].main]} size={68} color="black" />
              </View>

              <Text style={styles.description}>{days.weather[0].main}</Text>
              <Text style={styles.tinyText}>{days.weather[0].description}</Text>
            </View>
        }
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'left',
  },
  weather: {
    // backgroundColor: 'teal'
  },
  cityName: {
    fontSize: 42,
    fontWeight: '500',
  },
  day: {
    width: windowWidth,
    alignItems: 'left',
    // justifyContent: 'center',
    // backgroundColor: 'blue'
  },
  temp: {
    marginTop: 50,
    fontSize: 140,
  },
  description: {
    marginTop: -30,
    fontSize: 40,
  },
  tinyText: {
    fontSize: 20
  }
});
