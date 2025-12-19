import { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable, Vibration, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

const TARGET = 10;

export default function Level3() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  // micro animation bouton
  const pressScale = useSharedValue(1);

  // overlay validation
  const overlayOpacity = useSharedValue(0);
  const overlayScale = useSharedValue(0.96);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: overlayScale.value }],
  }));

  const vibrate = () => {
    // iOS: durée courte; Android: durée ok
    Vibration.vibrate(Platform.OS === "ios" ? 30 : 40);
  };

  const validateAndExit = () => {
    setDone(true);
    overlayOpacity.value = withTiming(1, { duration: 200 });
    overlayScale.value = withSequence(
      withTiming(1.02, { duration: 160 }),
      withTiming(1, { duration: 160 })
    );

    timeoutRef.current = setTimeout(() => {
      router.replace("/home");
    }, 650);
  };

  const onPress = () => {
    if (done) return;

    // feedback
    vibrate();
    pressScale.value = withSequence(
      withTiming(0.97, { duration: 70 }),
      withTiming(1, { duration: 90 })
    );

    setCount((prev) => {
      const next = prev + 1;
      if (next >= TARGET) {
        // vibration “succès” un peu plus marquée
        Vibration.vibrate(Platform.OS === "ios" ? 80 : 120);
        // déclenche validation après update state
        setTimeout(validateAndExit, 0);
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.buttonWrap, buttonAnimStyle]}>
          <Pressable
            onPress={onPress}
            style={({ pressed }) => [
              styles.button,
              pressed && !done ? styles.buttonPressed : null,
              done ? styles.buttonDone : null,
            ]}
          >
<Text style={styles.buttonNumber}>
  {Math.min(count, TARGET)}
</Text>
          </Pressable>
        </Animated.View>

        {done && (
          <Animated.View style={[styles.overlay, overlayStyle]}>
            <View style={styles.overlayCard}>
              <Text style={styles.overlayTitle}>Niveau validé.</Text>
              <Text style={styles.overlaySub}>Retour au calendrier…</Text>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1b3446" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  buttonWrap: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C7A52C",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  buttonDone: {
    backgroundColor: "rgba(199,165,44,0.65)",
  },
  buttonText: {
    color: "#0A2837",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 0.3,
  },

  counter: {
    marginTop: 18,
    color: "white",
    fontSize: 22,
    fontWeight: "800",
  },

  overlay: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  overlayCard: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  overlayTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  overlaySub: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
