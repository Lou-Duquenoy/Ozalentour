import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import { DataContext } from "../components/Context";
import { RFPercentage } from "react-native-responsive-fontsize";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function Scanner() {
  const { user, setUser, locale } = useContext(DataContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [beginScan, setBeginScan] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(0);
  const [walletId, setWalletId] = useState("");
  const [userData, setUserData] = useState({});
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const [token, setToken] = useState("");

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  // When the component is mounted, we request permission to the user to get access to the camera
  useEffect(() => {
    const getStatus = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    const getData = async () => {
      let getWalletId = await AsyncStorage.getItem("walletId");
      setWalletId(getWalletId);

      let getToken = await AsyncStorage.getItem("token");
      setToken(getToken);
    };
    getStatus();
    getData();
  }, []);

  // We handle permission request or error and display a text if needed
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // When the user scans the QR code, we set the data into the qrCodeData state
  const handleBarCodeScanned = ({ type, data }) => {
    // setScanned(true);

    let infos = JSON.parse(data);
    setQrCodeData(infos);

    let getUserData = async () => {
      let token = await AsyncStorage.getItem("token");

      let receiver = await axios
        .post(
          `${BASE_URL}/user/getData`,
          {
            token,
            user: infos.receiverWalletId,
          },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setUserData(res.data);
        });
    };

    getUserData();
  };

  console.log(qrCodeData);

  async function sendTransaction() {
    console.log("C'est parti Michel");
    setSendingTransaction(true);

    console.log(userData);

    let receiverWalletId = qrCodeData.receiverWalletId;
    let amount = qrCodeData.amount;

    let data = {
      senderWalletId: walletId,
      receiverWalletId: receiverWalletId,

      amount: amount,

      feesGoTo: "receiver",

      currency: "EUR",

      type: "1",

      method: "1",
    };

    axios
      .post(
        `${BASE_URL}/transaction`,
        {
          token,
          data,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )

      .then(async (response) => {
        console.log(response.status);

        if (response.status == 200) {
          setTransactionStatus(1);
          setSendingTransaction(false);
          let userEmail = user.email;

          const data = await axios.post(
            `${BASE_URL}/user/userData`,
            {
              email: userEmail,
            },
            {
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          );

          setUser(data.data);
        } else if (response.status == 202) {
          setTransactionStatus(2);
          setSendingTransaction(false);
          console.log(response.status);
        }
      });
  }

  function handleReturn() {
    setTransactionStatus(0);
    setQrCodeData(null);
  }

  if (!qrCodeData) {
    return (
      <>
        <View style={styles.recapContainer}>
          <Camera
            style={StyleSheet.absoluteFillObject}
            onBarCodeScanned={qrCodeData === null ? handleBarCodeScanned : null}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
          />
          <Image
            source={require("../assets/scanner.png")}
            style={styles.scanner}
          />

          {scanned && (
            <View>
              <Text>{qrCodeData.ammount}</Text>
              <Pressable onPress={sendTransaction}>
                <Text>{i18n.t("valider")}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </>
    );
  } else if (transactionStatus == 1) {
    return (
      <>
        <View style={styles.recapContainer}>
          <Text style={styles.headerTitle}>Statut de la transaction</Text>
          <View style={styles.transactionContainer}>
            <Image
              source={require("../assets/checked.png")}
              style={styles.statusIcon}
            />
            <Text style={styles.transactionMessage}>
              {i18n.t("enregistrée")}
            </Text>
            <Pressable
              style={styles.transactionReturnButton}
              onPress={handleReturn}
            >
              <Text style={styles.transactionButtonText}>
                {i18n.t("retour")}
              </Text>
            </Pressable>
          </View>
        </View>
      </>
    );
  } else if (transactionStatus == 2) {
    return (
      <>
        <View style={styles.recapContainer}>
          <Text style={styles.headerTitle}>{i18n.t("statut")}</Text>
          <View style={styles.transactionContainer}>
            <Image
              source={require("../assets/forbidden.png")}
              style={styles.statusIcon}
            />
            <Text style={styles.transactionMessage}>
              {i18n.t("insuffisant")}
            </Text>
            <Pressable
              style={styles.transactionReturnButton}
              onPress={handleReturn}
            >
              <Text style={styles.transactionButtonText}>
                {i18n.t("retour")}
              </Text>
            </Pressable>
          </View>
        </View>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.recapContainer}>
          <Text style={styles.headerTitle}>{i18n.t("récapitulatif")}</Text>
          <View style={styles.transactionContainer}>
            <View style={styles.userInfosContainer}>
              <Image
                source={{
                  uri: `${BASE_URL}/avatars/${userData.avatar}`,
                }}
                style={styles.avatar}
                resizeMode="cover"
              />
              {userData.companyName ? (
                <Text style={styles.transactionReceiver}>
                  {userData.companyName}
                </Text>
              ) : (
                <Text style={styles.transactionReceiver}>
                  {userData.firstName + " " + userData.lastName}
                </Text>
              )}

              <Text style={styles.transactionWallet}>
                {qrCodeData.receiverWalletId}
              </Text>
            </View>

            <Text style={styles.transactionAmount}>
              {" "}
              {qrCodeData.amount} €EUR
            </Text>

            {sendingTransaction ? (
              <ActivityIndicator size="large" color="#14b9c5" />
            ) : (
              <View style={styles.buttonsContainer}>
                <Pressable
                  style={styles.transactionButton}
                  onPress={sendTransaction}
                >
                  <Text style={styles.transactionButtonText}>
                    {i18n.t("payer")}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.transactionButtonCancel}
                  onPress={() => {
                    setQrCodeData(null);
                  }}
                >
                  <Text style={styles.transactionButtonText}>
                    {i18n.t("annuler")}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  recapContainer: {
    flex: 1,
    backgroundColor: "#373945",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },

  transactionContainer: {
    width: "100%",
    height: "100%",
    padding: "5%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  userInfosContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },

  avatar: {
    height: 80,
    width: 80,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10,
  },

  transactionWallet: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    color: "#373945",
    textAlign: "center",
    marginLeft: 20,
    marginRight: 20,
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

  statusIcon: {
    width: "40%",
    height: "20%",
    resizeMode: "contain",
    margin: 30,
  },

  transactionMessage: {
    fontSize: RFPercentage(3),
    fontFamily: "Jost",
    color: "#0C97A9",
    marginBottom: 20,
  },

  transaction: {
    fontSize: RFPercentage(2.5),
    fontFamily: "JostBold",
    color: "#373945",
    marginBottom: "10%",
  },

  headerTitle: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "400",
    color: "#ffffff",
    marginBottom: "5%",
  },

  transactionTitle: {
    fontSize: RFPercentage(2),
    fontFamily: "JostBold",
    color: "#373945",
    marginBottom: "5%",
  },

  transactionText: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    color: "#373945",
    marginBottom: "5%",
  },

  transactionButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0C97A9",
    borderRadius: 8,
    width: "35%",
    padding: "1.5%",
    color: "#ffffff",
    marginLeft: "4%",
  },

  transactionButtonCancel: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2557F",
    borderRadius: 8,
    width: "35%",
    padding: "1.5%",
    color: "#ffffff",
    marginLeft: "4%",
  },

  transactionReturnButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2557F",
    borderRadius: 8,
    width: "35%",
    padding: "1.5%",
    marginTop: "5%",
  },

  buttonsContainer: {
    flexDirection: "row",
  },

  transactionButtonText: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    color: "#ffffff",
  },

  scanner: {
    width: 200,
    height: 200,
  },
});
