import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useState, useContext, useRef } from "react";
import { DataContext } from "./Context";
import Carousel from "react-native-reanimated-carousel";

const Onboarding = ({ navigateToRegister }) => {
  const { locale, setLocale } = useContext(DataContext);
  const carouselRef = useRef();
  const { width, height } = Dimensions.get("window");
  const [current, setCurrent] = useState(0);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {locale == "en" ? (
          <TouchableOpacity
            onPress={() => {
              setLocale("fr");
            }}
          >
            <Image
              style={styles.headerIcon}
              source={require("../assets/flagFr.jpg")}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setLocale("en");
            }}
          >
            <Image
              style={styles.headerIcon}
              source={require("../assets/flagEn.png")}
            />
          </TouchableOpacity>
        )}
        <Image source={require("../assets/plug.png")}></Image>
      </View>
      <Carousel
        ref={carouselRef}
        width={width}
        height={height - 200}
        data={[...new Array(3).keys()]}
        onSnapToItem={(index) => {
          setCurrent(index);
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
          if (current >= 2) {
            navigateToRegister();
            // setWasAppOpenedPreviously(true);
          } else {
            carouselRef.current.next();
            setCurrent((current) => {
              return current + 1;
            });
          }
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
          <>
            <Text style={[styles.title, { marginLeft: -50 }]}>
              Explorez Ozalentour !
            </Text>
            <Text style={[styles.description, { marginLeft: -50 }]}>
              Profitez des meilleures activit??s et {"\n"} offres locales
              partag??es par la {"\n"}
              communaut?? !
            </Text>
          </>
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
            Recevez jusqu????? 70% de cashback{"\n"} sur l???ensemble de vos
            paiements{"\n"}
            r??alis??s via Ozalentour !
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
          <Text style={styles.title}>Profitez en communaut?? !</Text>
          <Text style={styles.description}>
            Encaissez de l???argent partout et{"\n"} transf??rez du cash aussi
            simplement{"\n"} qu???un jeu d???enfant !
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 30,
  },
  headerIcon: {
    width: 30,
    height: 30,
  },
  itemWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  imageBackground: {
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
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
    marginTop: "3%",
    marginBottom: "9%",
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
