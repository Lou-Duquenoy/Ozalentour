import { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DataContext } from "../Context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://newapi.test-hauspie.fr";

export default function Profile() {
  const { setScreenName, setMenuPage, locale } = useContext(DataContext);
  const [token, setToken] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  useEffect(() => {
    async function getData() {
      let getToken = await AsyncStorage.getItem("token");
      let getUserFirstName = await AsyncStorage.getItem("firstName");
      let getUserLastName = await AsyncStorage.getItem("lastName");
      let getUserAvatar = await AsyncStorage.getItem("avatar");
      setUserAvatar(getUserAvatar);
      setToken(getToken);
      setUserFirstName(getUserFirstName);
      setUserLastName(getUserLastName);
    }

    getData();
  }, []);

  useEffect(() => {
    token
      ? axios
          .post(
            `${BASE_URL}/user/getData`,

            {
              token: token,
            },
            {
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          )
          .then(async (res) => {
            console.log(res);
            await AsyncStorage.setItem("avatar", res.data.avatar);
          })
      : null;
  }, [token]);

  let userTag = userFirstName.charAt(0);
  userTag = "@" + userTag + userLastName;
  userTag = userTag.toLowerCase();

  useEffect(() => {
    setScreenName("Profile");
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Pressable
            onPress={() => {
              setMenuPage("index");
              setScreenName("Home");
            }}
          >
            <Image
              style={styles.headerIcon}
              source={require("../../assets/arrowHeader.png")}
            />
          </Pressable>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={i18n.t("rechercher")}
          placeholderTextColor="#089baa"
        />
      </View>

      <View>
        <Image
          style={styles.background}
          source={require("../../assets/profileBackground.jpg")}
        />
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: `${BASE_URL}/avatars/${userAvatar}` }}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.userInfos}>
        <Text style={styles.userName}>
          {userFirstName} {userLastName}
        </Text>
        <Text style={styles.userTag}>{userTag}</Text>
        <Text style={styles.userDescription}>{i18n.t("activité")}</Text>
      </View>
      <View style={styles.userStatsContainer}>
        <View style={styles.userStats}>
          <Text style={styles.statTitle}>Posts</Text>
          <Text style={styles.statNumber}>0</Text>
        </View>
        <View style={styles.userStats}>
          <Text style={styles.statTitle}>{i18n.t("likes")}</Text>
          <Text style={styles.statNumber}>0</Text>
        </View>
        <View style={styles.userStats}>
          <Text style={styles.statTitle}>{i18n.t("relations")}</Text>
          <Text style={styles.statNumber}>0</Text>
        </View>
      </View>
      <View style={styles.completeProfile}>
        <Text style={styles.completeText}>{i18n.t("complétezProfile")}</Text>
        <Image
          style={styles.progressBar}
          source={require("../../assets/progressBar.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.presentationContainer}>
        <View style={styles.presentationHeader}>
          <Text style={styles.presentationTitle}>{i18n.t("présentation")}</Text>
          <Image
            style={styles.dots}
            source={require("../../assets/dotsProfile.png")}
            resizeMode="contain"
          />
        </View>

        <View style={styles.presentationContent}>
          <View style={styles.presentationItem}>
            <Image
              style={styles.dots}
              source={require("../../assets/locationProfile.png")}
              resizeMode="contain"
            />
            <Text style={styles.presentationText}>
              {i18n.t("localisation")}
            </Text>
          </View>
          <View style={styles.presentationItem}>
            <Image
              style={styles.dots}
              source={require("../../assets/calendar.png")}
              resizeMode="contain"
            />
            <Text style={styles.presentationText}>{i18n.t("membre")}</Text>
          </View>
          <View style={styles.presentationItem}>
            <Image
              style={styles.dots}
              source={require("../../assets/work.png")}
              resizeMode="contain"
            />
            <Text style={styles.presentationText}>
              {i18n.t("renseignezActivité")}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.photosContainer}>
        <View style={styles.photosHeader}>
          <Text style={styles.photosTitle}>{i18n.t("photosVidéos")}</Text>

          <Image
            style={styles.dots}
            source={require("../../assets/dotsProfile.png")}
            resizeMode="contain"
          />
        </View>
        <View style={styles.picturesContainer}>
          <Image
            style={styles.picture}
            source={require("../../assets/listing.jpg")}
            resizeMode="cover"
          />
          <Image
            style={styles.picture}
            source={require("../../assets/update.jpg")}
            resizeMode="cover"
          />
          <Image
            style={styles.picture}
            source={require("../../assets/telegramGroup.jpg")}
            resizeMode="cover"
          />
          <Image
            style={styles.picture}
            source={require("../../assets/listing2.jpg")}
            resizeMode="cover"
          />
          <Image
            style={styles.picture}
            source={require("../../assets/cryptoPayment.jpg")}
            resizeMode="cover"
          />
          <Image
            style={styles.picture}
            source={require("../../assets/OZA.png")}
            resizeMode="cover"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    zIndex: 3000,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10%",
    padding: "5%",
    width: "100%",
  },

  headerIcon: {
    height: 40,
    width: 40,
  },

  input: {
    backgroundColor: "#ededed",
    borderRadius: 10,

    width: " 70%",
    padding: 5,
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
  },

  background: {
    height: 160,
    width: "100%",
  },

  avatarContainer: {
    position: "absolute",
    bottom: "-32%",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
  },

  upload: {
    position: "absolute",
    top: "27%",
    left: "65%",
    width: 25,
    height: 25,
  },

  uploadPicture: {
    width: "100%",
    height: "100%",
  },

  userInfos: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 55,
  },

  userName: {
    alignItems: "center",
    justifyContent: "center",
    color: "#373945",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "600",
  },

  userTag: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  userDescription: {
    alignItems: "center",
    justifyContent: "center",
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  userStatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },

  userStats: {
    justifyContent: "center",
    alignItems: "center",
  },

  statTitle: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  statNumber: {
    color: "#373945",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
  },

  completeProfile: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  progressBar: {
    height: 20,
    width: 300,
    marginTop: 10,
  },

  completeText: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  presentationContainer: {
    margin: 15,
  },

  presentationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: "#dfdfe6",
    padding: 5,
  },

  presentationTitle: {
    color: "#373945",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
  },

  presentationDots: {
    color: "#373945",
    fontSize: RFPercentage(3),
    fontFamily: "Jost",
  },

  dots: {
    height: 20,
    width: 20,
  },

  presentationContent: {
    marginLeft: 15,
    marginTop: 15,
  },

  presentationItem: {
    flexDirection: "row",
    marginTop: 10,
  },

  presentationText: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    marginLeft: 10,
  },

  photosContainer: {
    margin: 15,
  },

  picturesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },

  photosHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: "#dfdfe6",
    padding: 5,
  },

  photosTitle: {
    color: "#373945",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
  },

  picture: {
    width: 100,
    height: 100,
    borderRadius: 20,
    margin: 10,
  },
});
