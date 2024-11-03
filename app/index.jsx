import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View, Dimensions } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#161622' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }} scrollEnabled={ false }>
        <View style={{ width: '100%', alignItems: 'center', minHeight: screenHeight * 0.95 }}>

          <View style={{ marginTop: 95 }}>
              <Text className="text-3xl font-psemibold" style={{ color: '#90EE90' }}>CityConnect</Text>
          </View>

          <Image 
            source={images.cards}
            style={{ width: screenWidth * 0.90, height: screenHeight * 0.37, marginTop: 20 }} // Increased size
            resizeMode="contain"
          />

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: screenHeight * 0.03, color: 'white', fontWeight: 'bold', textAlign: 'center', lineHeight: 30 }}>
              Enhance Sustainable Urban Living with {' '}
              <Text style={{ color: '#90EE90' }}>CityConnect</Text>
            </Text>
          </View>

          <Text style={{ fontSize: screenHeight * 0.018, color: '#D3D3D3', textAlign: 'center', marginTop: 25, lineHeight: screenHeight * 0.025 }}>
            Where Community Meets Innovation: Discover Boundless Possibilities with CityConnect
          </Text>

        
          <CustomButton 
            title="Continue to Home"
            handlePress={() => router.push('/home')}
            containerStyles={{ width: screenWidth * 0.70, height: 40, marginTop: 42 }} // Increased marginTop for spacing
          />
        </View>
      </ScrollView>
      
      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  );
}