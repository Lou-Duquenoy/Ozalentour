import { useState, useEffect, useContext } from "react";
import { DataContext } from "../Context";
import QRCode from "react-native-qrcode-svg";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

export default function QrCode() {
  const { amount, setOpenQrCode, setOpenCollect, locale } =
    useContext(DataContext);
  const [walletId, setWalletId] = useState("");

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  useEffect(() => {
    async function getData() {
      let getWalletId = await AsyncStorage.getItem("walletId");
      setWalletId(getWalletId);
      console.log(getWalletId);
    }
    getData();
  }, []);

  let qrCodeValue = JSON.stringify({
    receiverWalletId: walletId,
    amount: amount,
  });

  return (
    <View style={styles.qrCodeContainer}>
      <View style={styles.qrCodeHeader}>
        <View>
          <Pressable
            onPress={() => {
              setOpenQrCode(false), setOpenCollect(true);
            }}
          >
            <Image
              source={require("../../assets/arrowHeader.png")}
              style={styles.arrow}
            />
          </Pressable>
        </View>
        <Text style={styles.titleHeader}>{i18n.t("encaisser")}</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.qrCodeMain}>
          <Text style={styles.transactionAmount}>
            {amount} <Text style={styles.transactionCurrency}>€EUR</Text>
          </Text>

          <View style={styles.qrCodeInfos}>
            <QRCode value={qrCodeValue} size={200} />

            <Text style={styles.transactionMessage}>
              {i18n.t("scan")} {amount} {i18n.t("facture")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrCodeContainer: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#373945",
    zIndex: 3000,
  },

  main: {
    backgroundColor: "#FFFFFF",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  qrCodeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: "10%",
    paddingLeft: "5%",
    paddingRight: "5%",
    paddingBottom: "3%",
    backgroundColor: "#373945",
  },

  titleHeader: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "500",
    color: "#FFFFFF",
    marginRight: "40%",
  },

  arrow: {
    width: 40,
    height: 40,
  },

  qrCodeMain: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  transactionAmount: {
    fontSize: RFPercentage(4),
    fontWeight: "600",
    color: "#373945",
    fontFamily: "Jost",
    margin: 20,
  },

  transactionCurrency: {
    fontSize: RFPercentage(3),
    fontWeight: "600",
    color: "#373945",
    fontFamily: "Jost",
  },

  qrCodeInfos: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: " 100%",
  },

  transactionMessage: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    margin: 20,
    color: "#555454",
    width: "80%",
  },
});
