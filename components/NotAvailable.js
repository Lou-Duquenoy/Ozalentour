import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Touchable,
} from "react-native";
import { useContext } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";
import { DataContext } from "../components/Context";

export default function NotAvailable() {
  const { locale, showNotAvailable, setShowNotAvailable } =
    useContext(DataContext);

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

      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          setShowNotAvailable(false);
        }}
      >
        <Text style={styles.submitText}>{i18n.t("retour")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: "10%",
    zIndex: 7000,
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

  touchable: {
    marginTop: "10%",
    width: "80%",
    padding: "3%",
    padding: 10,
    backgroundColor: "#089baa",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },

  submitText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
