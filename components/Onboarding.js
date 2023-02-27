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
        height={height * 0.8}
        data={[...new Array(3).keys()]}
        onSnapToItem={(index) => {
          setCurrent(index);
          // if (index === 3 && current != 0) {
          //   navigateToRegister();
          // }
        }}
        renderItem={({ index }) => <OnboardingItem index={index} />}
        style={{ flex: 1 }}
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
      <TouchableOpacity
        onPress={() => {
          setCurrent((current) => {
            if (current >= 2) {
              navigateToRegister();
            } else {
              return current + 1;
            }
          });
        }}
        style={styles.buttonWrapper}
      >
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
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
              style={[styles.image, { marginLeft: -50 }]}
            />
          </ImageBackground>
          <Text style={[styles.title, { marginLeft: -50 }]}>
            Explorez Ozalentour !
          </Text>
          <Text style={[styles.description, { marginLeft: -50 }]}>
            Profitez des meilleures activités et {"\n"} offres locales partagées
            par la {"\n"}
            communauté !
          </Text>
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
          <Text style={styles.title}>Trouvez vos Bons Plans !</Text>
          <Text style={styles.description}>
            Recevez jusqu’à 70% de cashback{"\n"} sur l’ensemble de vos
            paiements{"\n"}
            réalisés via Ozalentour !
          </Text>
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
          <Text style={styles.title}>Profitez en communauté !</Text>
          <Text style={styles.description}>
            Encaissez de l’argent partout et{"\n"} transférez du cash aussi
            simplement{"\n"} qu’un jeu d’enfant !
          </Text>
        </View>
      );
    default:
      return null;
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
    marginBottom: -50,
  },
  title: {
    paddingTop: 100,
    fontFamily: "MontserratSemiBold",
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: 30,
    paddingVertical: 11,
    color: "rgba(39, 36, 89, 1)",
  },
  description: {
    paddingHorizontal: 30,
    paddingVertical: 11,
    fontFamily: "MontserratRegular",
    fontSize: 16,
    textAlign: "center",
    color: "rgba(117, 117, 158, 1)",
    lineHeight: 22,
  },
  pointsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    marginBottom: 78,
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonWrapper: {
    height: 44,
    backgroundColor: "#00B9C7",
    borderRadius: 22,
    marginHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  buttonText: {
    color: "rgba(255, 255, 255, 1)",
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
});

export default Onboarding;
