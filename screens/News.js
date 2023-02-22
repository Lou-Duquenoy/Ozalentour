import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { useState, useEffect, useContext, useRef } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DataContext } from "../components/Context";
import Menu from "../components/Menu/Menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet from "@gorhom/bottom-sheet";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function News() {
  const {
    setScreenName,
    setMenuPage,
    openMenu,
    setOpenMenu,
    userAvatar,
    setUserAvatar,
    locale,
  } = useContext(DataContext);

  const [view, setView] = useState("tout");
  const feedSheetRef = useRef(null);
  const snapPoints = ["87%"];

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  useEffect(() => {
    setScreenName("News");

    async function getData() {
      let getUserAvatar = await AsyncStorage.getItem("avatar");
      setUserAvatar(getUserAvatar);
    }

    getData();

    const backAction = () => {
      Alert.alert(
        "Un instant !",
        "Voulez-vous vraiment quitter l'application?",
        [
          {
            text: "Annuler",
            onPress: () => null,
            style: "cancel",
          },
          { text: "Confirmer", onPress: () => BackHandler.exitApp() },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

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
        <BottomSheet
          ref={feedSheetRef}
          snapPoints={snapPoints}
          handleIndicatorStyle={{ display: "none" }}
        >
          <View style={styles.main}>
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={
                  view == "tout" ? styles.navigationActive : styles.navigation
                }
                onPress={() => {
                  setView("tout");
                }}
              >
                <Text style={styles.navText}>{i18n.t("tout")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  view == "photos" ? styles.navigationActive : styles.navigation
                }
                onPress={() => {
                  setView("photos");
                }}
              >
                <Text style={styles.navText}>{i18n.t("photos")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  view == "vidéos" ? styles.navigationActive : styles.navigation
                }
                onPress={() => {
                  setView("vidéos");
                }}
              >
                <Text style={styles.navText}>{i18n.t("vidéos")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  view == "temps forts"
                    ? styles.navigationActive
                    : styles.navigation
                }
                onPress={() => {
                  setView("temps forts");
                }}
              >
                <Text style={styles.navText}>{i18n.t("tempsForts")}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.content}>
                <Image
                  source={require("../assets/avatar1.jpeg")}
                  style={styles.userImage}
                />
                <View style={styles.post}>
                  <View style={styles.postContainer}>
                    <View style={styles.postInfosContainer}>
                      <Text style={styles.postUser}> Jordan Michael</Text>
                      <Text style={styles.postInfos}> @jmichael</Text>
                      <Text style={styles.postInfos}>
                        {" "}
                        {i18n.t("ilYa2jours")}
                      </Text>
                    </View>
                    <View style={styles.postContent}>
                      <Text style={styles.postText}> {i18n.t("tropFort")}</Text>
                      <Image
                        source={require("../assets/shopping.jpg")}
                        style={styles.postImage}
                      />
                    </View>
                  </View>
                  <View style={styles.social}>
                    <Image
                      source={require("../assets/commenter.png")}
                      style={styles.commentBubble}
                    />
                    <Text style={styles.comment}> {i18n.t("commenter")}</Text>
                    <Text style={styles.commentNumber}> 150</Text>
                    <Image
                      source={require("../assets/heart.png")}
                      style={styles.like}
                    />
                  </View>
                  <View style={styles.post}>
                    <View style={styles.postContainer}>
                      <View style={styles.postInfosContainer}>
                        <Text style={styles.postUser}> Jordan Michael</Text>
                        <Text style={styles.postInfos}> @jmichael</Text>
                        <Text style={styles.postInfos}>
                          {" "}
                          {i18n.t("ilYa2jours")}
                        </Text>
                      </View>
                      <View style={styles.postContent}>
                        <Text style={styles.postText}>
                          {" "}
                          <Text style={styles.postTextSpan}>
                            Jordan Michael
                          </Text>{" "}
                          {i18n.t("et")}{" "}
                          <Text style={styles.postTextSpan}>Thomas Dupont</Text>{" "}
                          {i18n.t("relation")}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.social}>
                      <Image
                        source={require("../assets/commenter.png")}
                        style={styles.commentBubble}
                      />
                      <Text style={styles.comment}>{i18n.t("commenter")}</Text>
                      <Text style={styles.toLike}>
                        {" "}
                        {i18n.t("coupDeCoeur")}
                      </Text>
                      <Image
                        source={require("../assets/heartBlack.png")}
                        style={styles.like}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </BottomSheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#373945",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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

  navigationContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "3%",
    marginBottom: "2%",
  },

  navigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "1%",
  },

  navigationActive: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: "#373945",
    borderBottomWidth: 2,
    padding: "1%",
  },

  navText: {
    fontSize: RFPercentage(1.8),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#373945",
    marginBottom: 3,
  },

  main: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "100%",
  },

  content: {
    display: "flex",
    flexDirection: "row",
    marginTop: "5%",
    marginRight: "3%",
    marginLeft: "3%",
  },

  post: {
    flex: 1,
  },

  postContainer: {
    backgroundColor: "#F4F4F4",
    padding: "5%",
    borderRadius: 8,
    marginBottom: "6%",
  },

  postUser: {
    fontSize: RFPercentage(1.6),
    fontFamily: "JostBold",
    color: "#1F1F1F",
  },

  postInfosContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginBottom: "5%",
  },

  postInfos: {
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
    color: "#1F1F1F",
  },

  postText: {
    marginBottom: "5%",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    color: "#1F1F1F",
  },

  postTextSpan: {
    fontSize: RFPercentage(2),
    fontFamily: "JostBold",
    color: "#1F1F1F",
  },

  postImage: {
    width: "100%",
  },

  userImage: {
    height: 40,
    width: 40,
    marginRight: "2%",
    borderRadius: 100,
  },

  social: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: "5%",
  },

  comment: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#1F1F1F",
  },

  commentNumber: {
    fontSize: RFPercentage(1.8),
    color: "#F9595F",
    fontFamily: "Jost",
    marginLeft: 120,
  },

  toLike: {
    fontSize: RFPercentage(1.8),
    color: "#1F1F1F",
    fontFamily: "Jost",
    marginLeft: 80,
  },

  like: {
    height: 20,
    width: 20,
  },

  commentBubble: {
    height: 20,
    width: 20,
  },

  bubble: {
    position: "absolute",
    bottom: -200,
    right: 20,
    width: 60,
  },
});
