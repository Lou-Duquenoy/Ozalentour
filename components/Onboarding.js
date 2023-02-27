import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";
import { DataContext } from "./Context";
import Carousel from "react-native-reanimated-carousel";

const Onboarding = ({ navigateToRegister }) => {
  const { width, height } = Dimensions.get("window");
  const [current, setCurrent] = useState(0);
  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={height * 0.55}
        data={[...new Array(3).keys()]}
        onSnapToItem={(index) => setCurrent(index)}
        renderItem={({ index }) => <OnboardingItem index={index} />}
      />
      <View style={styles.pointsWrapper}>
        <View
          style={[
            styles.point,
            { backgroundColor: current === 0 ? "#E35883" : "#C8C8D3" },
          ]}
        ></View>
        <View
          style={[
            styles.point,
            { backgroundColor: current === 1 ? "#E35883" : "#C8C8D3" },
          ]}
        ></View>
        <View
          style={[
            styles.point,
            { backgroundColor: current === 2 ? "#E35883" : "#C8C8D3" },
          ]}
        ></View>
      </View>
    </View>
  );
};

const OnboardingItem = ({ index }) => {
  switch (index) {
    case 0:
      return (
        <View style={[styles.itemWrapper, { paddingLeft: 50 }]}>
          <ImageBackground
            source={require("../assets/onboarding_bg_1.png")}
            resizeMode="stretch"
            style={styles.imageBackground}
          >
            <Image
              source={require("../assets/onboarding_man_2.png")}
              resizeMode="cover"
              style={styles.image}
            />
          </ImageBackground>
        </View>
      );
    case 1:
      return (
        <View style={styles.itemWrapper}>
          <ImageBackground
            source={require("../assets/onboarding_bg_2.png")}
            resizeMode="stretch"
            style={styles.imageBackground}
          >
            <Image
              source={require("../assets/onboarding_man_1.png")}
              resizeMode="cover"
              style={styles.image}
            />
          </ImageBackground>
        </View>
      );
    case 2:
      return (
        <View style={styles.itemWrapper}>
          <ImageBackground
            source={require("../assets/onboarding_bg_3.png")}
            resizeMode="stretch"
            style={styles.imageBackground}
          ></ImageBackground>
        </View>
      );
    default:
      return null;
      break;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  itemWrapper: {
    flex: 1,
    marginTop: 50,
    paddingBottom: 50,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    marginLeft: -50,
    marginBottom: -50,
  },
  pointsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Onboarding;
