import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { DataContext } from "../Context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

export default function AskCashSuccess({
  amount,
  receiverName,
  receiverWalletId,
}) {
  const {
    setOpenAskCashNotifSuccess,
    setOpenAskCash,
    setOpenAskCashRecap,
    locale,
  } = useContext(DataContext);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  const returnToHome = () => {
    setOpenAskCashRecap(false);
    setOpenAskCashNotifSuccess(false);
    setOpenAskCash(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/success.png")}
        resizeMode="contain"
        style={styles.success}
      />
      <Text style={styles.title}>{i18n.t("demandeEnvoyée")}</Text>
      <Text style={styles.text}>{i18n.t("destinataireNotif")}</Text>
      <View style={styles.receiverInfos}>
        <Text style={styles.receiverName}>{receiverName}</Text>
        <Text style={styles.wallet}>{receiverWalletId}</Text>
      </View>
      <Text style={styles.relation}>{i18n.t("relations")}</Text>
      <Text style={styles.amountText}>{i18n.t("montant")}</Text>
      <Text style={styles.amount}>{amount} €EUR</Text>
      <Text style={styles.date}>
        {"Date : " +
          new Date().toJSON().slice(0, 10).split("-").reverse().join("/")}
      </Text>

      <TouchableOpacity
        style={styles.arrowBottomContainer}
        onPress={returnToHome}
      >
        <Image
          source={require("../../assets/arrowBottom.png")}
          resizeMode="contain"
          style={styles.arrowBottom}
        />
        <Text style={styles.accountText}>{i18n.t("voirSolde")}</Text>
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
    marginBottom: "2%",
  },

  text: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "500",
    marginBottom: "2%",
  },

  relation: {
    color: "#b5b5b5",
    fontSize: RFPercentage(1.4),
    fontFamily: "Jost",
    fontWeight: "500",
    marginTop: "2%",
    marginBottom: "4%",
  },

  date: {
    color: "#373945",
    fontSize: RFPercentage(1.4),
    fontFamily: "Jost",
    fontWeight: "500",
    marginBottom: "2%",
  },

  amount: {
    color: "#373945",
    fontSize: RFPercentage(3),
    fontFamily: "Jost",
    fontWeight: "700",
    marginBottom: "2%",
  },

  receiverInfos: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginTop: "8%",
    marginBottom: "8%",
    borderWidth: 1,
    borderColor: "#b5b5b5",
    borderRadius: 20,
    padding: 15,
  },

  receiverName: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    marginTop: "1%",
    marginBottom: "1%",
  },

  amountText: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    marginTop: "1%",
    marginBottom: "1%",
  },

  wallet: {
    color: "#373945",
    fontSize: RFPercentage(1.4),
    fontFamily: "Jost",
    fontWeight: "500",
    marginTop: "1%",
    marginBottom: "1%",
    textAlign: "center",
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

  text: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "500",
    marginTop: "1%",
  },
});
