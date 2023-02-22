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
import TransactionSuccess from "../CashRecap/TransactionSuccess";
import TransactionFail from "../CashRecap/TransactionFail";
import axios from "axios";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function SendCashRecap({
  amount,
  receiverName,
  receiverWalletId,
  motive,
  updateWallet,
  receiverAvatar,
}) {
  console.log(receiverAvatar);
  const {
    setOpenSendCashRecap,
    openTransactionSuccess,
    setOpenTransactionSuccess,
    openTransactionFail,
    setOpenTransactionFail,
    setRefreshTransactions,
    locale,
  } = useContext(DataContext);

  const [submit, setSubmit] = useState(false);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  let rawFees = (parseInt(amount) * 0.99) / 100;

  console.log(rawFees);
  let fees = Math.round(rawFees * 100) / 100;

  console.log(rawFees);
  let totalAmount = parseInt(amount) + fees;
  const finalAmount = totalAmount.toString();

  const [EUR, setEUR] = useState(0);
  const [walletId, setWalletId] = useState("");

  useEffect(() => {
    const getData = async () => {
      let getEUR = await AsyncStorage.getItem("EUR");
      setEUR(getEUR);

      let getWalletId = await AsyncStorage.getItem("walletId");
      setWalletId(getWalletId);
    };

    getData();
  }, []);

  const onSubmit = async () => {
    setSubmit(true);

    console.log(walletId);
    console.log(receiverWalletId);
    let token = await AsyncStorage.getItem("token");

    let data = {
      senderWalletId: walletId,
      receiverWalletId: receiverWalletId,

      amount: amount,

      feesGoTo: "sender",

      currency: "EUR",

      description: motive,

      type: "1",

      method: "1",
    };

    axios
      .post(
        `${BASE_URL}/transaction`,
        {
          token: token,
          data: data,
        },
        {
          // withCredentials: true,
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(async function (res) {
        console.log(res);

        if (res.status == 200) {
          setOpenTransactionSuccess(true);

          let token = await AsyncStorage.getItem("token");

          const data = await axios.post(
            `${BASE_URL}/user/getData`,

            {
              token: token,
            },
            {
              // withCredentials: true,
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          );

          AsyncStorage.setItem("EUR", data.data.EUR.toString());
          let getEUR = await AsyncStorage.getItem("EUR");
          updateWallet(getEUR);
          setRefreshTransactions(true);
        } else if (res.status == 202) {
          setOpenTransactionFail(true);
        }
      });
  };

  return openTransactionSuccess ? (
    <TransactionSuccess
      amount={amount}
      receiverName={receiverName}
      receiverWalletId={receiverWalletId}
      motive={motive}
    />
  ) : openTransactionFail ? (
    <TransactionFail />
  ) : (
    <View style={styles.container}>
      <View style={styles.sendCashRecapHeader}>
        <View>
          <Pressable onPress={() => !submit && setOpenSendCashRecap(false)}>
            <Image
              source={require("../../assets/arrowHeader.png")}
              style={styles.arrow}
            />
          </Pressable>
        </View>
        <Text
          style={locale == "fr" ? styles.titleHeader : styles.titleHeaderEN}
        >
          {i18n.t("récapitulatif")}
        </Text>
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
        <Text style={styles.total}>{totalAmount} €EUR</Text>
        <Text style={styles.title}>{i18n.t("transactionDescription")}</Text>
        <Text style={styles.text}>{motive}</Text>
        <Text style={styles.title}>{i18n.t("transactionDétail")}</Text>
        <View style={styles.infosContainer}>
          <Text style={styles.subtitle}>{i18n.t("débit")}</Text>
          <Text style={styles.text}>{amount} €EUR</Text>
        </View>
        <View style={styles.infosContainer}>
          <Text style={styles.subtitle}>{i18n.t("frais")}</Text>
          <Text style={styles.text}>{fees} €EUR</Text>
        </View>

        <Text style={styles.accountAmount}>
          {i18n.t("frais")} ({fees})
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

  titleHeaderEN: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "500",
    color: "#FFFFFF",
    marginRight: "44%",
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
