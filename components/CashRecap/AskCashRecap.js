import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../Context";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AskCashNotifSuccess from "../CashRecap/AskCashNotifSuccess";
import AskCashNotifFail from "../CashRecap/AskCashNotifFail";
import axios from "axios";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function AskCashRecap({
  amount,
  receiverName,
  receiverWalletId,
  notifSenderWalletId,
  motive,
  receiverAvatar,
}) {
  const {
    setOpenAskCashRecap,
    openAskCashNotifSuccess,
    setOpenAskCashNotifSuccess,
    openAskCashNotifFail,
    setOpenAskCashNotifFail,
    setRefreshTransactions,
    locale,
  } = useContext(DataContext);

  const [submit, setSubmit] = useState(false);

  const [OZP, setOZP] = useState(0);
  const [walletId, setWalletId] = useState("");
  const [token, setToken] = useState("");

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  let rawFees = (parseInt(amount) * 0.99) / 100;

  let fees = Math.round(rawFees * 100) / 100;

  let totalAmount = parseInt(amount) + fees;
  const finalAmount = totalAmount.toString();

  useEffect(() => {
    const getData = async () => {
      let getOZP = await AsyncStorage.getItem("EUR");
      setOZP(getOZP);

      let getWalletId = await AsyncStorage.getItem("walletId");
      setWalletId(getWalletId);

      let token = await AsyncStorage.getItem("token");
      setToken(token);
    };
    getData();
  }, []);

  const onSubmit = () => {
    setSubmit(true);

    let data = {
      motive: motive,
      receiverWalletId: receiverWalletId,
      senderWalletId: walletId,
      receiverName: receiverName,
      notifSenderWalletId: notifSenderWalletId,
      amount,
    };

    axios
      .post(
        `${BASE_URL}/user/askCashNotification`,
        {
          token: token,
          data: data,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(async function (res) {
        console.log(res);

        if (res.status == 200) {
          setOpenAskCashNotifSuccess(true);
          setRefreshTransactions(true);
        } else if (res.status == 202) {
          setOpenAskCashNotifFail(true);
        }
      });
  };

  return openAskCashNotifSuccess ? (
    <AskCashNotifSuccess
      amount={amount}
      receiverName={receiverName}
      receiverWalletId={receiverWalletId}
      motive={motive}
    />
  ) : openAskCashNotifFail ? (
    <AskCashNotifFail />
  ) : (
    <View style={styles.container}>
      <View style={styles.sendCashRecapHeader}>
        <View>
          <Pressable onPress={() => !submit && setOpenAskCashRecap(false)}>
            <Image
              source={require("../../assets/arrowHeader.png")}
              style={styles.arrow}
            />
          </Pressable>
        </View>
        <Text style={styles.titleHeader}>{i18n.t("récapitulatif")}</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.userInfosContainer}>
          <Image
            source={require("../../assets/userPlaceholder.png")}
            style={styles.avatar}
            resizeMode="cover"
          />

          <Text style={styles.transactionReceiver}>{receiverName}</Text>

          <Text style={styles.transactionWallet}>{receiverWalletId}</Text>
        </View>
        <Text style={styles.total}>{amount} €EUR</Text>
        <Text style={styles.title}>{i18n.t("noteTransaction")}</Text>
        <Text style={styles.text}>{motive}</Text>
        <Text style={styles.title}>{i18n.t("détailTransaction")}</Text>
        <View style={styles.infosContainer}>
          <Text style={styles.subtitle}>{i18n.t("débit")}</Text>
          <Text style={styles.text}>{amount} €EUR</Text>
        </View>
        <View style={styles.infosContainer}>
          <Text style={styles.subtitle}>{i18n.t("frais")}</Text>
          <Text style={styles.text}>{fees} €EUR</Text>
        </View>

        <Text style={styles.accountAmount}>
          {i18n.t("moyenPaiement")} ({OZP})
        </Text>

        {submit ? (
          <ActivityIndicator size="large" color="#14b9c5" />
        ) : (
          <TouchableOpacity style={styles.touchable}>
            <Pressable style={styles.submit} onPress={onSubmit}>
              <Text style={styles.submitText}>{i18n.t("confirmer")}</Text>
            </Pressable>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 3000,
    width: "100%",
    height: "100%",
    backgroundColor: "#373945",
  },

  main: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    padding: "5%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  userInfosContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: "5%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  sendCashRecapHeader: {
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
    marginRight: "38%",
  },

  arrow: {
    width: 40,
    height: 40,
  },

  title: {
    color: "#373945",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    marginTop: "2%",
    marginBottom: "2%",
  },

  subtitle: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    marginTop: "2%",
    marginBottom: "2%",
  },

  infosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: " 100%",
  },

  text: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "500",
    marginTop: "2%",
    marginBottom: "2%",
  },

  amount: {
    color: "#373945",
    fontSize: RFPercentage(2.8),
    fontFamily: "Jost",
    fontWeight: "500",
    marginTop: "2%",
    marginBottom: "2%",
  },

  total: {
    color: "#089baa",
    fontSize: RFPercentage(4),
    fontFamily: "Jost",
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 20,
  },

  accountAmount: {
    color: "#373945",
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
    fontWeight: "500",
    marginTop: "5%",
    marginBottom: "5%",
  },

  touchable: {
    marginTop: "10%",
    width: "100%",
    height: "7%",
  },

  submit: {
    width: "100%",
    height: "100%",
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

  avatar: {
    height: 80,
    width: 80,
    borderRadius: 50,
    marginBottom: 10,
  },

  transactionReceiver: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    color: "#0C97A9",
  },

  transactionAmount: {
    fontSize: RFPercentage(6),
    fontFamily: "Jost",
    color: "#0C97A9",
    marginTop: 30,
    marginBottom: 50,
  },

  transactionWallet: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    color: "#373945",
    textAlign: "center",
    marginLeft: 20,
    marginRight: 20,
  },
});
