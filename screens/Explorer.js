import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { useState, useEffect, useContext, useRef } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DataContext } from "../components/Context";
import Menu from "../components/Menu/Menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Shimmer from "../components/Shimmer";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function Explorer() {
  const {
    setScreenName,
    setMenuPage,
    openMenu,
    setOpenMenu,
    userAvatar,
    setUserAvatar,
    locale,
  } = useContext(DataContext);

  const [view, setView] = useState(locale == "fr" ? "Tous" : "All");
  const [imageLoading, setImageLoading] = useState(true);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  const activitiesSheetRef = useRef(null);
  const snapPoints = ["87%"];

  useEffect(() => {
    setScreenName("Explorer");
    async function getData() {
      let getUserAvatar = await AsyncStorage.getItem("avatar");
      setUserAvatar(getUserAvatar);
    }
    getData();

    const backAction = () => {
      Alert.alert(i18n.t("alert"), [
        {
          text: i18n.t("annuler"),
          onPress: () => null,
          style: "cancel",
        },
        { text: i18n.t("confirmer"), onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const scrollViewRef = useRef();

  useEffect(() => {
    if (view == i18n.t("tous")) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }

    if (view == i18n.t("activités")) {
      scrollViewRef.current.scrollTo({ x: 50, y: 0, animated: true });
    }

    if (view == i18n.t("barEtRestos")) {
      scrollViewRef.current.scrollTo({ x: 130, y: 0, animated: true });
    }

    if (view == i18n.t("commerces")) {
      scrollViewRef.current.scrollTo({ x: 230, y: 0, animated: true });
    }

    if (view == i18n.t("discothèques")) {
      scrollViewRef.current.scrollTo({ x: 325, y: 0, animated: true });
    }

    if (view == i18n.t("bienEtre")) {
      scrollViewRef.current.scrollTo({ x: 425, y: 0, animated: true });
    }

    if (view == i18n.t("événements")) {
      scrollViewRef.current.scrollTo({ x: 600, y: 0, animated: true });
    }

    if (view == i18n.t("logements")) {
      scrollViewRef.current.scrollTo({ x: 900, y: 0, animated: true });
    }

    if (view == i18n.t("santé")) {
      scrollViewRef.current.scrollTo({ x: 1920, y: 0, animated: true });
    }

    if (view == i18n.t("service")) {
      scrollViewRef.current.scrollTo({ x: 2220, y: 0, animated: true });
    }

    if (view == i18n.t("culture")) {
      scrollViewRef.current.scrollTo({ x: 2400, y: 0, animated: true });
    }
  }, [view]);

  return (
    <>
      {openMenu ? <Menu /> : null}

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerButtons}>
            <View style={styles.logoContainer}>
              <TouchableOpacity
                onPress={() => {
                  setOpenMenu(true), setMenuPage("index");
                }}
              >
                <Image
                  source={require("../assets/userPlaceholder.png")}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <Image
                source={require("../assets/ozaLogo.png")}
                style={styles.logo}
              />
            </View>
            <View style={styles.iconsContainer}>
              <Image
                source={require("../assets/geolocation.png")}
                style={styles.headerIcon}
                resizeMode="contain"
              />

              <Image
                source={require("../assets/filter.png")}
                style={styles.headerIcon}
                resizeMode="contain"
              />

              <Image
                source={require("../assets/cart.png")}
                style={styles.headerIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <View style={styles.main} ref={activitiesSheetRef}>
          <View style={styles.navigationContainer}>
            <ScrollView
              style={styles.navScrollView}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
                flexDirection: "row",
              }}
              ref={scrollViewRef}
            >
              <TouchableOpacity
                onPress={() => {
                  setView(i18n.t("tous"));
                }}
                style={styles.navigationItemContainer}
              >
                {view == i18n.t("tous") ? (
                  <Image
                    source={require("../assets/tous-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/tous.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("tous")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("tous")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setView(i18n.t("activités"));
                }}
                style={styles.navigationItemContainer}
              >
                {view == i18n.t("activités") ? (
                  <Image
                    source={require("../assets/activity-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/activity.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("activités")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("activités")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationItemContainer}
                onPress={() => {
                  setView(i18n.t("barEtRestos"));
                }}
              >
                {view == i18n.t("barEtRestos") ? (
                  <Image
                    source={require("../assets/bars-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/bars.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("barEtRestos")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("barEtRestos")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationItemContainer}
                onPress={() => {
                  setView(i18n.t("commerces"));
                }}
              >
                {view == i18n.t("commerces") ? (
                  <Image
                    source={require("../assets/commerces-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/commerces.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("commerces")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("commerces")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationItemContainer}
                onPress={() => {
                  setView(i18n.t("discothèques"));
                }}
              >
                {view == i18n.t("discothèques") ? (
                  <Image
                    source={require("../assets/disco-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/disco.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("discothèques")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("discothèques")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationItemContainer}
                onPress={() => {
                  setView(i18n.t("bienEtre"));
                }}
              >
                {view == i18n.t("bienEtre") ? (
                  <Image
                    source={require("../assets/bienEtre-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/bienEtre.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("bienEtre")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("bienEtre")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationItemContainer}
                onPress={() => {
                  setView(i18n.t("événements"));
                }}
              >
                {view == i18n.t("événements") ? (
                  <Image
                    source={require("../assets/event-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/event.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("événements")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("événements")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationItemContainer}
                onPress={() => {
                  setView(i18n.t("logements"));
                }}
              >
                {view == i18n.t("logements") ? (
                  <Image
                    source={require("../assets/logement-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/logement.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("logements")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("logements")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationItemContainer}
                onPress={() => {
                  setView(i18n.t("santé"));
                }}
              >
                {view == i18n.t("santé") ? (
                  <Image
                    source={require("../assets/sante-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/sante.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("santé")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("santé")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationItemContainer}
                onPress={() => {
                  setView(i18n.t("services"));
                }}
              >
                {view == i18n.t("services") ? (
                  <Image
                    source={require("../assets/services-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/services.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("services")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("services")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationItemContainer}
                onPress={() => {
                  setView(i18n.t("culture"));
                }}
              >
                {view == i18n.t("culture") ? (
                  <Image
                    source={require("../assets/visites-active.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/visites.png")}
                    style={styles.navIcon}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={
                    view == i18n.t("culture")
                      ? styles.navTextActive
                      : styles.navText
                  }
                >
                  {i18n.t("culture")}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.scrollViewContainer}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.activityContainer}>
                {/*  <View
                    style={
                      imageLoading
                        ? styles.carouselActive
                        : styles.carouselShimmer
                    }
                  >
                    <Shimmer />
                  </View> */}

                <Image
                  source={require("../assets/house.jpg")}
                  style={
                    /*  imageLoading ? styles.carousel : */ styles.carouselActive
                  }
                  resizeMode="cover"
                  /* onLoadEnd={() => {
                      setImageLoading(false);
                    }} */
                />

                <View style={styles.activityHeader}>
                  <View style={styles.activityHeaderLeft}>
                    <Image
                      source={require("../assets/location.png")}
                      style={styles.location}
                      resizeMode="cover"
                    />
                    <Text style={styles.activityText}>
                      Lille (Hauts de France)
                    </Text>
                  </View>

                  <Image
                    source={require("../assets/signet.png")}
                    style={styles.signet}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.activityInfos}>
                  <View style={styles.activityDescription}>
                    <Text style={styles.activityTitle}>Maison de 184 m2</Text>
                    <Text style={styles.activityText}> Du 5 au 12 juin</Text>
                    <Text style={styles.activityText}>299 €EUR / nuit</Text>
                  </View>
                  <View style={styles.activityLike}>
                    <Image
                      source={require("../assets/heart.png")}
                      style={styles.heart}
                      resizeMode="cover"
                    />
                    <Text style={styles.activityText}>135</Text>
                  </View>
                </View>
              </View>

              <View style={styles.activityContainer}>
                {/* <View
                    style={
                      imageLoading
                        ? styles.carouselActive
                        : styles.carouselShimmer
                    }
                  >
                    <Shimmer />
                  </View> */}

                <Image
                  source={require("../assets/alpine.jpeg")}
                  style={
                    /*  imageLoading ? styles.carousel : */ styles.carouselActive
                  }
                  resizeMode="cover"
                  /*  onLoadEnd={() => {
                      setImageLoading(false);
                    }} */
                />
                <View style={styles.activityHeader}>
                  <View style={styles.activityHeaderLeft}>
                    <Image
                      source={require("../assets/location.png")}
                      style={styles.location}
                      resizeMode="cover"
                    />
                    <Text style={styles.activityText}>Le Mans (Sarthe)</Text>
                  </View>

                  <Image
                    source={require("../assets/signet.png")}
                    style={styles.signet}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.activityInfos}>
                  <View style={styles.activityDescription}>
                    <Text style={styles.activityTitle}>
                      Stage de pilotage Alpine
                    </Text>
                    <Text style={styles.activityText}>Tous les mercredis</Text>
                    <Text style={styles.activityText}>89 €EUR / heure</Text>
                  </View>
                  <View style={styles.activityLike}>
                    <Image
                      source={require("../assets/heart.png")}
                      style={styles.heart}
                      resizeMode="cover"
                    />
                    <Text style={styles.activityText}>342</Text>
                  </View>
                </View>
              </View>

              <View style={styles.activityContainer}>
                {/* <View
                    style={
                      imageLoading
                        ? styles.carouselActive
                        : styles.carouselShimmer
                    }
                  >
                    <Shimmer />
                  </View> */}

                <Image
                  source={require("../assets/beffroi.jpg")}
                  style={
                    /* imageLoading ? styles.carousel : */ styles.carouselActive
                  }
                  resizeMode="cover"
                  /* onLoadEnd={() => {
                      setImageLoading(false);
                    }} */
                />
                <View style={styles.activityHeader}>
                  <View style={styles.activityHeaderLeft}>
                    <Image
                      source={require("../assets/location.png")}
                      style={styles.location}
                      resizeMode="cover"
                    />
                    <Text style={styles.activityText}>
                      Lille (Hauts de France)
                    </Text>
                  </View>

                  <Image
                    source={require("../assets/signet.png")}
                    style={styles.signet}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.activityInfos}>
                  <View style={styles.activityDescription}>
                    <Text style={styles.activityTitle}>
                      Le Beffroi de Lille
                    </Text>
                    <Text style={styles.activityText}>Tous les jours</Text>
                    <Text style={styles.activityText}>Dès 5 €EUR</Text>
                  </View>
                  <View style={styles.activityLike}>
                    <Image
                      source={require("../assets/heart.png")}
                      style={styles.heart}
                      resizeMode="cover"
                    />
                    <Text style={styles.activityText}>135</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#373945",
    paddingBottom: "8%",
  },

  header: {
    width: "100%",
    paddingTop: "16%",
    marginBottom: "8%",
    paddingLeft: "5%",
    paddingRight: "5%",
    backgroundColor: "#373945",
  },

  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    height: 28,
    width: 28,
    borderRadius: 50,
    marginRight: 10,
  },

  logo: {
    height: 18,
    width: 113,
  },

  headerIcon: {
    height: 20,
    width: 20,
    marginRight: 10,
  },

  main: {
    width: "100%",
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: "3%",
  },

  navigationContainer: {
    width: "100%",

    flexDirection: "row",
    alignitems: "center",
    justifyContent: "center",
    paddingBottom: "3%",
    paddingLeft: "3%",
  },

  navScrollView: {
    width: "100%",
  },

  navigationItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 10,
  },

  navTextActive: {
    fontSize: RFPercentage(1.4),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#3f3f42",
    margin: 10,
  },

  navText: {
    fontSize: RFPercentage(1.4),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#909196",
    margin: 10,
  },

  navIcon: {
    width: 25,
    height: 25,
  },

  activityContainer: {
    marginTop: 5,
    marginBottom: 25,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  activityHeader: {
    marginTop: 10,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    padding: 10,
  },

  activityHeaderLeft: {
    flexDirection: "row",
  },

  carouselActive: {
    width: "90%",
    height: 500,
    borderRadius: 10,
    position: "relative",
  },

  carouselShimmer: {
    display: "none",
  },

  carousel: {
    width: 0,
    height: 0,
    borderRadius: 10,
    position: "relative",
    visibility: "hidden",
  },

  activityInfos: {
    marginTop: 10,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    padding: 10,
  },

  location: {
    marginRight: 4,
    width: 20,
    height: 20,
  },

  signet: {
    width: 20,
    height: 20,
  },

  activityTitle: {
    color: "#FFFFFF",
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
  },

  activityText: {
    color: "#FFFFFF",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  activityLike: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  heart: {
    marginRight: 4,
    width: 20,
    height: 20,
  },

  content: {
    paddingBottom: "9%",
  },

  scrollView: {
    height: "100%",
    // IOS paddingBottom: "32%",
    backgroundColor: "#FFFFFF",
  },

  scrollViewContainer: {
    height: "85%",
    paddingBottom: "5%",
  },

  categoryContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#ffffff",
    margin: 5,
    padding: 6,
    borderWidth: 1,
    borderColor: "#C7C7C7",
  },

  categoryContainerAll: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 18,
    backgroundColor: "#0EA1B1",
    margin: 5,
    padding: 6,
    borderWidth: 1,
    borderColor: "#0EA1B1",
  },

  scrollViewText: {
    fontSize: RFPercentage(1.5),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#5c5b5b",
  },

  scrollViewTextAll: {
    fontSize: RFPercentage(1.5),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#ffffff",
  },

  dividerText: {
    marginLeft: "5%",
    color: "#000000",
  },

  companyContainer: {
    height: "auto",
    borderColor: "#C7C7C7",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: "5%",
    marginRight: "3%",
    marginLeft: "3%",
    position: "relative",
  },

  companyLogo: {
    borderRadius: 100,
    position: "absolute",
    left: "40%",
    top: "22%",
    zIndex: 3000,
    width: 70,
    height: 70,
  },

  company: {
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#ffffff",
    width: 70,
    height: 70,
  },

  pictureContainer: {
    height: 100,
  },

  companyInfos: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: 80,
  },

  companyInfosLeft: {
    justifyContent: "flex-start",
    padding: "2%",
    backgroundColor: "#ffffff",
    paddingTop: "5%",
    paddingLeft: "2%",
    width: "55%",
    height: "100%",
    borderBottomLeftRadius: 8,
  },

  companyInfosRight: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: "4%",
    paddingRight: "2%",
    backgroundColor: "#ffffff",
    width: "45%",
    height: "100%",
    borderBottomRightRadius: 8,
  },

  companyTextH1: {
    fontSize: RFPercentage(2.2),
    fontFamily: "JostBold",
    color: "#1F1F1F",
  },

  companyTextH2: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    fontFamily: "Jost",
    color: "#1F1F1F",
  },

  companyText: {
    fontSize: RFPercentage(1.6),
    marginTop: "5%",
    marginBottom: "5%",
    fontFamily: "Jost",
    color: "#1F1F1F",
  },

  companyPrice: {
    fontSize: RFPercentage(1.8),
    marginTop: "5%",
    color: "#ED496A",
    fontFamily: "JostBold",
  },

  companyPer: {
    fontSize: RFPercentage(1.8),
    marginTop: "2%",
    color: "#000000",
    fontFamily: "JostBold",
  },

  companyRateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "2%",
  },

  companyRate: {
    fontSize: RFPercentage(1.8),
    marginTop: "5%",
    color: "#FFB200",
    fontFamily: "Jost",
  },

  /*   star: {
      resizeMode: "cover",
      width: 15,
      height: 15,
      marginRight: "4%",
      marginTop: "3%",
    },
   */
  image: {
    height: "100%",
  },

  bubble: {
    position: "absolute",
    bottom: -200,
    right: 20,
    width: 60,
  },
});
