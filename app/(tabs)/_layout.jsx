import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TabIcon = ({ IconComponent, iconName, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2 mt-4">
      <IconComponent
        name={iconName}
        size={24}
        color={color}
        style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
      />
      <Text className={`${focused ? 'font-psemibold pt-1' : 'font-pregular'} text-xs`} style={{ color: color, fontSize: focused ? 15 : 12 }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#90EE90',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#161622',
          borderTopWidth: 1,
          borderTopColor: '#232533',
          height: 84,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={MaterialCommunityIcons}
              iconName="home"
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transit"
        options={{
          title: 'Transit',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={MaterialIcons}
              iconName="directions-transit"
              color={color}
              name="Transit"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="energy"
        options={{
          title: 'Energy',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={MaterialIcons}
              iconName="energy-savings-leaf"
              color={color}
              name="Energy"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="citybuddy"
        options={{
          title: 'CityBuddy',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={MaterialIcons}
              iconName="chat-bubble-outline"
              color={color}
              name="CityBuddy"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
