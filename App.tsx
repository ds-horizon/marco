import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar, StyleSheet } from 'react-native';
import { RefAsProps } from './scenarios/RefAsProps';

const examples = [
  {
    title: 'RefAsProps',
    key: 'ref_as_props',
    description: 'Testing ref as props',
    component: <RefAsProps />, // Use React Node instead of function call
  },
  // Add other scenarios here
];

function App(): React.JSX.Element {
  const [scenario, setScenario] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar />
      {scenario !== null ? (
        <View style={styles.detailsContainer}>
          <Pressable style={styles.backButton} onPress={() => setScenario(null)}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>
          {examples.find((item) => item.key === scenario)?.component}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {examples.map((item) => (
            <Pressable key={item.key} style={styles.card} onPress={() => setScenario(item.key)}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  detailsContainer: { flex: 1, padding: 16 },
  scrollContainer: { paddingVertical: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  description: { fontSize: 14, color: '#666', marginTop: 4 },
  backButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignSelf: 'flex-start', // Moves the button to the left
  },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default App;
