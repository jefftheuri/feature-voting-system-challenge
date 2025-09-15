import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, StatusBar } from 'react-native';
import { Provider as PaperProvider, Appbar, FAB } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

import LoginScreen from './components/LoginScreen';
import FeaturesList from './components/FeaturesList';
import NewFeatureForm from './components/NewFeatureForm';
import { setSessionCookie, userVotesAPI } from './services/api';

const theme = {
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    onSurface: '#000000',
    disabled: '#9e9e9e',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [userVotes, setUserVotes] = useState(new Set());
  const [showNewFeatureForm, setShowNewFeatureForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserVotes();
    }
  }, [user]);

  const loadStoredUser = async () => {
    try {
      const userId = await SecureStore.getItemAsync('userId');
      const username = await SecureStore.getItemAsync('username');

      if (userId && username) {
        setUser({
          userId: parseInt(userId),
          username: username
        });
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserVotes = async () => {
    try {
      const votes = await userVotesAPI.getUserVotes(user?.userId);
      setUserVotes(votes);
    } catch (error) {
      console.error('Error loading user votes:', error);
      setUserVotes(new Set());
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userId');
      await SecureStore.deleteItemAsync('username');
      setSessionCookie(null);
      setUser(null);
      setUserVotes(new Set());
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleFeatureCreated = () => {
    setShowNewFeatureForm(false);
  };

  const handleVotesChange = (newVotes) => {
    setUserVotes(newVotes);
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  if (!user) {
    return (
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <LoginScreen onLogin={handleLogin} />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.primary} />

      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content
            title="Feature Voting"
            subtitle={`Welcome, ${user.username}!`}
          />
          <Appbar.Action icon="logout" onPress={handleLogout} />
        </Appbar.Header>

        <FeaturesList
          userVotes={userVotes}
          onVotesChange={handleVotesChange}
        />

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => setShowNewFeatureForm(true)}
          label="Add Feature"
        />

        <Modal
          visible={showNewFeatureForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowNewFeatureForm(false)}
        >
          <NewFeatureForm
            onClose={() => setShowNewFeatureForm(false)}
            onFeatureCreated={handleFeatureCreated}
          />
        </Modal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});