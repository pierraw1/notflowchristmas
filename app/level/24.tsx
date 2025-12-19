import { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet, SafeAreaView, Pressable, Text, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Asset } from "expo-asset";
import { WebView } from "react-native-webview";

export default function Level24() {
  const router = useRouter();
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const asset = Asset.fromModule(require("../../assets/html/testflow.html"));
      await asset.downloadAsync();
      setUri(asset.localUri ?? asset.uri);
    })();
  }, []);

  const onMessage = useCallback(
    (event: any) => {
      const msg = String(event?.nativeEvent?.data ?? "");
      if (msg === "victory") router.replace("/home");
    },
    [router]
  );

  if (!uri) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  const injectedJavaScript = `
    (function() {
      function safePost(msg) {
        try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage(String(msg)); } catch (e) {}
      }
      const t = setInterval(() => {
        if (typeof window.showVictory === "function") {
          clearInterval(t);
          const original = window.showVictory;
          window.showVictory = function() {
            try { original.apply(this, arguments); } finally { safePost("victory"); }
          };
        }
      }, 50);
      true;
    })();
  `;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Text style={styles.backText}>Retour</Text>
        </Pressable>
        <Text style={styles.title}>Niveau 24</Text>
        <View style={{ width: 64 }} />
      </View>

      {/* WEB: iframe */}
      {Platform.OS === "web" ? (
        <View style={styles.webContainer}>
          {/* @ts-ignore - iframe existe côté web */}
          <iframe
            src={uri}
            style={{ border: "none", width: "100%", height: "100%" }}
            title="Level24"
          />
        </View>
      ) : (
        /* iOS/Android: WebView */
        <WebView
          originWhitelist={["*"]}
          source={{ uri }}
          onMessage={onMessage}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled
          domStorageEnabled
          style={styles.webview}
        />
      )}
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
  backBtn: { width: 64, paddingVertical: 8 },
  backText: { color: "white", fontWeight: "700" },
  title: { color: "white", fontSize: 16, fontWeight: "800" },
  webview: { flex: 1, backgroundColor: "transparent" },
  webContainer: { flex: 1, backgroundColor: "transparent" },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
});
