import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Image, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AddScreen({ navigation }) {
  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Manual / Comments fields
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [type, setType] = useState('movie');
  const [comment, setComment] = useState('');

  const searchTMDB = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&language=tr-TR`
      );

      const filtered = response.data.results.filter(
        item => item.media_type === 'movie' || item.media_type === 'tv'
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error(error);
      alert('Arama yapılırken bir hata oluştu. API Key eklediğinizden emin olun.');
    }
    setLoading(false);
  };

  const saveItem = async () => {
    if (mode === 'manual' && !title) {
      alert('Lütfen bir başlık girin.');
      return;
    }
    if (mode === 'auto' && !selectedItem) {
      alert('Lütfen bir film/dizi seçin.');
      return;
    }

    let leadActor = null;
    let releaseDate = null;

    if (mode === 'auto' && selectedItem) {
      releaseDate = selectedItem.release_date || selectedItem.first_air_date;
      setLoading(true);
      try {
        const typeStr = selectedItem.media_type === 'tv' ? 'tv' : 'movie';
        const res = await axios.get(
          `https://api.themoviedb.org/3/${typeStr}/${selectedItem.id}?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&append_to_response=credits&language=tr-TR`
        );
        if (res.data.credits?.cast?.length > 0) {
          leadActor = res.data.credits.cast[0].name;
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }

    const newItem = {
      id: Date.now().toString(),
      tmdb_id: mode === 'auto' ? selectedItem.id : null,
      title: mode === 'auto' ? (selectedItem.title || selectedItem.name) : title,
      overview: mode === 'auto' ? selectedItem.overview : overview,
      poster: mode === 'auto'
        ? (selectedItem.poster_path ? `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}` : '')
        : posterUrl,
      type: mode === 'auto' ? (selectedItem.media_type === 'tv' ? 'tv' : 'movie') : type,
      comment: comment,
      releaseDate: releaseDate,
      leadActor: leadActor
    };

    try {
      const stored = await AsyncStorage.getItem('@film_dizi_list');
      let items = stored ? JSON.parse(stored) : [];
      items = [newItem, ...items];
      await AsyncStorage.setItem('@film_dizi_list', JSON.stringify(items));
      navigation.goBack();
    } catch (e) {
      console.error(e);
      alert('Kaydedilemedi');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, mode === 'auto' && styles.activeTab]}
          onPress={() => setMode('auto')}
        >
          <Text style={[styles.tabText, mode === 'auto' && styles.activeTabText]}>API'den Ara</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === 'manual' && styles.activeTab]}
          onPress={() => setMode('manual')}
        >
          <Text style={[styles.tabText, mode === 'manual' && styles.activeTabText]}>Manuel Ekle</Text>
        </TouchableOpacity>
      </View>

      {mode === 'auto' ? (
        <View style={styles.section}>
          <View style={styles.searchRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Film veya Dizi Adı (Örn: Matrix)"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={searchTMDB}>
              <Text style={styles.searchBtnText}>Ara</Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 20 }} />}

          {!selectedItem && searchResults.length > 0 && (
            <ScrollView style={styles.resultsContainer} nestedScrollEnabled={true}>
              {searchResults.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultItem}
                  onPress={() => setSelectedItem(item)}
                >
                  <Image
                    source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://via.placeholder.com/50' }}
                    style={styles.resultPoster}
                  />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle}>{item.title || item.name}</Text>
                    <Text style={styles.resultType}>{item.media_type === 'movie' ? 'Film' : 'Dizi'} - {item.release_date || item.first_air_date?.substring(0, 4)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {selectedItem && (
            <View style={styles.selectedContainer}>
              <Text style={styles.label}>Seçilen Yapım:</Text>
              <View style={styles.selectedCard}>
                <Image
                  source={{ uri: selectedItem.poster_path ? `https://image.tmdb.org/t/p/w200${selectedItem.poster_path}` : 'https://via.placeholder.com/100' }}
                  style={styles.selectedPoster}
                />
                <View style={styles.selectedInfo}>
                  <Text style={styles.resultTitle}>{selectedItem.title || selectedItem.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.clearBtn}>
                    <Text style={styles.clearBtnText}>Başkasına Bak</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.label}>Başlık</Text>
          <TextInput
            style={styles.input}
            placeholder="Film/Dizi Adı"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Türü</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'movie' && styles.activeType]}
              onPress={() => setType('movie')}
            >
              <Text style={styles.typeText}>Film</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'tv' && styles.activeType]}
              onPress={() => setType('tv')}
            >
              <Text style={styles.typeText}>Dizi</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Afiş URL (Opsiyonel)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor="#888"
            value={posterUrl}
            onChangeText={setPosterUrl}
          />

          <Text style={styles.label}>Özet (Opsiyonel)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Konusu..."
            placeholderTextColor="#888"
            multiline={true}
            numberOfLines={4}
            value={overview}
            onChangeText={setOverview}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Yorumun</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Bu yapım hakkında ne düşünüyorsun?"
          placeholderTextColor="#888"
          multiline={true}
          numberOfLines={4}
          maxLength={300}
          value={comment}
          onChangeText={setComment}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={saveItem}>
        <Text style={styles.saveBtnText}>Kaydet</Text>
      </TouchableOpacity>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  tabContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#18181B', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#27272A' },
  tab: { flex: 1, padding: 14, alignItems: 'center' },
  activeTab: { backgroundColor: '#6366F1' },
  tabText: { color: '#FFF', fontWeight: '600' },
  activeTabText: { color: '#FFF' },
  section: { marginBottom: 20 },
  label: { color: '#A1A1AA', marginBottom: 8, fontWeight: '600', fontSize: 13, textTransform: 'uppercase' },
  input: { backgroundColor: '#18181B', color: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#27272A' },
  textArea: { height: 120, textAlignVertical: 'top' },
  searchRow: { flexDirection: 'row', width: '100%', marginBottom: 16 },
  searchBtn: { backgroundColor: '#6366F1', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 12, marginLeft: 8 },
  searchBtnText: { color: '#FFF', fontWeight: 'bold' },
  resultsContainer: { backgroundColor: '#18181B', borderRadius: 12, maxHeight: 300, borderWidth: 1, borderColor: '#27272A' },
  resultItem: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#27272A' },
  resultPoster: { width: 50, height: 75, borderRadius: 6 },
  resultInfo: { marginLeft: 16, justifyContent: 'center', flex: 1 },
  resultTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  resultType: { color: '#A1A1AA', fontSize: 13, marginTop: 4 },
  selectedContainer: { backgroundColor: '#18181B', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#27272A' },
  selectedCard: { flexDirection: 'row', marginTop: 8 },
  selectedPoster: { width: 80, height: 120, borderRadius: 8 },
  selectedInfo: { marginLeft: 16, flex: 1, justifyContent: 'space-between' },
  clearBtn: { backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  clearBtnText: { color: '#FFF', fontWeight: '600', fontSize: 12 },
  typeRow: { flexDirection: 'row', marginBottom: 16 },
  typeBtn: { flex: 1, padding: 14, alignItems: 'center', backgroundColor: '#18181B', marginHorizontal: 4, borderRadius: 12, borderWidth: 1, borderColor: '#27272A' },
  activeType: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  typeText: { color: '#FFF', fontWeight: '600' },
  saveBtn: { backgroundColor: '#10B981', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});
