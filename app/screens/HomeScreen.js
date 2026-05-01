import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Image, Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    try {
      const stored = await AsyncStorage.getItem('@film_dizi_list');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const renderItem = ({ item }) => {
    let commentDisplay = item.comment || "Yorum yok...";
    if (commentDisplay.length > 100) {
      commentDisplay = commentDisplay.substring(0, 100) + '...';
    }

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { item })}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: item.poster || 'https://via.placeholder.com/150' }} 
          style={styles.poster} 
        />
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.type}>
            {item.type === 'movie' ? 'Film' : 'Dizi'}
            {item.releaseDate ? ` • ${item.releaseDate.substring(0,4)}` : ''}
          </Text>
          {item.leadActor && (
            <Text style={styles.leadActor} numberOfLines={1}>
              <Text style={{fontWeight: 'bold'}}>Başrol:</Text> {item.leadActor}
            </Text>
          )}
          <Text style={styles.comment} numberOfLines={2}>
            "{commentDisplay}"
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz hiç film veya dizi eklemediniz.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('Add')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#18181B',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  poster: {
    width: 100,
    height: 150,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  type: {
    color: '#6366F1',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  leadActor: {
    color: '#D4D4D8',
    fontSize: 13,
    marginTop: 4,
  },
  comment: {
    color: '#A1A1AA',
    fontSize: 13,
    marginTop: 8,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#6366F1',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    color: '#FAFAFA',
    fontSize: 36,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 38,
    marginTop: -2,
  }
});
