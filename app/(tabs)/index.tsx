import React, { useState } from "react";
import { View, Text, Pressable, Vibration } from "react-native";

export default function TestVibration() {
  const [score, setScore] = useState(0);

  const handlePress = () => {
    console.log("PRESS OK");        // pour vérifier que ça déclenche
    Vibration.vibrate(200);         // 200 ms
    setScore((s) => s + 1);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Score: {score}</Text>

      <Pressable
        onPress={handlePress}
        style={{
          marginTop: 20,
          width: 80,
          height: 80,
          borderRadius: 40,
          borderWidth: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Rond</Text>
      </Pressable>
    </View>
  );
}
