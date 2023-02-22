import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DataContext } from "../Context";
import { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

export default function TransactionFail() {
  const {
    setOpenTransactionFail,
    setOpenSendCashRecap,
    setOpenTransactionSuccess,
    setNotifModal,
    locale,
  } = useContext(DataContext);

  const [redirect, setRedirect] = useState(false);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  /*   useFocusEffect(
    useCallback(() => {
      redirect && navigation.navigate("Home");
    })
  ); */

  const returnToHome = () => {
    setRedirect(true);
    setOpenSendCashRecap(false);
    setOpenTransactionSuccess(false);
    setNotifModal(false);
    setOpenTransactionFail(false);
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/forbidden.png")}
        resizeMode="contain"
        style={styles.forbidden}
      />
      <Text style={styles.title}>Oups !</Text>
      <Text style={styles.text}>{i18n.t("soldeInsuffisant")}</Text>

      <TouchableOpacity
        style={styles.arrowBottomContainer}
        onPress={returnToHome}
      >
        <Image
          source={require("../../assets/arrowBottom.png")}
          resizeMode="contain"
          style={styles.arrowBottom}
        />
        <Text style={styles.returnText}>{i18n.t("retour")}</Text>
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

  arrowBottomContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "10%",
    marginTop: "30%",
  },

  arrowBottom: {
    width: 30,
    height: 30,
  },

  text: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "500",
    marginBottom: "2%",
    width: "80%",
    textAlign: "center",
  },

  returnText: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "500",
  },
});
