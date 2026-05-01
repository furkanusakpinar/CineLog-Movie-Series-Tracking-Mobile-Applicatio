import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, 
  TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item.tmdb_id) {
      fetchDetails();
    }
  }, []);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const type = item.type === 'movie' ? 'movie' : 'tv';
      const response = await axios.get(
        `https://api.themoviedb.org/3/${type}/${item.tmdb_id}?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&append_to_response=credits&language=tr-TR`
      );
      setDetails(response.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const deleteItem = () => {
    Alert.alert(
      "Sil",
      "Bu kaydı silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive",
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem('@film_dizi_list');
              if (stored) {
                let items = JSON.parse(stored);
                items = items.filter(i => i.id !== item.id);
                await AsyncStorage.setItem('@film_dizi_list', JSON.stringify(items));
                navigation.goBack();
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      ]
    );
  };

  const getCreators = () => {
    if (!details) return null;
    if (item.type === 'movie' && details.credits?.crew) {
      const director = details.credits.crew.find(c => c.job === 'Director');
      return director ? director.name : null;
    } else if (item.type === 'tv' && details.created_by) {
      return details.created_by.map(c => c.name).join(', ');
    }
    return null;
  };

  const getActorsList = () => {
    if (!details || !details.credits?.cast) return [];
    return details.credits.cast.slice(0, 10);
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: item.poster || 'https://via.placeholder.com/500x750' }} 
          style={[StyleSheet.absoluteFillObject, { width: '100%', height: '100%' }]}
          blurRadius={30}
        />
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(9,9,11,0.6)' }]} />
        <Image 
          source={{ uri: item.poster || 'https://via.placeholder.com/500x750' }} 
          style={styles.poster}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.type === 'movie' ? 'FİLM' : 'DİZİ'}</Text>
          </View>
          {details?.release_date || details?.first_air_date ? (
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                {(details.release_date || details.first_air_date).substring(0, 4)}
              </Text>
            </View>
          ) : null}
          {details?.runtime ? (
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>{details.runtime} dk</Text>
            </View>
          ) : null}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{marginVertical: 20}} />
        ) : (
          details && (
            <View style={styles.detailsBox}>
              {item.type === 'tv' && details?.number_of_seasons ? (
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>Sezon: </Text>
                  {details.number_of_seasons} Sezon, {details.number_of_episodes} Bölüm
                </Text>
              ) : null}
              {getCreators() ? (
                <Text style={styles.detailText}>
                  <Text style={styles.detailBold}>{item.type === 'movie' ? 'Yönetmen: ' : 'Yaratıcı: '}</Text>
                  {getCreators()}
                </Text>
              ) : null}
            </View>
          )
        )}

        {!loading && details && getActorsList().length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Oyuncular</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.castContainer}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {getActorsList().map((actor) => (
                <View key={actor.id} style={styles.castItem}>
                  <Image 
                    source={{ uri: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/100x150' }}
                    style={styles.castImage}
                  />
                  <Text style={styles.castName} numberOfLines={2}>{actor.name}</Text>
                  <Text style={styles.castCharacter} numberOfLines={1}>{actor.character}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}
        
        {item.overview || details?.overview ? (
          <>
            <Text style={styles.sectionTitle}>Özet</Text>
            <Text style={styles.overview}>{details?.overview || item.overview}</Text>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Yorumun</Text>
        <View style={styles.commentBox}>
          <Text style={styles.comment}>{item.comment || "Henüz bir yorum eklemedin."}</Text>
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={deleteItem}>
          <Text style={styles.deleteBtnText}>Bu Kaydı Sil</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  imageWrapper: { width: '100%', height: 420, backgroundColor: '#09090B', justifyContent: 'center', alignItems: 'center', },
  poster: { width: '60%', height: '90%', borderRadius: 12, marginBottom: 30 },
  content: { padding: 20, marginTop: -30, backgroundColor: '#09090B', borderTopLeftRadius: 30, borderTopRightRadius: 30},
  title: { color: '#FAFAFA', fontSize: 26, fontWeight: 'bold', marginBottom: 12 },
  badgeRow: { flexDirection: 'row', marginBottom: 20, gap: 10, flexWrap: 'wrap' },
  badge: { backgroundColor: '#6366F1', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, justifyContent: 'center' },
  badgeText: { color: '#FAFAFA', fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5 },
  infoBadge: { backgroundColor: '#27272A', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, justifyContent: 'center' },
  infoBadgeText: { color: '#FAFAFA', fontSize: 12, fontWeight: '600' },
  detailsBox: { backgroundColor: '#18181B', padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#27272A' },
  detailText: { color: '#D4D4D8', fontSize: 15, marginBottom: 6, lineHeight: 22 },
  detailBold: { color: '#6366F1', fontWeight: 'bold' },
  sectionTitle: { color: '#6366F1', fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  overview: { color: '#D4D4D8', fontSize: 15, lineHeight: 26 },
  commentBox: { backgroundColor: '#18181B', padding: 16, borderRadius: 16, marginTop: 8, borderWidth: 1, borderColor: '#27272A' },
  comment: { color: '#FAFAFA', fontSize: 16, fontStyle: 'italic', lineHeight: 24 },
  deleteBtn: { marginTop: 40, backgroundColor: '#EF4444', padding: 18, borderRadius: 16, alignItems: 'center' },
  deleteBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  castContainer: { flexDirection: 'row', marginTop: 8, marginBottom: 20, marginHorizontal: -20 },
  castItem: { width: 90, marginRight: 16, alignItems: 'center' },
  castImage: { width: 80, height: 120, borderRadius: 12, backgroundColor: '#18181B', marginBottom: 8, borderWidth: 1, borderColor: '#27272A' },
  castName: { color: '#FAFAFA', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  castCharacter: { color: '#A1A1AA', fontSize: 11, textAlign: 'center', marginTop: 2 }
});