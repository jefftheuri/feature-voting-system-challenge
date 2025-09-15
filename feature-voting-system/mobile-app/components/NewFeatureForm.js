import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Card, HelperText } from 'react-native-paper';
import { featuresAPI } from '../services/api';

const NewFeatureForm = ({ onClose, onFeatureCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newFeature = await featuresAPI.create(
        title.trim(),
        description.trim()
      );

      Alert.alert(
        'Success',
        'Feature created successfully!',
        [{ text: 'OK', onPress: () => {
          onFeatureCreated(newFeature);
          onClose();
        }}]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onClose }
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Create New Feature Request</Title>

            <TextInput
              label="Feature Title *"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              disabled={loading}
              error={!!errors.title}
              placeholder="Enter a descriptive title for your feature"
              maxLength={100}
            />
            {errors.title && (
              <HelperText type="error" style={styles.errorText}>
                {errors.title}
              </HelperText>
            )}

            <TextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={6}
              style={[styles.input, styles.descriptionInput]}
              disabled={loading}
              error={!!errors.description}
              placeholder="Provide more details about your feature request..."
              maxLength={500}
            />
            <HelperText type="info" style={styles.helperText}>
              {description.length}/500 characters
            </HelperText>
            {errors.description && (
              <HelperText type="error" style={styles.errorText}>
                {errors.description}
              </HelperText>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                disabled={loading}
                style={[styles.button, styles.cancelButton]}
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading || !title.trim()}
                style={[styles.button, styles.submitButton]}
              >
                Create Feature
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    maxHeight: '90%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  descriptionInput: {
    minHeight: 120,
  },
  helperText: {
    textAlign: 'right',
    marginBottom: 8,
    fontSize: 12,
  },
  errorText: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
  },
  cancelButton: {
    marginRight: 6,
  },
  submitButton: {
    marginLeft: 6,
  },
});

export default NewFeatureForm;