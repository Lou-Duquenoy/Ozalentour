import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "./Context";
import { RFPercentage } from "react-native-responsive-fontsize";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TransactionSuccess from "./CashRecap/TransactionSuccess";
import TransactionFail from "./CashRecap/TransactionFail";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function SendCashFromNotif({ props }) {
  const {
    setNotifModal,
    setOpenSendCashFromNotif,
    openTransactionSuccess,
    setOpenTransactionSuccess,
    openTransactionFail,
    setOpenTransactionFail,
    refreshNotifications,
    setRefreshNotifications,
    locale,
  } = useContext(DataContext);
  const [transactionPending, setTransactionPending] = useState(false);

  const [receiverName, setReceiverName] = useState(false);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  let notifReceiverWalletId = props.data.receiverWalletId;
  let notifSenderWalletId = props.data.senderWalletId;
  let amount = props.data.amount;
  let motive = props.data.motive;
  let notificationId = props.id;

  const onSubmitTransaction = async () => {
    setTransactionPending(true);

    let token = await AsyncStorage.getItem("token");

    let data = {
      senderWalletId: notifReceiverWalletId,
      receiverWalletId: notifSenderWalletId,

      amount: amount,

      feesGoTo: "receiver",

      description: motive,

      currency: "EUR",

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
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          );

          AsyncStorage.setItem("EUR", data.data.EUR.toString());
        } else if (res.status == 202) {
          setOpenTransactionFail(true);
        }
      })
      .then(() => {
        axios.post(
          `${BASE_URL}/user/notificationStatus`,
          {
            token: token,
            notificationId: notificationId,
          },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        );
      })
      .then(() => {
        setRefreshNotifications(true);
      });
  };

  const declinePayment = async () => {
    let token = await AsyncStorage.getItem("token");
    axios
      .post(
        `${BASE_URL}/user/notificationStatus`,
        {
          token: token,
          notificationId: notificationId,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(() => {
        setRefreshNotifications(true);
        setNotifModal(false);
      });
  };

  return openTransactionSuccess ? (
    <TransactionSuccess
      amount={amount}
      receiverName={receiverName}
      receiverWalletId={notifSenderWalletId}
      motive={motive}
    />
  ) : openTransactionFail ? (
    <TransactionFail />
  ) : (
    <View style={styles.container}>
      <View style={styles.sendCashFromNotifRecapHeader}>
        <View>
          <Pressable
            onPress={() => !transactionPending && setNotifModal(false)}
          >
            <Image
              source={require("../assets/arrowHeader.png")}
              style={styles.arrow}
            />
          </Pressable>
        </View>
        <Text style={styles.titleHeader}>{i18n.t("récapitulatif")}</Text>
      </View>

      <View style={styles.main}>
        <Text style={styles.text}>
          {props.data.senderFirstName} {props.data.senderLastName} vous demande
          de lui envoyer
        </Text>
        <Text style={styles.amount}>{amount} €EUR</Text>
        <Text style={styles.text}>{i18n.t("versWallet")}</Text>
        <Text style={styles.wallet}>{notifSenderWalletId}</Text>
        <Text style={styles.text}>Pour</Text>
        <Text style={styles.motive}>{props.data.motive}</Text>

        <View style={styles.buttonsContainer}>
          {transactionPending ? (
            <View style={styles.indicatorContainer}>
              <ActivityIndicator size="large" color="#14b9c5" />
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.send}
                onPress={onSubmitTransaction}
              >
                <Text style={styles.buttonText}>{i18n.t("envoyer")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.decline} onPress={declinePayment}>
                <Text style={styles.buttonText}>{i18n.t("décliner")}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <Text style={styles.warning}>
          {i18n.t("décliner")} {props.data.amount} EUR {i18n.t("à")}{" "}
          {props.data.senderFirstName} {props.data.senderLastName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    width: "100%",
    backgroundColor: "#373945",
    zIndex: 3000,
  },

  sendCashFromNotifRecapHeader: {
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

  main: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },

  text: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#14b9c5",
    padding: 10,
    width: "100%",
    alignSelf: "flex-start",
  },

  wallet: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#373945",
    width: "90%",
    alignSelf: "center",
    marginTop: "10%",
    marginBottom: "10%",
  },

  motive: {
    alignSelf: "center",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#373945",
    marginTop: "10%",
    marginBottom: "10%",
  },

  amount: {
    alignSelf: "center",
    fontSize: RFPercentage(4.5),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    marginTop: "10%",
    marginBottom: "10%",
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "5%",
  },

  send: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#14b9c5",
    borderRadius: 20,
    padding: 5,
    width: "40%",
    height: "100%",
  },

  decline: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e25a84",
    borderRadius: 20,
    padding: 5,
    width: "40%",
    height: "100%",
  },

  buttonText: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#FFFFFF",
  },

  warning: {
    marginTop: "20%",
    fontSize: RFPercentage(1.2),
    fontFamily: "Jost",
    color: "#FFFFFF",
  },

  indicatorContainer: {
    alignItem: "center",
    justifyCOntent: "center",
    width: "100%",
  },

  successContainer: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#373945",
    paddingTop: 40,
    padding: 20,
  },

  successTitle: {
    fontSize: RFPercentage(3),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
  },

  successText: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#FFFFFF",
    marginBottom: 5,
    fontWeight: "600",
  },

  successTextAmount: {
    fontSize: RFPercentage(2.4),
    fontFamily: "Jost",
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 5,
  },

  successTextReceiver: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#FFFFFF",
    fontWeight: "600",
  },

  successPicture: {
    width: 200,
    height: 200,
    margin: 20,
  },

  return: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#14b9c5",
    borderRadius: 20,
    padding: 5,
    width: "100%",
    height: "5%",
    marginTop: "10%",
  },
});
