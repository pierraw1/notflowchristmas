import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";

const DOT_SIZE = 34;
const ITEM_WIDTH = 54;
const GAP = 18;

type Props = {
  currentLevel: number;
  onLevelPress?: (level: number) => void;
};

export function LevelBar({ currentLevel, onLevelPress }: Props) {
  const totalLevels = 24;

  const levels = useMemo(
    () => Array.from({ length: totalLevels }, (_, i) => i + 1),
    []
  );

  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    blink.setValue(1);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 0.25,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [currentLevel]);

  /**
   * Rail length calculation:
   * from center of first dot to center of last dot
   */
  const railWidth =
    (totalLevels - 1) * (ITEM_WIDTH + GAP);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        decelerationRate="fast"
      >
        {/* Rail */}
        <View
          style={[
            styles.rail,
            {
              width: railWidth,
              left: ITEM_WIDTH / 2,
            },
          ]}
        />

        {levels.map((lvl) => {
          const isCurrent = lvl === currentLevel;

          return (
            <Pressable
              key={lvl}
              style={styles.item}
              onPress={() => onLevelPress?.(lvl)}
              hitSlop={10}
            >
              <Text style={styles.levelText}>
                {String(lvl).padStart(2, "0")}
              </Text>

              {isCurrent ? (
                <Animated.View
                  style={[
                    styles.dotCurrent,
                    { opacity: blink },
                  ]}
                />
              ) : (
                <View style={styles.dot} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 92,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 18,
    alignItems: "center",
    gap: GAP,
  },
  rail: {
    position: "absolute",
    top: 56,
    height: 4,
    backgroundColor: "rgba(10, 40, 55, 0.55)",
    borderRadius: 2,
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: "center",
  },
  levelText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "rgba(10, 40, 55, 0.9)",
  },
  dotCurrent: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#C7A52C",
  },
});
