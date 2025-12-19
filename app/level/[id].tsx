import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function LevelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Niveau ${id}` }} />

      <Text style={styles.title}>Niveau {id}</Text>

      <Pressable onPress={() => router.back()} style={styles.btn}>
        <Text style={styles.btnText}>Retour</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "800" },
  btn: { marginTop: 16, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: "#1b3446" },
  btnText: { color: "white", fontWeight: "700" },
});
