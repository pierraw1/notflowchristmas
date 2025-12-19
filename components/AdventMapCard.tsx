import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  currentLevel: number; // 1..24
  onPressLevel?: (level: number) => void;
};

type Spot = {
  level: number;
  x: number; // 0..1
  y: number; // 0..1
  size: number;
};

export function AdventMapCard({ currentLevel, onPressLevel }: Props) {
  const router = useRouter(); // ✅ doit être داخل le composant

  const spots = useMemo<Spot[]>(
    () => [
      { level: 1, x: 0.10, y: 0.18, size: 44 },
      { level: 2, x: 0.28, y: 0.22, size: 40 },
      { level: 3, x: 0.46, y: 0.18, size: 42 },
      { level: 4, x: 0.64, y: 0.22, size: 40 },
      { level: 5, x: 0.82, y: 0.18, size: 44 },

      { level: 6, x: 0.14, y: 0.36, size: 42 },
      { level: 7, x: 0.34, y: 0.40, size: 44 },
      { level: 8, x: 0.54, y: 0.34, size: 40 },
      { level: 9, x: 0.74, y: 0.40, size: 44 },
      { level: 10, x: 0.88, y: 0.34, size: 40 },

      { level: 11, x: 0.10, y: 0.54, size: 40 },
      { level: 12, x: 0.26, y: 0.58, size: 44 },
      { level: 13, x: 0.44, y: 0.52, size: 42 },
      { level: 14, x: 0.62, y: 0.58, size: 44 },
      { level: 15, x: 0.80, y: 0.52, size: 42 },

      { level: 16, x: 0.14, y: 0.70, size: 44 },
      { level: 17, x: 0.34, y: 0.74, size: 40 },
      { level: 18, x: 0.52, y: 0.70, size: 44 },
      { level: 19, x: 0.70, y: 0.74, size: 40 },
      { level: 20, x: 0.88, y: 0.70, size: 44 },

      { level: 21, x: 0.18, y: 0.86, size: 44 },
      { level: 22, x: 0.38, y: 0.90, size: 40 },
      { level: 23, x: 0.58, y: 0.86, size: 44 },
      { level: 24, x: 0.78, y: 0.90, size: 44 },
    ],
    []
  );

  return (
    <View style={styles.card}>
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <View style={[styles.wave, { top: 44, opacity: 0.18 }]} />
      <View style={[styles.wave, { top: 92, opacity: 0.12 }]} />
      <View style={[styles.wave, { top: 140, opacity: 0.10 }]} />

      <View style={styles.mapArea}>
        {spots.map((s) => {
          const isCurrent = s.level === currentLevel;
          const isUnlocked = s.level <= currentLevel;

          return (
            <Pressable
              key={s.level}
              onPress={() => {
                onPressLevel?.(s.level);      // ✅ une seule fois
                router.push(`/level/${s.level}`); // ✅ navigation
              }}
              style={({ pressed }) => [
                styles.islet,
                {
                  width: s.size,
                  height: s.size,
                  borderRadius: s.size / 2,
                  left: `${s.x * 100}%`,
                  top: `${s.y * 100}%`,
                  transform: [
                    { translateX: -s.size / 2 },
                    { translateY: -s.size / 2 },
                    { scale: pressed ? 0.98 : 1 },
                  ],
                  backgroundColor: isCurrent
                    ? "#C7A52C"
                    : isUnlocked
                    ? "rgba(245, 247, 255, 0.92)"
                    : "rgba(10, 40, 55, 0.35)",
                },
              ]}
              hitSlop={10}
            >
              <Text
                style={[
                  styles.isletText,
                  {
                    color: isUnlocked ? "#0A2837" : "rgba(255,255,255,0.55)",
                    fontWeight: isCurrent ? "900" : "800",
                  },
                ]}
              >
                {s.level}
              </Text>

              <View style={styles.isletHighlight} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    backgroundColor: "#3569d8",
  },
  bgTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "42%",
    backgroundColor: "#3b78ff",
  },
  bgBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "68%",
    backgroundColor: "#5e88d1",
  },
  wave: {
    position: "absolute",
    left: -40,
    right: -40,
    height: 34,
    borderRadius: 22,
    backgroundColor: "white",
  },
  mapArea: {
    flex: 1,
    position: "relative",
  },
  islet: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  isletText: {
    fontSize: 14,
  },
  isletHighlight: {
    position: "absolute",
    top: 6,
    left: 8,
    width: 14,
    height: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
});
