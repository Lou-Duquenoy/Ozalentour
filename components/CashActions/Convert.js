import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { DataContext } from "../Context";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ConvertSuccess from "../CashRecap/ConvertSuccess";
import ConvertFail from "../CashRecap/ConvertFail";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function Convert({ updateWallet }) {
  const {
    setOpenConvert,
    openConvertSuccess,
    setOpenConvertSuccess,
    openConvertFail,
    setOpenConvertFail,
    locale,
  } = useContext(DataContext);

  const [EURAmount, setEURAmount] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [selectCurrency, setSelectCurrency] = useState("OZA");
  const [EUR, setEUR] = useState("OZA");
  const [token, setToken] = useState("");
  const [warning, setWarning] = useState(false);
  const [submit, setSubmit] = useState(false);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  useEffect(() => {
    async function getData() {
      let getEUR = await AsyncStorage.getItem("EUR");
      setEUR(getEUR);

      let token = await AsyncStorage.getItem("token");
      setToken(token);
    }

    getData();

    const backAction = () => {
      setOpenConvert(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const onSubmit = () => {
    setWarning(false);

    if (EURAmount && publicKey) {
      setSubmit(true);
      console.log("submit ok", EURAmount);

      let data = {
        amount: EURAmount,
        BSCReceiverKey: publicKey,
      };

      axios
        .post(
          `${BASE_URL}/transaction/convertEURtoOZA`,

          { token: token, data: data },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        )
        .catch((error) => {
          console.log(error);
          setOpenConvertFail(true);
        })
        .then(async (res) => {
          console.log(res);

          if (res != undefined && res.status == 200) {
            let token = await AsyncStorage.getItem("token");

            await axios
              .post(
                `${BASE_URL}/user/getData`,

                {
                  token: token,
                },
                {
                  //withCredentials: true,
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                }
              )
              .then(async (res) => {
                console.log(res.data.EUR);
                AsyncStorage.setItem("EUR", res.data.EUR.toString());

                let getEUR = await AsyncStorage.getItem("EUR");
                updateWallet(getEUR);

                setOpenConvertSuccess(true);
              });
          }
        });
    } else {
      setWarning(true);
    }
  };

  return (
    <>
      {openConvertSuccess ? (
        <ConvertSuccess />
      ) : openConvertFail ? (
        <ConvertFail />
      ) : (
        <View style={styles.container}>
          <View style={styles.convertHeader}>
            <View>
              <Pressable onPress={() => setOpenConvert(false)}>
                <Image
                  source={require("../../assets/arrowHeader.png")}
                  style={styles.arrow}
                />
              </Pressable>
            </View>
            <Text style={styles.titleHeader}>{i18n.t("convertir")}</Text>
          </View>
          <View style={styles.main}>
            <View style={styles.convertAmountContainer}>
              <Text style={styles.convertText}>
                {i18n.t("soldeDisponible")}
              </Text>

              <Text style={styles.convertAmount}> {EUR} €EUR</Text>
            </View>
            <Text style={styles.convertTitle}>
              {" "}
              {i18n.t("ouhaitConversion")}
            </Text>
            <View style={styles.EURAmountInputContainer}>
              <TextInput
                style={styles.EURAmountInput}
                keyboardType="numeric"
                onChangeText={(e) => {
                  setEURAmount(e);
                }}
                value={EURAmount}
                placeholder={"1"}
              />
              <Image
                style={styles.EURIcon}
                source={require("../../assets/EUR.jpg")}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.EURFees}>(- 2,5 % de frais)</Text>

            <Text style={styles.withdrawText}> {i18n.t("retrait")} </Text>
            <View style={styles.OZAInputContainer}>
              <View style={styles.OZAInput}>
                <Text style={styles.OZAConvert}>
                  {Math.round(((EURAmount - EURAmount * 0.025) / 0.01) * 100) /
                    100 || Math.round((0.975 / 0.01) * 100) / 100}
                </Text>
              </View>
              <Image
                style={styles.OZAIcon}
                source={require("../../assets/OZA.png")}
              />
            </View>

            <Text style={styles.walletText}>{i18n.t("portefeuille")}</Text>

            <TextInput
              style={styles.publicKeyInput}
              onChangeText={(e) => {
                setPublicKey(e);
              }}
              value={publicKey}
              placeholder={"Ox45chd897jdkjkjeiuiuy7GJHJjjHJH88UJJgghgh65jhjjhf"}
              placeholderTextColor="#a6a6a6"
            />

            {warning && <Text style={styles.warning}>{i18n.t("champs")}</Text>}

            {/* {submit ? (
              <div style={{ marginTop: 5, marginBottom: 5 }}>
                <ActivityIndicator size="large" color="#14b9c5" />
              </div>
            ) : (
              <TouchableOpacity style={styles.submit}>
                <Pressable onPress={onSubmit}>
                  <Text style={styles.submitText}>Retirer maintenant !</Text>
                </Pressable>
              </TouchableOpacity>
            )} */}

            <Text style={styles.warning}>{i18n.t("pasDisponible")}</Text>

            {/* <Text style={styles.openWalletText}>
              Comment ouvrir un portefeuuille OZA ?
            </Text> */}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#373945",
    zIndex: 3000,
  },

  convertHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: "10%",
    paddingLeft: "5%",
    paddingRight: "5%",
    paddingBottom: "3%",
    backgroundColor: "#373945",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  titleHeader: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "500",
    color: "#FFFFFF",
    marginRight: "41%",
  },

  arrow: {
    width: 40,
    height: 40,
  },

  main: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  convertAmountContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    height: 100,
    width: "90%",
    marginBottom: 20,
    padding: 10,
  },

  convertText: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    color: "#089baa",
    alignSelf: "flex-start",
  },

  convertAmount: {
    fontSize: RFPercentage(5),
    fontFamily: "Jost",
    fontWeight: "600",
    color: "#089baa",
    height: 50,
  },

  convertTitle: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 15,
  },

  EURAmountInputContainer: {
    width: "90%",
    height: 50,
  },

  EURAmountInput: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    width: "100%",
    height: " 100%",
    color: "#373945",
    borderBottomWidth: 1,
    borderColor: "#373945",
    padding: 10,
    paddingRight: 55,
  },

  EURIcon: {
    position: "absolute",
    width: 30,
    height: 30,
    top: 10,
    right: 10,
  },

  OZAIcon: {
    position: "absolute",
    width: 30,
    height: 30,
    top: 10,
    right: 10,
  },

  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  OZACurrency: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },

  convertCurrencies: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },

  currencyText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#a6a6a6",
    marginLeft: 10,
  },

  currencyTextActive: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    marginLeft: 10,
  },

  withdrawText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 15,
  },
  OZAConvert: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
  },

  OZAInputContainer: {
    width: "90%",
    height: 50,
  },

  OZAInput: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    width: "100%",
    height: " 100%",
    color: "#373945",
    borderBottomWidth: 1,
    borderColor: "#373945",
    padding: 10,
    paddingRight: 55,
  },

  EURFees: {
    fontSize: RFPercentage(1.5),
    color: "#a6a6a6",
    marginRight: 10,
    marginTop: 5,
  },

  walletText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    marginBottom: 10,
    marginTop: 30,
    marginLeft: 15,
    alignSelf: "flex-start",
  },

  publicKeyInput: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "400",
    justifyContent: "center",
    width: "90%",
    height: 50,
    color: "#373945",
    borderBottomWidth: 1,
    borderColor: "#373945",
    padding: 10,
    marginBottom: 20,
  },

  submit: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: 50,
    backgroundColor: "#089baa",
    borderRadius: 20,
    marginTop: "10%",
    marginBottom: 20,
  },

  submitText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "400",
    color: "#FFFFFF",
  },

  openWalletText: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "400",
    color: "#a6a6a6",
  },

  feesText: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "400",
    alignSelf: "flex-start",
    position: "absolute",
    bottom: 10,
    left: 15,
    color: "#a6a6a6",
  },

  warning: {
    textAlign: "center",
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#e25a84",
    marginTop: 10,
  },
});
