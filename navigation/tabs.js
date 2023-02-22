import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, Image } from "react-native";
import News from "../screens/News";
import Explorer from "../screens/Explorer";
import Home from "../screens/Home";
import Scanner from "../screens/Scanner";
import Search from "../screens/Search";
import Publish from "../screens/Publish";
import Write from "../screens/Write";
import Messenger from "../screens/Messenger";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DataContext } from "../components/Context";
import { useState, useContext, useEffect } from "react";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const {
    login,
    screenName,
    openRecharge,
    openCollect,
    openAskCash,
    openTransfer,
    openConvert,
    menuPage,
    notifModal,
    locale,
    openConnectBSCWallet,
  } = useContext(DataContext);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          display:
            login != 1 ||
            openRecharge ||
            openCollect ||
            openAskCash ||
            openConvert ||
            openTransfer ||
            notifModal ||
            openConnectBSCWallet ||
            menuPage == "index" ||
            menuPage == "profile" ||
            menuPage == "settings"
              ? "none"
              : "flex",
          backgroundColor: "#FFFFFF",
          position: "absolute",
          borderTopColor: "transparent",
          //ANDROID
          //height: "8%",
          //IOS
          height: "11%",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          unmountOnBlur: true,
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#373945" : "#75787d",
                fontFamily: "Jost",
                fontWeight: "700",
                fontSize: RFPercentage(1.2),
                // ANDROID
                marginTop: -10,
                marginBottom: 10,
              }}
            >
              {i18n.t("accueil")}
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={require("../assets/home-active.png")}
                style={{ width: 20, height: 20 }}
              />
            ) : (
              <Image
                source={require("../assets/home.png")}
                style={{ width: 20, height: 20 }}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Explorer"
        component={Explorer}
        options={{
          unmountOnBlur: true,
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#373945" : "#75787d",
                fontFamily: "Jost",
                fontWeight: "700",
                fontSize: RFPercentage(1.2),
                // ANDROID
                marginTop: -10,
                marginBottom: 10,
              }}
            >
              {i18n.t("marchés")}
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={require("../assets/explorer-active.png")}
                style={{ width: 20, height: 20 }}
              />
            ) : (
              <Image
                source={require("../assets/explorer.png")}
                style={{ width: 20, height: 20 }}
              />
            ),
        }}
      />

      {(() => {
        switch (screenName) {
          case "Home":
            return (
              <Tab.Screen
                name="Scanner"
                component={Scanner}
                options={{
                  unmountOnBlur: true,
                  tabBarLabel: ({ focused }) => (
                    <Text
                      style={{
                        color: "transparent",
                      }}
                    >
                      SCANNER
                    </Text>
                  ),
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={{
                        width: 55,
                        height: 55,
                        backgroundColor: "#089baa",
                        borderRadius: 50,
                        // IOS marginBottom: 14,
                        marginBottom: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/scanner-blanc.png")}
                        style={{ width: 28, height: 28 }}
                      />
                    </View>
                  ),
                }}
              />
            );
          case "Explorer":
            return (
              <Tab.Screen
                name="Search"
                component={Search}
                options={{
                  unmountOnBlur: true,
                  tabBarLabel: ({ focused }) => (
                    <Text
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      SEARCH
                    </Text>
                  ),
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={{
                        width: 55,
                        height: 55,
                        backgroundColor: "#089baa",
                        borderRadius: 50,
                        marginBottom: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/glass-white.png")}
                        style={{ width: 28, height: 28 }}
                      />
                    </View>
                  ),
                }}
              />
            );
          case "News":
            return (
              <Tab.Screen
                name="Publish"
                component={Publish}
                options={{
                  unmountOnBlur: true,
                  tabBarLabel: ({ focused }) => (
                    <Text
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      PUBLISH
                    </Text>
                  ),
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={{
                        width: 55,
                        height: 55,
                        backgroundColor: "#089baa",
                        borderRadius: 50,
                        marginBottom: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/add.png")}
                        style={{ width: 28, height: 28 }}
                      />
                    </View>
                  ),
                }}
              />
            );
          case "Messenger":
            return (
              <Tab.Screen
                name="Write"
                component={Write}
                options={{
                  unmountOnBlur: true,
                  tabBarLabel: ({ focused }) => (
                    <Text
                      style={{
                        color: "transparent",
                      }}
                    >
                      MESSENGER
                    </Text>
                  ),
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={{
                        width: 55,
                        height: 55,
                        backgroundColor: "#089baa",
                        borderRadius: 50,
                        // IOS
                        marginBottom: 13,
                        //ANDROID
                        //marginBottom: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/pencil.png")}
                        style={{ width: 28, height: 28 }}
                      />
                    </View>
                  ),
                }}
              />
            );
          default:
            return null;
        }
      })()}

      <Tab.Screen
        name="News"
        component={News}
        options={{
          unmountOnBlur: true,
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#373945" : "#75787d",
                fontFamily: "Jost",
                fontWeight: "700",
                fontSize: RFPercentage(1.2),
                // ANDROID
                marginTop: -10,
                marginBottom: 10,
              }}
            >
              {i18n.t("filDactus")}
            </Text>
          ),

          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={require("../assets/news-active.png")}
                style={{ width: 20, height: 20 }}
              />
            ) : (
              <Image
                source={require("../assets/news.png")}
                style={{ width: 20, height: 20 }}
              />
            ),
        }}
      />

      <Tab.Screen
        name="Messenger"
        component={Messenger}
        options={{
          unmountOnBlur: true,
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#373945" : "#75787d",
                fontFamily: "Jost",
                fontWeight: "700",
                fontSize: RFPercentage(1.2),
                // ANDROID
                marginTop: -10,
                marginBottom: 10,
              }}
            >
              {i18n.t("messages")}
            </Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={require("../assets/messagerie-active.png")}
                style={{ width: 20, height: 20 }}
              />
            ) : (
              <Image
                source={require("../assets/messagerie.png")}
                style={{ width: 20, height: 20 }}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}
