import { View, Text, Image, StyleSheet } from "react-native";
import { useContext } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";
import { DataContext } from "../components/Context";

export default function Write() {
  const { locale } = useContext(DataContext);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/notAvailable.jpg")}
        style={styles.notAvailable}
        resizeMode="contain"
      />
      <Text style={styles.text}>{i18n.t("bientôtDisponible")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: "10%",
  },

  notAvailable: {
    width: 300,
    height: 300,
  },

  text: {
    color: "#373945",
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    marginTop: 30,
    textAlign: "justify",
  },
});
