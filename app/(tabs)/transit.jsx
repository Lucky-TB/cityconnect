import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const Transit = () => {
  const [location, setLocation] = useState(null);
  const [transitStops, setTransitStops] = useState([]);
  const [cityName, setCityName] = useState("");
  const [mapRegion, setMapRegion] = useState(null);
  const [suggestedCities, setSuggestedCities] = useState([]);

  // Extensive list of transit stops in Toronto
  const cityData = {
    Toronto: {
      coordinates: { latitude: 43.65107, longitude: -79.347015 },
      stops: [
        { id: "1", name: "Union Station", latitude: 43.6435, longitude: -79.3792 },
        { id: "2", name: "Bloor-Yonge Station", latitude: 43.6702, longitude: -79.3853 },
        { id: "3", name: "St. George Station", latitude: 43.6629, longitude: -79.3952 },
        { id: "4", name: "King Station", latitude: 43.6463, longitude: -79.3813 },
        { id: "5", name: "Dundas Station", latitude: 43.6544, longitude: -79.3804 },
        { id: "6", name: "Queen Station", latitude: 43.6500, longitude: -79.3800 },
        { id: "7", name: "Ossington Station", latitude: 43.6556, longitude: -79.4306 },
        { id: "8", name: "Spadina Station", latitude: 43.6702, longitude: -79.4013 },
        { id: "9", name: "Sheppard-Yonge Station", latitude: 43.7574, longitude: -79.4145 },
        { id: "10", name: "Kipling Station", latitude: 43.6050, longitude: -79.5780 },
        { id: "11", name: "Yorkdale Station", latitude: 43.7150, longitude: -79.4272 },
        { id: "12", name: "Bathurst Station", latitude: 43.6624, longitude: -79.4142 },
        { id: "13", name: "Islington Station", latitude: 43.6344, longitude: -79.5277 },
        { id: "14", name: "Pape Station", latitude: 43.6943, longitude: -79.3574 },
        { id: "15", name: "East York Town Centre", latitude: 43.7035, longitude: -79.3235 },
        { id: "16", name: "Fairview Mall", latitude: 43.7696, longitude: -79.3392 },
        { id: "17", name: "Scarborough Centre", latitude: 43.7740, longitude: -79.2634 },
        { id: "18", name: "Davisville Station", latitude: 43.7126, longitude: -79.3866 },
        { id: "19", name: "Lawrence Station", latitude: 43.7271, longitude: -79.3845 },
        { id: "20", name: "Eglinton Station", latitude: 43.7131, longitude: -79.3976 },
        { id: "21", name: "Dufferin Station", latitude: 43.6526, longitude: -79.4303 },
        { id: "22", name: "Victoria Park Station", latitude: 43.7046, longitude: -79.2931 },
        { id: "23", name: "Warden Station", latitude: 43.7047, longitude: -79.2830 },
        { id: "24", name: "Kennedy Station", latitude: 43.7675, longitude: -79.2614 },
        { id: "25", name: "Finch Station", latitude: 43.7634, longitude: -79.4167 },
        { id: "26", name: "Coxwell Station", latitude: 43.6782, longitude: -79.3205 },
        { id: "27", name: "Keele Station", latitude: 43.6681, longitude: -79.4617 },
        { id: "28", name: "Jane Station", latitude: 43.6339, longitude: -79.5052 },
        { id: "29", name: "Runnymede Station", latitude: 43.6461, longitude: -79.4875 },
        { id: "30", name: "High Park Station", latitude: 43.6541, longitude: -79.4654 },
        // Add more stops as needed
      ],
    },
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setMapRegion(userLocation.coords); // Default to user's location
    };

    getLocation();
  }, []);

  const handleCityInput = (input) => {
    setCityName(input);
    const filteredCities = Object.keys(cityData).filter((city) =>
      city.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestedCities(filteredCities);
  };

  const handleCitySelect = (city) => {
    setCityName(city);
    setSuggestedCities([]); // Clear suggestions after selection
    const { coordinates, stops } = cityData[city];
    setMapRegion(coordinates); // Set map region to the selected city
    setTransitStops(stops); // Set real transit stops for the selected city
  };

  return (
    <View className="flex-1 bg-gray-100">
      {mapRegion ? (
        <MapView
          className="flex-1"
          region={{
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        >
          {transitStops.map((stop) => (
            <Marker
              key={stop.id}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              title={stop.name}
              description={`Nearby transit stop: ${stop.name}`}
              pinColor="#1e90ff" // Color for the markers
            />
          ))}
        </MapView>
      ) : (
        <Text className="text-center text-xl text-gray-700 mt-20">Loading map...</Text>
      )}
      <View className="absolute top-10 left-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg mt-4">
        <Text className="text-lg font-bold text-gray-800">Transit Tracker</Text>
        <TextInput
          placeholder="Type city name"
          value={cityName}
          onChangeText={handleCityInput}
          className="border border-gray-300 rounded p-3 mb-2 bg-gray-50"
        />
        {suggestedCities.length > 0 && (
          <FlatList
            data={suggestedCities}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCitySelect(item)} className="p-2 hover:bg-gray-200 rounded">
                <Text className="text-gray-700">{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            style={{ maxHeight: 150, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}
          />
        )}
        <Text className="text-gray-600 mt-2">Real-time transit updates for {cityName}.</Text>
      </View>
    </View>
  );
};

export default Transit;
