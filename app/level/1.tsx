import React, { useMemo, useState } from "react";
import { View, StyleSheet, Image, Pressable, Text, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  withSequence,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

// IMPORTANT: adapte les chemins si besoin
const MAP = require("../../assets/images/carte.jpg");
const OBJ = require("../../assets/images/obj.png");

/**
 * Position de l'objet SUR LA CARTE (en %)
 * => Tu ajustes ces valeurs pour le placer exactement au bon endroit.
 */
const OBJ_X = 0.51; // 0..1
const OBJ_Y = 0.53; // 0..1

/**
 * Taille de l'objet (en px sur l'écran, avant zoom)
 * => Ajuste selon ton objet.
 */
const OBJ_SIZE = 10;

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export default function Level1() {
  const router = useRouter();
  const [found, setFound] = useState(false);

  // Transform state
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  // “Found” animation overlay
  const foundOpacity = useSharedValue(0);
  const foundScale = useSharedValue(0.9);

  const clamp = (v: number, min: number, max: number) => {
    "worklet";
    return Math.max(min, Math.min(max, v));
  };

  // Pinch
  const pinch = useMemo(() => {
    return Gesture.Pinch()
      .onUpdate((e) => {
        const next = clamp(savedScale.value * e.scale, MIN_SCALE, MAX_SCALE);
        scale.value = next;
      })
      .onEnd(() => {
        savedScale.value = scale.value;
      });
  }, []);

  // Pan
  const pan = useMemo(() => {
    return Gesture.Pan()
      .onUpdate((e) => {
        // Pan simple. Si tu veux, on pourra ajouter un clamp selon la taille de l'image/écran.
        tx.value = savedTx.value + e.translationX;
        ty.value = savedTy.value + e.translationY;
      })
      .onEnd(() => {
        savedTx.value = tx.value;
        savedTy.value = ty.value;
      });
  }, []);

  const gesture = useMemo(() => Gesture.Simultaneous(pan, pinch), [pan, pinch]);

  const mapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }));

  const foundStyle = useAnimatedStyle(() => ({
    opacity: foundOpacity.value,
    transform: [{ scale: foundScale.value }],
  }));

  const goBackToHome = () => {
    router.replace("/home");
  };

  const playFound = () => {
    setFound(true);

    foundOpacity.value = withTiming(1, { duration: 220 });
    foundScale.value = withSequence(
      withTiming(1.05, { duration: 180 }),
      withTiming(1, { duration: 180 })
    );

    // Retour après petite anim
    foundOpacity.value = withTiming(1, { duration: 300 }, () => {
      // petit délai avant de quitter
      runOnJS(goBackToHome)();
    });
  };

  const onPressObject = () => {
    if (found) return;
    playFound();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header minimal */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Text style={styles.backText}>Retour</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Niveau 1</Text>
        <View style={{ width: 64 }} />
      </View>

      <View style={styles.stage}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.mapWrap, mapStyle]}>
            {/* La carte */}
            <Image source={MAP} style={styles.mapImage} resizeMode="contain" />

            {/* L'objet posé SUR la carte (dans le même conteneur transformé) */}
            <Pressable
              onPress={onPressObject}
              style={[
                styles.objHitbox,
                {
                  left: `${OBJ_X * 100}%`,
                  top: `${OBJ_Y * 100}%`,
                  width: OBJ_SIZE,
                  height: OBJ_SIZE,
                  marginLeft: -OBJ_SIZE / 2,
                  marginTop: -OBJ_SIZE / 2,
                },
              ]}
              hitSlop={12}
            >
              <Image source={OBJ} style={styles.objImage} resizeMode="contain" />
            </Pressable>
          </Animated.View>
        </GestureDetector>

        {/* Overlay “trouvé” */}
        {found && (
          <Animated.View style={[styles.foundOverlay, foundStyle]}>
            <View style={styles.foundCard}>
              <Text style={styles.foundTitle}>Trouvé.</Text>
              <Text style={styles.foundSub}>Retour au calendrier…</Text>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1b3446" },

  header: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 64,
    paddingVertical: 8,
  },
  backText: {
    color: "white",
    fontWeight: "700",
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },

  stage: {
    flex: 1,
    overflow: "hidden",
  },

  // Conteneur transformé (map + objet)
  mapWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // La carte occupe la scène (on laisse contain pour ne pas couper)
  mapImage: {
    width: "100%",
    height: "100%",
  },

  // Hitbox de l'objet : positionnée en % dans le conteneur
  objHitbox: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  objImage: {
    width: "100%",
    height: "100%",
  },

  foundOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 36,
    alignItems: "center",
  },
  foundCard: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  foundTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  foundSub: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
