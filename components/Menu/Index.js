import { useState, useEffect, useContext } from "react";
import { DataContext } from "../Context";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotAvailable from "../NotAvailable";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function MenuHome() {
  const {
    setOpenMenu,
    setMenuPage,
    setLogin,
    userAvatar,
    setUserAvatar,
    setOpenRecharge,
    locale,
    setLocale,
    showNotAvailable,
    setShowNotAvailable,
  } = useContext(DataContext);

  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  useEffect(() => {
    async function getData() {
      let getUserFirstName = await AsyncStorage.getItem("firstName");
      let getUserLastName = await AsyncStorage.getItem("lastName");
      let getUserAvatar = await AsyncStorage.getItem("avatar");
      setUserFirstName(getUserFirstName);
      setUserLastName(getUserLastName);
      setUserAvatar(getUserAvatar);
    }
    getData();
  }, []);

  let userTag = userFirstName.charAt(0);
  userTag = "@" + userTag + userLastName;
  userTag = userTag.toLowerCase();

  const logout = () => {
    AsyncStorage.removeItem("EUR");
    AsyncStorage.removeItem("firstName");
    AsyncStorage.removeItem("lastName");
    AsyncStorage.removeItem("walletId");
    AsyncStorage.removeItem("avatar");
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("BSCWallet");
    AsyncStorage.removeItem("BSCAmount");

    setMenuPage(false);
    setOpenMenu(false);
    setLogin(0);
  };

  return (
    <>
      {showNotAvailable ? <NotAvailable /> : null}

      <View style={styles.container}>
        <View style={styles.menu}>
          <View style={styles.menuHeader}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                onPress={() => {
                  setOpenMenu(false), setMenuPage("");
                }}
              >
                <Image
                  style={styles.arrow}
                  source={require("../../assets/arrowHeader.png")}
                />
              </TouchableOpacity>
              {locale == "en" ? (
                <TouchableOpacity
                  onPress={() => {
                    setLocale("fr");
                  }}
                >
                  <Image
                    style={{ height: 30, width: 30 }}
                    source={require("../../assets/flagFr.jpg")}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setLocale("en");
                  }}
                >
                  <Image
                    style={{ height: 30, width: 30 }}
                    source={require("../../assets/flagEn.png")}
                  />
                </TouchableOpacity>
              )}
              <View style={styles.headerTopRightButtons}>
                <TouchableOpacity>
                  <Image
                    style={styles.topRightIcon}
                    source={require("../../assets/gear.png")}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={logout}>
                  <Image
                    style={styles.topRightIcon}
                    source={require("../../assets/logout.png")}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.headerBottom}>
              <Image
                style={styles.avatar}
                source={require("../../assets/userPlaceholder.png")}
                resizeMode="cover"
              />

              <View style={styles.headerBottomText}>
                <Text style={styles.userName}>
                  {" "}
                  {userFirstName} {userLastName}
                </Text>
                <Text style={styles.tag}> {userTag}</Text>
              </View>
            </View>
          </View>
          <View style={styles.menuNavigation}>
            <TouchableOpacity
              style={styles.navigationLink}
              onPress={() => setShowNotAvailable(true)}
            >
              <View style={styles.navigationLinkLeft}>
                <Image
                  style={styles.menuNavigationIcon}
                  source={require("../../assets/profile.png")}
                  resizeMode="contain"
                />

                <Text style={styles.navigationText}>
                  {i18n.t("voirProfil")}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationLink}
              onPress={() => setShowNotAvailable(true)}
            >
              <View style={styles.navigationLinkLeft}>
                <Image
                  style={styles.menuNavigationIcon}
                  source={require("../../assets/megaphone.png")}
                  resizeMode="contain"
                />

                <Text style={styles.navigationText}>{i18n.t("espacePro")}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationLink}
              onPress={() => setShowNotAvailable(true)}
            >
              <View style={styles.navigationLinkLeft}>
                <Image
                  style={styles.menuNavigationIcon}
                  source={require("../../assets/orders.png")}
                  resizeMode="contain"
                />

                <Text style={styles.navigationText}>
                  {i18n.t("voirCommandes")}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navigationLink}
              onPress={() => setShowNotAvailable(true)}
            >
              <View style={styles.navigationLinkLeft}>
                <Image
                  style={styles.menuNavigationIcon}
                  source={require("../../assets/stats.png")}
                  resizeMode="contain"
                />

                <Text style={styles.navigationText}>{i18n.t("stats")}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navigationLink}
              onPress={() => setShowNotAvailable(true)}
            >
              <View style={styles.navigationLinkLeft}>
                <Image
                  style={styles.menuNavigationIcon}
                  source={require("../../assets/friends.png")}
                  resizeMode="contain"
                />

                <Text style={styles.navigationText}>{i18n.t("amis")}</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
            style={styles.navigationLink}
            onPress={() => setMenuPage("settings")}
          >
            <View style={styles.navigationLinkLeft}>
              <Image
                style={styles.menuNavigationIcon}
                source={require("../../assets/gear.png")}
                resizeMode="contain"
              />

              <Text style={styles.navigationText}>Modifier mes informations</Text>
            </View>
          </TouchableOpacity>    */}
          </View>

          <View style={styles.menuFooterVerifyContainer}>
            <Image
              style={styles.EURIcon}
              source={require("../../assets/EUR.jpg")}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => {
                setOpenMenu(false), setOpenRecharge(true), setMenuPage("");
              }}
            >
              <Text style={styles.footerText}>
                {i18n.t("cryptoLife")} {i18n.t("profitez")}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}></View>
            <View style={styles.menuFooterVerify}>
              <Image
                style={styles.menuFooterShield}
                source={require("../../assets/shield.png")}
                resizeMode="contain"
              />

              <Text style={styles.footerTextVerify}>
                {i18n.t("vérifierCompte")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#16192c",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 10,
    zIndex: 6000,
  },

  menu: {
    backgroundColor: "#373945",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
  },

  footerText: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#FFFFFF",
    color: "#FFFFFF",
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
    marginTop: 30,
  },

  footerTextVerify: {
    justifyContent: "center",
    alignItems: "center",
    color: "#FFFFFF",
    color: "#FFFFFF",
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
  },

  divider: {
    width: "60%",
    height: "1%",
    borderBottomWidth: 1,
    borderColor: "#373945",
    marginTop: "10%",
    marginBottom: "10%",
  },

  menuHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#929296",
    padding: 10,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "15%",
  },

  headerTopRightButtons: {
    flexDirection: "row",
    with: "20%",
  },

  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "8%",
  },

  headerBottomText: {
    marginRight: 139,
  },

  userName: {
    color: "#FFFFFF",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
  },

  tag: {
    color: "#FFFFFF",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  logoutIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },

  title: {
    color: "#373945",
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    marginTop: 10,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: "5%",
  },

  arrow: {
    width: 40,
    height: 40,
  },

  topRightIcon: {
    width: 25,
    height: 25,
    marginRight: 15,
  },

  menuNavigation: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    flexGrow: 1,
    paddingTop: "10%",
  },

  navigationLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    margin: "4%",
  },

  navigationLinkLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  navigationText: {
    color: "#FFFFFF",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  navigationTextFalse: {
    color: "#606378",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  menuNavigationIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
  },

  menuNavigationArrow: {
    width: 10,
    height: 10,
    marginRight: 20,
  },

  menuFooter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: " 100%",
    height: "10%",
    padding: 10,
  },

  menuFooterVerifyContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "75%",
    height: "22%",
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#00b8c5",
    marginBottom: "4%",
  },

  menuFooterVerify: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "65%",
  },

  EURIcon: {
    position: "absolute",
    top: -30,
    width: 65,
    height: 65,
    borderRadius: 100,
  },

  menuFooterShield: {
    width: 20,
    height: 20,
  },

  langText: {
    color: "#FFFFFF",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  langButtonFR: {
    width: 30,
    height: 20,
    marginRight: 10,
    borderRadius: 50,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00b8c5",
  },

  langButtonEN: {
    width: 30,
    height: 20,
    marginRight: 10,
    borderRadius: 50,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e15a83",
  },
});
