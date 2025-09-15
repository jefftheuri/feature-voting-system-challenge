import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Card, Title, Paragraph, IconButton, Chip, Text } from 'react-native-paper';
import { featuresAPI } from '../services/api';

const FeatureCard = ({ feature, userVotes, onVote, onRemoveVote }) => {
  const hasVoted = userVotes.has(feature.id);
  const [isVoting, setIsVoting] = useState(false);

  const handleVoteToggle = async () => {
    setIsVoting(true);
    try {
      if (hasVoted) {
        await onRemoveVote(feature.id);
      } else {
        await onVote(feature.id);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card style={[styles.card, hasVoted && styles.votedCard]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Title style={styles.title}>{feature.title}</Title>
            <Chip mode="outlined" style={styles.authorChip}>
              By: {feature.creator}
            </Chip>
          </View>

          <View style={styles.voteContainer}>
            <IconButton
              icon={hasVoted ? "heart" : "heart-outline"}
              iconColor={hasVoted ? "#e91e63" : "#666"}
              size={24}
              onPress={handleVoteToggle}
              disabled={isVoting}
              style={[styles.voteButton, hasVoted && styles.votedButton]}
            />
            <Text style={[styles.voteCount, hasVoted && styles.votedText]}>
              {feature.vote_count}
            </Text>
          </View>
        </View>

        {feature.description && (
          <Paragraph style={styles.description}>{feature.description}</Paragraph>
        )}

        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(feature.created_at).toLocaleDateString()}
          </Text>
          {hasVoted && (
            <Chip icon="check" mode="flat" style={styles.votedChip}>
              Voted
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const FeaturesList = ({ userVotes, onVotesChange }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeatures = async () => {
    try {
      const featuresData = await featuresAPI.getAll();
      setFeatures(featuresData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load features');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadFeatures();
  };

  const handleVote = async (featureId) => {
    await featuresAPI.vote(featureId);
    userVotes.add(featureId);
    onVotesChange(new Set(userVotes));
    await loadFeatures();
  };

  const handleRemoveVote = async (featureId) => {
    await featuresAPI.removeVote(featureId);
    userVotes.delete(featureId);
    onVotesChange(new Set(userVotes));
    await loadFeatures();
  };

  const renderFeature = ({ item }) => (
    <FeatureCard
      feature={item}
      userVotes={userVotes}
      onVote={handleVote}
      onRemoveVote={handleRemoveVote}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={features}
        renderItem={renderFeature}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  votedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#e91e63',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  authorChip: {
    alignSelf: 'flex-start',
    height: 28,
  },
  voteContainer: {
    alignItems: 'center',
  },
  voteButton: {
    margin: 0,
  },
  votedButton: {
    backgroundColor: '#fce4ec',
  },
  voteCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  votedText: {
    color: '#e91e63',
  },
  description: {
    marginBottom: 12,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  votedChip: {
    backgroundColor: '#e8f5e8',
    height: 24,
  },
});

export default FeaturesList;