import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { DataContext } from "../Context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useContext } from "react";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

export default function ConvertSuccess({ amount }) {
  const { setOpenConvertFail, setOpenConvert, locale } =
    useContext(DataContext);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  const returnToHome = () => {
    setOpenConvertFail(false), setOpenConvert(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/forbidden.png")}
        resizeMode="contain"
        style={styles.success}
      />
      <Text style={styles.title}>{i18n.t("echec")}</Text>
      <Text style={styles.text}>{i18n.t("vérifierClé")}</Text>

      <TouchableOpacity
        style={styles.arrowBottomContainer}
        onPress={returnToHome}
      >
        <Image
          source={require("../../assets/arrowBottom.png")}
          resizeMode="contain"
          style={styles.arrowBottom}
        />
        <Text style={styles.text}>{i18n.t("voirSolde")}</Text>
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
    zIndex: 4000,
  },

  success: {
    width: "40%",
    height: "30%",
    marginTop: "10%",
  },

  title: {
    color: "#373945",
    fontSize: RFPercentage(2.4),
    fontFamily: "Jost",
    fontWeight: "700",
    marginBottom: "10%",
  },

  text: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "500",
    marginBottom: "2%",
  },

  link: {
    color: "#089baa",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "500",
    marginBottom: "2%",
  },

  arrowBottomContainer: {
    alignItems: "center",
    width: "40%",
    height: "20%",
    marginTop: "20%",
  },

  arrowBottom: {
    width: 20,
    height: 20,
  },
});
