import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { authAPI, setSessionCookie } from '../services/api';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(username.trim());

      await SecureStore.setItemAsync('userId', response.user_id.toString());
      await SecureStore.setItemAsync('username', response.username);

      onLogin({
        userId: response.user_id,
        username: response.username
      });
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Feature Voting System</Title>

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            disabled={loading}
            placeholder="Enter your username"
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading || !username.trim()}
            style={styles.button}
          >
            Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
});

export default LoginScreen;