import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🌱 Flovey</Text>
        <Text style={styles.subtitle}>Parent-Child Money Learning App</Text>
        <Text style={styles.status}>MVP Ready - Service Layer Complete</Text>
        <Text style={styles.version}>v0.1.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  version: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 20,
  },
});
