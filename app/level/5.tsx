import { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DURATION_MS = 8000;
const SIZE = 220;
const STROKE = 18;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export default function Level5() {
  const router = useRouter();
  const [started, setStarted] = useState(false);

  const progress = useSharedValue(0); // 0..1
  const doneRef = useRef(false);

  const validate = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    router.replace("/home");
  };

  const start = () => {
    if (started) return;
    setStarted(true);

    progress.value = withTiming(
      1,
      { duration: DURATION_MS, easing: Easing.linear },
      (finished) => {
        if (finished) runOnJS(validate)();
      }
    );
  };

  const animatedProps = useAnimatedProps(() => {
    // dashoffset = C * (1 - progress)
    return {
      strokeDashoffset: C * (1 - progress.value),
    };
  });

  // sécurité : si on revient / hot reload
  useEffect(() => {
    return () => {
      // rien à nettoyer ici
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable onPress={start} style={styles.touchArea}>
          <View style={styles.ringWrap}>
            <Svg width={SIZE} height={SIZE}>
              {/* Track */}
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth={STROKE}
                fill="none"
              />

              {/* Progress */}
              <AnimatedCircle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                stroke="#C7A52C"
                strokeWidth={STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${C} ${C}`}
                animatedProps={animatedProps}
                // rotation pour démarrer en haut
                originX={SIZE / 2}
                originY={SIZE / 2}
                rotation={-90}
              />
            </Svg>

            {/* “camembert” centre (optionnel) */}
            <View style={styles.centerDot} />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1b3446" },
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Zone tappable (plein centre)
  touchArea: {
    alignItems: "center",
    justifyContent: "center",
  },

  ringWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  centerDot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
});
