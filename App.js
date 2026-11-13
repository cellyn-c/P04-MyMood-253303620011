import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
} from "react-native";

const moods = [
  {
    id: "1",
    name: "Happy",
    emoji: "😊",
    color: "#FFD166",
    message: "Hari yang menyenangkan! Tetap semangat!",
  },
  {
    id: "2",
    name: "Neutral",
    emoji: "😐",
    color: "#A0C4FF",
    message: "Tidak apa-apa, jalani hari dengan santai.",
  },
  {
    id: "3",
    name: "Sad",
    emoji: "😢",
    color: "#BDB2FF",
    message: "Tidak apa-apa merasa sedih. Kamu kuat!",
  },
  {
    id: "4",
    name: "Angry",
    emoji: "😠",
    color: "#FFADAD",
    message: "Tarik napas, tenangkan pikiranmu.",
  },
  {
    id: "5",
    name: "Tired",
    emoji: "😴",
    color: "#CAFFBF",
    message: "Jangan lupa istirahat yang cukup!",
  },
];

export default function App() {
  // STATE
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [dayCount, setDayCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const theme = darkMode
    ? {
        background: "#151525",
        card: "#25253A",
        text: "#FFFFFF",
        muted: "#BBBBCC",
        primary: "#A78BFA",
      }
    : {
        background: "#F5F3FF",
        card: "#FFFFFF",
        text: "#292344",
        muted: "#888399",
        primary: "#8065D8",
      };

  // EVENT HANDLER: SIMPAN MOOD
  const handleSubmit = () => {
    if (!selectedMood) {
      alert("Silakan pilih mood terlebih dahulu!");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note: note.trim() || "Tidak ada catatan",
      date: new Date().toLocaleDateString("id-ID"),
    };

    setHistory((previous) => [entry, ...previous]);
    setDayCount((previous) => previous + 1);
    setSelectedMood(null);
    setNote("");
    alert("Mood berhasil disimpan! 🎉");
  };

  // EVENT HANDLER: RESET
  const handleReset = () => {
    setSelectedMood(null);
    setNote("");
    setDayCount(0);
    setHistory([]);
    setShowStats(false);
  };

  // STATISTIK MOOD
  const getPercentage = (moodName) => {
    if (history.length === 0) return 0;
    const total = history.filter((item) => item.mood.name === moodName).length;
    return Math.round((total / history.length) * 100);
  };

  const currentMood = moods.find((item) => item.id === selectedMood);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>MyMood 🎭</Text>
              <Text style={styles.headerSubtitle}>
                Kenali perasaanmu hari ini
              </Text>
            </View>

            <TouchableOpacity
              style={styles.darkButton}
              onPress={() => setDarkMode((previous) => !previous)}
            >
              <Text style={styles.darkButtonText}>
                {darkMode ? "☀️" : "🌙"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.counterNumber}>{dayCount}</Text>
            <Text style={styles.counterLabel}>Hari sudah mencatat mood</Text>
          </View>
        </View>

        {/* PILIH MOOD */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Bagaimana perasaanmu hari ini?
          </Text>

          <Text style={[styles.description, { color: theme.muted }]}>
            Pilih mood yang paling menggambarkan dirimu.
          </Text>

          <View style={styles.moodContainer}>
            {moods.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedMood(item.id)}
                style={[
                  styles.moodCard,
                  {
                    backgroundColor:
                      selectedMood === item.id ? item.color : theme.card,
                    borderColor:
                      selectedMood === item.id ? theme.primary : "transparent",
                    borderWidth: selectedMood === item.id ? 2 : 1,
                  },
                ]}
              >
                <Text style={styles.moodEmoji}>{item.emoji}</Text>
                <Text style={[styles.moodName, { color: theme.text }]}>
                  {item.name}
                </Text>
                {selectedMood === item.id && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* CONDITIONAL RENDERING: TERNARY */}
          <View style={[styles.messageBox, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.text, textAlign: "center" }}>
              {currentMood
                ? currentMood.message
                : "✨ Pilih mood untuk melihat pesan hari ini."}
            </Text>
          </View>
        </View>

        {/* INPUT CATATAN */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Catatan Hari Ini 📝
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.primary,
              },
            ]}
            placeholder="Ceritakan harimu..."
            placeholderTextColor={theme.muted}
            value={note}
            onChangeText={setNote}
            maxLength={100}
            multiline
          />

          <Text style={[styles.characterCount, { color: theme.muted }]}>
            {note.length}/100 karakter
          </Text>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Simpan Mood 💜</Text>
          </TouchableOpacity>
        </View>

        {/* RIWAYAT MOOD */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            📅 Riwayat Mood
          </Text>

          {/* CONDITIONAL RENDERING: && */}
          {history.length === 0 && (
            <View style={[styles.emptyBox, { backgroundColor: theme.card }]}>
              <Text style={{ color: theme.muted }}>
                Belum ada riwayat mood. Yuk, catat mood pertamamu!
              </Text>
            </View>
          )}

          <FlatList
            data={history}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[styles.historyCard, { backgroundColor: theme.card }]}
              >
                <Text style={styles.historyEmoji}>{item.mood.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyMood, { color: theme.text }]}>
                    {item.mood.name}
                  </Text>
                  <Text style={[styles.historyNote, { color: theme.muted }]}>
                    {item.note}
                  </Text>
                  <Text style={[styles.historyDate, { color: theme.muted }]}>
                    {item.date}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* STATISTIK MOOD */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.statsButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowStats((previous) => !previous)}
          >
            <Text style={styles.submitText}>
              📊 {showStats ? "Sembunyikan Statistik" : "Lihat Statistik Mood"}
            </Text>
          </TouchableOpacity>

          {showStats && (
            <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Statistik Mood
              </Text>

              {moods.map((item) => (
                <View key={item.id} style={styles.statItem}>
                  <Text style={{ color: theme.text, width: 100 }}>
                    {item.emoji} {item.name}
                  </Text>

                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${getPercentage(item.name)}%`,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={{ color: theme.text, width: 40, textAlign: "right" }}
                  >
                    {getPercentage(item.name)}%
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* TOMBOL RESET - CONDITIONAL RENDERING */}
        {dayCount > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>🗑️ Reset Semua Data</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.footer, { color: theme.muted }]}>
          Made with 💜 | MyMood App © 2026
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 55,
    paddingHorizontal: 22,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    color: "#EEE7FF",
    marginTop: 5,
    fontSize: 14,
  },
  darkButton: {
    backgroundColor: "#FFFFFF33",
    padding: 12,
    borderRadius: 30,
  },
  darkButtonText: {
    fontSize: 22,
  },
  counterBox: {
    marginTop: 25,
    backgroundColor: "#FFFFFF25",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  counterNumber: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  counterLabel: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  moodCard: {
    width: "31%",
    minHeight: 105,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodName: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
  },
  checkMark: {
    position: "absolute",
    top: 5,
    right: 9,
    fontWeight: "bold",
    color: "#333",
  },
  messageBox: {
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
  },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    textAlignVertical: "top",
    fontSize: 14,
  },
  characterCount: {
    textAlign: "right",
    marginTop: 5,
    fontSize: 12,
  },
  submitButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 15,
  },
  submitText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  emptyBox: {
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
  },
  historyEmoji: {
    fontSize: 35,
    marginRight: 15,
  },
  historyMood: {
    fontWeight: "bold",
    fontSize: 15,
  },
  historyNote: {
    fontSize: 13,
    marginTop: 4,
  },
  historyDate: {
    fontSize: 11,
    marginTop: 5,
  },
  statsButton: {
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  statsCard: {
    padding: 15,
    borderRadius: 15,
    marginTop: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 5,
  },
  progressBackground: {
    flex: 1,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#DDDAE8",
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    borderRadius: 10,
  },
  resetButton: {
    marginHorizontal: 20,
    marginTop: 25,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#FF6B6B",
    alignItems: "center",
  },
  resetText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    marginTop: 25,
    marginBottom: 35,
    fontSize: 12,
  },
});
