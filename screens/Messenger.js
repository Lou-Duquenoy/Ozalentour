import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import { useState, useEffect, useContext, useRef } from "react";
import { DataContext } from "../components/Context";
import NotificationModal from "../components/NotificationModal";
import { RFPercentage } from "react-native-responsive-fontsize";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Menu from "../components/Menu/Menu";
import BottomSheet from "@gorhom/bottom-sheet";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function Messenger() {
  const {
    setScreenName,
    notifModal,
    setNotifModal,
    setMenuPage,
    openMenu,
    setOpenMenu,
    userAvatar,
    setUserAvatar,
    refreshNotifications,
    setRefreshNotifications,
    locale,
  } = useContext(DataContext);

  const [notif, setNotif] = useState([]);
  const [message, setMessage] = useState([]);
  const [view, setView] = useState("messages");
  const [navView, setNavView] = useState("tout");
  const [notifData, setNotifData] = useState([]);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  const messengerSheetRef = useRef(null);
  const snapPoints = ["87%"];

  useEffect(() => {
    setScreenName("Messenger");
    async function getData() {
      let getUserAvatar = await AsyncStorage.getItem("avatar");
      setUserAvatar(getUserAvatar);
    }

    getData();

    getNotif();

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

  async function getNotif() {
    let getToken = await AsyncStorage.getItem("token");

    axios
      .post(
        `${BASE_URL}/user/readNotifications`,

        {
          token: getToken,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (res) {
        setNotif(res.data.reverse());
      });
  }

  useEffect(() => {
    getNotif();
  }, [refreshNotifications]);

  const showNotifModal = (data) => {
    console.log(data);
    setNotifData(data);
    setNotifModal(true);
  };

  console.log(notif);
  return (
    <>
      {openMenu ? <Menu /> : null}
      {notifModal ? <NotificationModal props={notifData} /> : null}
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

        {view == "messages" ? (
          <>
            <BottomSheet
              ref={messengerSheetRef}
              snapPoints={snapPoints}
              handleIndicatorStyle={{ display: "none" }}
            >
              <View style={styles.main}>
                <View style={styles.notificationsContainer}>
                  <TouchableOpacity onPress={() => setView("notifications")}>
                    <Image
                      source={require("../assets/bellGrey.png")}
                      style={styles.notif}
                    />
                  </TouchableOpacity>

                  <Text style={styles.notifText}>Notifications</Text>
                  <View style={styles.notifNumber}>
                    <Text style={styles.notifNumberText}>{notif.length}</Text>
                  </View>
                </View>
                <View style={styles.navigationContainer}>
                  <TouchableOpacity
                    style={
                      navView == i18n.t("tout")
                        ? styles.navigationActive
                        : styles.navigation
                    }
                    onPress={() => {
                      setNavView(i18n.t("tout"));
                    }}
                  >
                    <Text style={styles.navText}>{i18n.t("tout")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      navView == "perso"
                        ? styles.navigationActive
                        : styles.navigation
                    }
                    onPress={() => {
                      setNavView("perso");
                    }}
                  >
                    <Text style={styles.navText}>Perso</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      navView == "pro"
                        ? styles.navigationActive
                        : styles.navigation
                    }
                    onPress={() => {
                      setNavView("pro");
                    }}
                  >
                    <Text style={styles.navText}>Pro</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      navView == i18n.t("groupes")
                        ? styles.navigationActive
                        : styles.navigation
                    }
                    onPress={() => {
                      setNavView(i18n.t("groupes"));
                    }}
                  >
                    <Text style={styles.navText}>{i18n.t("groupes")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheet>
          </>
        ) : (
          <>
            <BottomSheet
              ref={messengerSheetRef}
              snapPoints={snapPoints}
              handleIndicatorStyle={{ display: "none" }}
            >
              <View style={styles.main}>
                <View style={styles.notificationsContainerFocus}>
                  <TouchableOpacity onPress={() => setView("messages")}>
                    <Image
                      source={require("../assets/arrowHeader.png")}
                      style={styles.message}
                    />
                  </TouchableOpacity>

                  <Text style={styles.notifTextFocus}>Notifications</Text>
                  <View style={styles.notifNumberFocus}>
                    <Text style={styles.notifNumberText}>{notif.length}</Text>
                  </View>
                </View>

                {notif.map((notif, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.notification}
                      onPress={() => {
                        showNotifModal(notif);
                      }}
                    >
                      <Image
                        source={require("../assets/bell.png")}
                        style={styles.notif}
                      />
                      <Text style={styles.notifDataText}>
                        {notif.data.text.substring(0, 40)} ...
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </BottomSheet>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#373945",
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

  notificationsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "10%",
    padding: 20,
    backgroundColor: "rgba(146, 147, 152, .3)",
    borderRadius: 20,
  },

  notificationsContainerFocus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "10%",
    padding: 20,
    backgroundColor: "rgba(130, 199, 207, .2)",
    borderRadius: 20,
  },

  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  notif: {
    width: 40,
    height: 40,
  },

  message: {
    width: 40,
    height: 40,
  },

  notifText: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
  },

  notifTextFocus: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#089baa",
  },

  notifNumber: {
    justifyContent: "center",
    alignItems: "center",
    width: 25,
    height: 25,
    backgroundColor: "#373945",
    borderRadius: 30,
    padding: 5,
  },

  notifNumberFocus: {
    justifyContent: "center",
    alignItems: "center",
    width: 25,
    height: 25,
    backgroundColor: "#089baa",
    borderRadius: 30,
    padding: 5,
  },

  notifNumberText: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    color: "#FFFFFF",
  },

  notification: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "10%",
    padding: 20,
  },

  notifDataText: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    color: "#373945",
  },
});
