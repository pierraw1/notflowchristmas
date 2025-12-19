import { useEffect, useRef } from "react";
import { View, Image, Pressable, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function LoadingScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const onPress = () => {
    router.replace("/home");
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.inner}>
        <Image
          source={require("../assets/images/top.png")}
          style={styles.topImage}
          resizeMode="contain"
        />

        <Animated.Image
          source={require("../assets/images/bottom.png")}
          style={[styles.bottomImage, { opacity }]}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b3446",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "space-between",
    alignItems: "center",
  },
  topImage: {
    width: "100%",
    height: 160,
  },
  bottomImage: {
    width: "100%",
    height: 140,
  },
});
