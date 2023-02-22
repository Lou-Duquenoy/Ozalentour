import { StyleSheet, View, Animated, Easing, Dimensions } from "react-native";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function Shimmer() {
  const AnimatedView = Animated.createAnimatedComponent(LinearGradient);
  const animatedValue = new Animated.Value(0);
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  });

  return (
    <View style={styles.container}>
      <View style={styles.backgroundView}>
        <AnimatedView
          colors={["#a0a0a0", "#b0b0b0", "#b0b0b0", "#a0a0a0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            StyleSheet.absoluteFillObject,
            {
              transform: [{ translateX: translateX }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    
  },

  backgroundView: {
    backgroundColor: "#a0a0a0",
    borderColor: "#b0b0b0",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    borderRadius: 50
  },
});
