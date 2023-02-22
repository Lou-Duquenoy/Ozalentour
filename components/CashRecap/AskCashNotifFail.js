import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";
import { DataContext } from "../Context";
import { useContext } from "react";

export default function AskCashNotifFail() {
  const { locale } = useContext(DataContext);
  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/forbidden.png")}
        resizeMode="contain"
        style={styles.forbidden}
      />
      <Text style={styles.title}>Oups !</Text>
      <Text style={styles.text}>{i18n.t("nePeutAboutir")}</Text>

      <TouchableOpacity style={styles.arrowBottomContainer}>
        <Image
          source={require("../../assets/arrowBottom.png")}
          resizeMode="contain"
          style={styles.arrowBottom}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 3000,
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    padding: "5%",
  },

  forbidden: {
    width: "40%",
    height: "30%",
    marginTop: "10%",
  },

  title: {
    color: "#373945",
    fontSize: RFPercentage(2.4),
    fontFamily: "Jost",
    fontWeight: "700",
    marginBottom: "2%",
  },

  text: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "500",
    marginBottom: "2%",
  },

  arrowBottomContainer: {
    alignItems: "center",
    width: "40%",
    height: "20%",
    marginTop: "8%",
  },

  arrowBottom: {
    width: "30%",
    height: "30%",
  },
});
