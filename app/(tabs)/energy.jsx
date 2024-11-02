// energy.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Share } from 'react-native';
const tipsData = [
  // Heating Tips
  { id: '1', category: 'Heating', tip: 'Lower your thermostat by 1 degree to save energy.' },
  { id: '2', category: 'Heating', tip: 'Insulate your walls and attic to keep heat in.' },
  { id: '3', category: 'Heating', tip: 'Close off rooms you don’t use to conserve heat.' },
  { id: '4', category: 'Heating', tip: 'Use curtains to keep your home warm and reduce heating needs.' },
  { id: '5', category: 'Heating', tip: 'Use draft stoppers under doors to prevent heat loss.' },
  { id: '6', category: 'Heating', tip: 'Wear warm clothing instead of raising the thermostat.' },
  { id: '7', category: 'Heating', tip: 'Open curtains during the day to let in sunlight for warmth.' },
  { id: '8', category: 'Heating', tip: 'Lower heating settings when you’re asleep or away.' },
  { id: '9', category: 'Heating', tip: 'Use a programmable thermostat to optimize heating.' },
  { id: '10', category: 'Heating', tip: 'Seal gaps in windows to keep warm air from escaping.' },
  { id: '11', category: 'Heating', tip: 'Turn off heating when you leave the house.' },
  { id: '12', category: 'Heating', tip: 'Use area rugs to help insulate floors.' },
  { id: '13', category: 'Heating', tip: 'Utilize ceiling fans to circulate warm air effectively.' },
  { id: '14', category: 'Heating', tip: 'Set your water heater to a lower temperature to save energy.' },
  { id: '15', category: 'Heating', tip: 'Block chimney drafts when not in use.' },
  { id: '16', category: 'Heating', tip: 'Consider replacing old heating systems with high-efficiency models.' },
  { id: '17', category: 'Heating', tip: 'Ensure vents and radiators are clear for optimal airflow.' },
  { id: '18', category: 'Heating', tip: 'Install a smart thermostat for better energy management.' },
  { id: '19', category: 'Heating', tip: 'Use thermal curtains to reduce heat loss at night.' },
  { id: '20', category: 'Heating', tip: 'Regularly maintain your heating system for optimal performance.' },

  // Water Tips
  { id: '21', category: 'Water', tip: 'Take shorter showers to save water and heating costs.' },
  { id: '22', category: 'Water', tip: 'Fix any leaks to prevent water waste and reduce your bill.' },
  { id: '23', category: 'Water', tip: 'Turn off the tap while brushing your teeth.' },
  { id: '24', category: 'Water', tip: 'Install a low-flow showerhead to save water.' },
  { id: '25', category: 'Water', tip: 'Collect rainwater for outdoor use in a rain barrel.' },
  { id: '26', category: 'Water', tip: 'Water your garden in the morning to reduce evaporation.' },
  { id: '27', category: 'Water', tip: 'Run dishwashers and washing machines only when full.' },
  { id: '28', category: 'Water', tip: 'Use a broom instead of a hose to clean driveways and sidewalks.' },
  { id: '29', category: 'Water', tip: 'Install faucet aerators to reduce water flow without compromising pressure.' },
  { id: '30', category: 'Water', tip: 'Limit laundry to full loads to save water and energy.' },
  { id: '31', category: 'Water', tip: 'Use mulch in gardens to retain moisture and reduce watering needs.' },
  { id: '32', category: 'Water', tip: 'Store drinking water in the fridge to avoid running the tap.' },
  { id: '33', category: 'Water', tip: 'Check your water meter regularly for any signs of hidden leaks.' },
  { id: '34', category: 'Water', tip: 'Reuse cooking water for watering plants once cooled.' },
  { id: '35', category: 'Water', tip: 'Avoid using garbage disposals, which consume a lot of water.' },
  { id: '36', category: 'Water', tip: 'Take advantage of the dry season by planting drought-resistant plants.' },
  { id: '37', category: 'Water', tip: 'Use a shower timer to monitor and reduce your shower duration.' },
  { id: '38', category: 'Water', tip: 'Wash your car with a bucket instead of using a hose.' },
  { id: '39', category: 'Water', tip: 'Place a bottle in toilet tanks to reduce the water per flush.' },
  { id: '40', category: 'Water', tip: 'Switch to drip irrigation for more efficient garden watering.' },

  // Lighting Tips
  { id: '41', category: 'Lighting', tip: 'Switch to LED bulbs to significantly reduce energy consumption.' },
  { id: '42', category: 'Lighting', tip: 'Turn off lights when you leave a room to save electricity.' },
  { id: '43', category: 'Lighting', tip: 'Use motion sensors for outdoor lighting to save energy.' },
  { id: '44', category: 'Lighting', tip: 'Install dimmer switches to control light levels and save energy.' },
  { id: '45', category: 'Lighting', tip: 'Maximize natural light during the day instead of using artificial lighting.' },
  { id: '46', category: 'Lighting', tip: 'Choose light-colored walls and furnishings to reflect light better.' },
  { id: '47', category: 'Lighting', tip: 'Utilize task lighting in areas where you need concentrated light.' },
  { id: '48', category: 'Lighting', tip: 'Regularly clean your light fixtures to ensure maximum brightness.' },
  { id: '49', category: 'Lighting', tip: 'Use timers to control outdoor lighting schedules effectively.' },
  { id: '50', category: 'Lighting', tip: 'Unplug decorative lights and devices when they’re not in use.' },
  { id: '51', category: 'Lighting', tip: 'Place lamps in corners to enhance overall light distribution.' },
  { id: '52', category: 'Lighting', tip: 'Install skylights in areas of your home to bring in more natural light.' },
  { id: '53', category: 'Lighting', tip: 'Use solar-powered outdoor lights to reduce your electricity bill.' },
  { id: '54', category: 'Lighting', tip: 'Only turn on lights when needed, and switch them off immediately after use.' },
  { id: '55', category: 'Lighting', tip: 'Consider using light timers for kids’ rooms to ensure lights are off at bedtime.' },
  { id: '56', category: 'Lighting', tip: 'Choose energy-efficient lighting fixtures for both indoors and outdoors.' },
  { id: '57', category: 'Lighting', tip: 'Use lampshades to direct light where it’s needed most.' },
  { id: '58', category: 'Lighting', tip: 'Replace traditional bulbs with energy-saving alternatives where possible.' },
  { id: '59', category: 'Lighting', tip: 'Limit the use of overhead lighting in favor of table and floor lamps.' },
  { id: '60', category: 'Lighting', tip: 'Utilize light-reflecting materials in decor to brighten spaces.' },
];

const Energy = () => {
  const [dailyTip, setDailyTip] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const randomTip = tipsData[Math.floor(Math.random() * tipsData.length)];
    setDailyTip(randomTip);
  }, []);

  const filterTips = () => {
    return selectedCategory === 'All'
      ? tipsData
      : tipsData.filter(tip => tip.category === selectedCategory);
  };

  const handleShare = async (tip) => {
    try {
      const result = await Share.share({
        message: tip,
      });
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Tip shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };

  const categories = ['All', 'Heating', 'Water', 'Lighting'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Energy-Saving Tip</Text>
      {dailyTip && (
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>{dailyTip.tip}</Text>
          <TouchableOpacity onPress={() => handleShare(dailyTip.tip)} style={styles.shareButton}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.categoryTitle}>Browse Tips by Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory
            ]}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filterTips()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>{item.tip}</Text>
            <TouchableOpacity onPress={() => handleShare(item.tip)} style={styles.shareButton}>
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#161622' },
  title: { fontSize: 24, color: '#90EE90', marginBottom: 16, marginTop: 55, fontWeight: 'bold'},
  tipBox: { padding: 16, backgroundColor: '#232533', borderRadius: 8, marginBottom: 16 },
  tipText: { fontSize: 16, color: '#FFFFFF' },
  shareButton: { marginTop: 10, backgroundColor: '#90EE90', padding: 8, borderRadius: 5 },
  shareText: { color: '#161622', fontWeight: 'bold' },
  categoryTitle: { fontSize: 20, color: '#CDCDE0', marginTop: 20 },
  categoryContainer: { flexDirection: 'row', marginVertical: 16 },
  categoryButton: { padding: 10, marginRight: 10, borderRadius: 5, backgroundColor: '#232533' },
  selectedCategory: { backgroundColor: '#90EE90' },
  categoryText: { color: '#FFFFFF' },
  tipItem: { padding: 16, backgroundColor: '#232533', borderRadius: 8, marginBottom: 10 },
});

export default Energy;