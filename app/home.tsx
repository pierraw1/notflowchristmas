import { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { LevelBar } from "../components/LevelBar";
import { AdventMapCard } from "../components/AdventMapCard";

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topHeader}>
        <LevelBar currentLevel={currentLevel} onLevelPress={setCurrentLevel} />
      </View>

      <View style={styles.content}>
        <AdventMapCard
          currentLevel={currentLevel}
          onPressLevel={(lvl) => setCurrentLevel(lvl)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1b3446" },

  topHeader: {
    backgroundColor: "#2f63d6",
    paddingTop: 6,
    paddingBottom: 10,
  },

  content: {
    flex: 1,
  },
});
