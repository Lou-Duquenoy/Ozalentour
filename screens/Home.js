import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  Dimensions,
} from "react-native";
import { useState, useContext, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DataContext } from "../components/Context";
import Login from "../components/Login";
import Recharge from "../components/Recharge";
import Transfer from "../components/CashActions/Transfer";
import AskCash from "../components/CashActions/AskCash";
import Collect from "../components/CashActions/Collect";
import QrCode from "../components/CashActions/QrCode";
import Convert from "../components/CashActions/Convert";
import Menu from "../components/Menu/Menu";
import ConnectBSCWallet from "../components/ConnectBSCWallet";
import axios from "axios";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";
//const BASE_URL = "http://localhost:8000";

const HEIGHT = Dimensions.get("window").height;

export default function Home() {
  const {
    login,
    setLogin,
    openTransfer,
    setOpenTransfer,
    openAskCash,
    setOpenAskCash,
    openCollect,
    setOpenCollect,
    openQrCode,
    openConvert,
    setOpenConvert,
    openRecharge,
    setOpenRecharge,
    setScreenName,
    openMenu,
    setOpenMenu,
    setMenuPage,
    userAvatar,
    setUserAvatar,
    refreshTransactions,
    setRefreshTransactions,
    locale,
    openConnectBSCWallet,
    setOpenConnectBSCWallet,
    BSCWallet,
    setBSCWallet,
    BSCAmount,
    setBSCAmount,
  } = useContext(DataContext);

  const [EURWallet, setEURWallet] = useState(0);
  const [token, setToken] = useState(null);
  const [walletId, setWalletId] = useState(null);
  const [updateBSCWallet, setUpdateBSCWallet] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const transactionsSheetRef = useRef(null);
  const [toggleBlur, setToggleBlur] = useState(false);
  const snapPoints = ["47%", "87%"];

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  //const snapPoints = [400, "87%"];

  useEffect(() => {
    setScreenName("Home");

    if (
      !openTransfer &&
      !openAskCash &&
      !openConvert &&
      !openCollect &&
      !openRecharge &&
      !openConnectBSCWallet
    ) {
      const backAction = () => {
        Alert.alert(i18n.t("alert"), [
          {
            text: i18n.t("annuler"),
            onPress: () => null,
            style: "cancel",
          },
          { text: i18n.t("confirmer"), onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }

    // const checkBSC = async () => {
    //   let getBSCWallet = await AsyncStorage.getItem("BSCWallet");
    //   setBSCWallet(getBSCWallet);
    // };

    // checkBSC();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      let getToken = await AsyncStorage.getItem("token");
      let getWalletId = await AsyncStorage.getItem("walletId");
      let getBSCWallet = await AsyncStorage.getItem("BSCWallet");
      let getBSCAmount = await AsyncStorage.getItem("BSCAmount");
      setBSCAmount(getBSCAmount);
      setBSCWallet(getBSCWallet);
      setToken(getToken);
      setWalletId(getWalletId);
    };

    checkToken();
  }, [login]);

  useEffect(() => {
    console.log(token);
    getData();
    token && setLogin(1);

    // if (token && BSCWallet) {
    //   const updateBSCAmount = setInterval(() => {
    //     axios
    //       .post(
    //         `${BASE_URL}/user/getBSCBalance`,
    //         {
    //           token: token,
    //           BSCWallet: BSCWallet,
    //         },
    //         {
    //           headers: {
    //             "Content-Type": "application/json; charset=UTF-8",
    //           },
    //         }
    //       )
    //       .then((data) => {
    //         console.log("test");
    //         if (BSCAmount != data.data) {
    //           AsyncStorage.setItem("BSCAmount", data.data);
    //           setBSCAmount(data.data);
    //           console.log("axios envoyé");
    //         }
    //       });
    //   }, 3000);

    //   return () => clearInterval(updateBSCAmount);
    // }
  }, [token]);

  useEffect(() => {
    let updateWallet = async () => {
      let BSCAmount = await axios.post(
        `${BASE_URL}/user/getBSCBalance`,
        {
          token: token,
          BSCWallet: BSCWallet,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );

      setBSCAmount(BSCAmount.data);
    };

    updateWallet();
  }, [BSCWallet]);

  useEffect(() => {
    setRefreshTransactions(false);

    login == 1 && checkTransactions();
  }, [refreshTransactions, walletId]);

  const checkTransactions = async () => {
    try {
      let transactions = await axios.post(
        `${BASE_URL}/user/getTransactions`,

        {
          token: token,
          walletId: walletId,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );

      setTransactionList(transactions.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  async function getData() {
    let getUserAvatar = await AsyncStorage.getItem("avatar");
    setUserAvatar(getUserAvatar);

    let token = await AsyncStorage.getItem("token");

    await axios
      .post(
        `${BASE_URL}/user/getData`,

        {
          token: token,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(async (res) => {
        console.log(res.data);
        AsyncStorage.setItem("EUR", res.data.EUR.toString());

        let getEUR = await AsyncStorage.getItem("EUR");
        setEURWallet(getEUR);
        //checkTransactions();
      });
  }

  if (login === 0) {
    return <Login />;
  } else if (login === 1) {
    return (
      <>
        {openTransfer ? <Transfer updateWallet={setEURWallet} /> : null}
        {openAskCash ? <AskCash /> : null}
        {openCollect ? <Collect /> : null}
        {openQrCode ? <QrCode /> : null}
        {openConvert ? <Convert updateWallet={setEURWallet} /> : null}
        {openRecharge ? <Recharge /> : null}
        {openMenu ? <Menu /> : null}
        {openConnectBSCWallet ? <ConnectBSCWallet /> : null}

        <View
          style={styles.container}
          contentContainerStyle={{ display: "flex", alignItems: "center" }}
        >
          <View style={styles.header}>
            <View style={styles.userContainer}>
              <TouchableOpacity
                onPress={() => {
                  setOpenMenu(true), setMenuPage("index");
                }}
              >
                <Image
                  source={require("../assets/userPlaceholder.png")}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <View>
                <Image
                  source={require("../assets/ozaLogo.png")}
                  style={styles.logo}
                />
              </View>
            </View>
            <View style={styles.headerRightIcons}>
              <Image
                source={require("../assets/glass-white.png")}
                style={styles.notif}
              />
              <Pressable
                style={styles.rechargeButton}
                onPress={() => {
                  setOpenRecharge(true);
                }}
              >
                <Text style={styles.rechargeButtonText}>
                  {i18n.t("recharger")}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.walletOverview}>
            <Text style={styles.EURText}>{i18n.t("monCompte")}</Text>

            <View style={styles.EURAmountContainer}>
              <Text style={styles.EURAmount}>
                {" "}
                {parseFloat(EURWallet)
                  .toFixed(2)
                  .toString()
                  .replace(".", ",")}{" "}
                €
              </Text>
              {/* <Image
                style={styles.eye}
                source={require("../assets/hiddenWhite.png")}
                resizeMode="contain"
              /> */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setToggleBlur(!toggleBlur);
                  }}
                  style={styles.eyeContainer}
                >
                  <Image
                    style={styles.eye}
                    source={
                      toggleBlur
                        ? require("../assets/hiddenWhite.png")
                        : require("../assets/showWhite.png")
                    }
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <Text style={styles.OZAText}> {i18n.t("soldeActuel")}</Text>
              </View>
            </View>

            <View style={styles.warningContainer}>
              <View>
                <Text style={styles.warningTitle}>
                  {" "}
                  {i18n.t("versionDeTest")}
                </Text>
                <Text style={styles.warningText}>
                  {" "}
                  &#9888; {i18n.t("EURFactices")} &#9888;
                </Text>
              </View>
            </View>

            {BSCWallet ? (
              <TouchableOpacity
                style={styles.OZAContainer}
                onPress={() => {
                  setOpenConnectBSCWallet(true);
                }}
              >
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.OZATitle}>
                      {i18n.t("OZAPortefeuille")} OZACOIN
                    </Text>
                    <Image
                      source={require("../assets/OZA.png")}
                      style={{ height: 20, width: 20, marginLeft: 5 }}
                    />
                  </View>
                  <View>
                    <Text style={styles.OZAStackAmount}>
                      {BSCAmount || "0"} $OZA
                    </Text>
                    {BSCAmount ? (
                      <Text style={styles.OZATitle}>
                        {i18n.t("soit")} {parseFloat(BSCAmount) * 0.0117} €EUR
                      </Text>
                    ) : (
                      <Text style={styles.OZATitle}>
                        {i18n.t("soit")} 0 €EUR
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.evolution}>
                  <Text style={styles.OZATitle}>0,0117 €EUR</Text>
                  <Text style={styles.OZAStackAmount}>+ 16,6%</Text>
                  <Text style={styles.OZAEvolutionTime}>
                    {" "}
                    {i18n.t("sur")} 30 J
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.OZAContainer}
                onPress={() => {
                  setOpenConnectBSCWallet(true);
                }}
              >
                <Text style={styles.OZATitle}>{i18n.t("importerWallet")}</Text>
                <Image
                  source={require("../assets/wallet.png")}
                  style={{ height: 40, width: 40, marginLeft: 5 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <BottomSheet ref={transactionsSheetRef} snapPoints={snapPoints}>
            <View style={styles.transactionsContainer}>
              <View style={styles.actionsContainer}>
                <View>
                  <TouchableOpacity
                    style={styles.receiveCash}
                    onPress={() => {
                      setOpenCollect(true);
                    }}
                  >
                    <Image
                      source={require("../assets/receiveCash.png")}
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.actionTitle}>{i18n.t("encaisser")}</Text>
                </View>

                <View>
                  <TouchableOpacity
                    style={styles.transferCash}
                    onPress={() => {
                      setOpenTransfer(true);
                    }}
                  >
                    <Image
                      source={require("../assets/transferCash.png")}
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.actionTitle}>{i18n.t("envoyer")}</Text>
                </View>

                <View>
                  <TouchableOpacity
                    style={styles.askCash}
                    onPress={() => {
                      setOpenAskCash(true);
                    }}
                  >
                    <Image
                      source={require("../assets/askCash.png")}
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.actionTitle}>{i18n.t("demander")}</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.convertCash}
                    // onPress={() => {
                    //   setOpenConvert(true);
                    // }}
                  >
                    <Image
                      source={require("../assets/withdraw.png")}
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.actionTitle}>{i18n.t("retirer")}</Text>
                </View>
              </View>
              <Text style={styles.transactionsTitle}>
                {i18n.t("transactions")}
              </Text>

              {/*  *********************************************
                -------------------- SCROLLVIEW ------------------
                ********************************************** */}
              <View style={{ flex: 1 }}>
                <BottomSheetScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {transactionList.map((transaction, index) => {
                    return (
                      <View style={styles.transactionInfos} key={index}>
                        <View style={styles.transactionLeft}>
                          {transaction.senderWalletId == walletId ? (
                            <Image
                              source={require("../assets/envoi.png")}
                              style={styles.transactionIcon}
                            />
                          ) : (
                            <Image
                              source={require("../assets/recu.png")}
                              style={styles.transactionIcon}
                            />
                          )}

                          <View>
                            {transaction.senderWalletId == walletId ? (
                              <Text style={styles.transactionsText}>
                                {i18n.t("transfert")}
                              </Text>
                            ) : (
                              <Text style={styles.transactionsText}>
                                {i18n.t("réception")}
                              </Text>
                            )}
                            <Text style={styles.transactionsDate}>
                              {transaction.createdAt
                                .slice(0, 10)
                                .split("-")
                                .reverse()
                                .join("-")}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.transactionsRight}>
                          {transaction.senderWalletId == walletId &&
                            transaction.feesGoTo == "sender" &&
                            transaction.type != 3 && (
                              <Text style={styles.transactionsTextMinus}>
                                - {transaction.total} €EUR
                              </Text>
                            )}

                          {transaction.senderWalletId == walletId &&
                            transaction.feesGoTo == "receiver" &&
                            transaction.type != 3 && (
                              <Text style={styles.transactionsTextMinus}>
                                - {transaction.amount} €EUR
                              </Text>
                            )}

                          {transaction.receiverWalletId == walletId &&
                            transaction.feesGoTo == "sender" &&
                            transaction.type != 3 && (
                              <Text style={styles.transactionsTextPlus}>
                                + {transaction.amount} €EUR
                              </Text>
                            )}

                          {transaction.receiverWalletId == walletId &&
                            transaction.feesGoTo == "receiver" &&
                            transaction.type != 3 && (
                              <Text style={styles.transactionsTextPlus}>
                                +{" "}
                                {Math.round(
                                  parseFloat(
                                    transaction.amount.replace(/,/g, ".")
                                  ) * 100
                                ) /
                                  100 -
                                  Math.round(
                                    parseFloat(
                                      transaction.fees.replace(/,/g, ".")
                                    ) * 100
                                  ) /
                                    100}{" "}
                                €EUR
                              </Text>
                            )}

                          {transaction.type == 3 && (
                            <Text style={styles.transactionsTextPlus}>
                              - {transaction.amount} €EUR
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </BottomSheetScrollView>
              </View>
            </View>
          </BottomSheet>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    backgroundColor: "#373945",
  },

  walletOverview: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#089baa",
    width: "90%",
    height: "35%",
    padding: 15,
    borderRadius: 20,
  },

  OZAContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
    backgroundColor: "#fbbb2aeb",
    padding: 10,
    marginBottom: 6,
  },

  warningContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
    backgroundColor: "#ffffff40",
    padding: 10,
    marginTop: 12,
    marginBottom: 10,
  },

  EURTitle: {
    color: "#ffffff",
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
  },

  EURText: {
    color: "#ffffff",
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
    marginTop: 10,
  },

  OZATitle: {
    color: "#373945",
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
  },

  OZAText: {
    color: "#ffffff",
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
  },

  EURStackAmount: {
    color: "#FFFFFF",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
  },

  OZAStackAmount: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
  },

  evolution: {
    alignItems: "flex-end",
    width: "30%",
  },

  warningTitle: {
    color: "#ffffff",
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "700",
    textAlign: "center",
  },

  warningText: {
    color: "#ffffff",
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",

    textAlign: "center",
  },

  OZAEvolutionText: {
    color: "#373945",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
  },

  OZAEvolutionTime: {
    color: "#373945",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  rechargeButton: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#089baa",
    borderRadius: 20,
    height: 27,
    width: 79,
    padding: 6,
  },

  rechargeButtonText: {
    fontSize: RFPercentage(1.2),
    fontFamily: "Jost",
    color: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: "5%",
    paddingRight: "5%",
    paddingTop: "16%",
    marginBottom: "8%",
  },

  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    height: 28,
    width: 28,
    borderRadius: 50,
    marginRight: 10,
  },

  logo: {
    height: 18,
    width: 113,
  },

  headerRightIcons: {
    width: "30%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  notif: {
    height: 22,
    width: 22,
    marginRight: 10,
  },

  welcomeText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    color: "#ffffff",
    fontWeight: "700",
  },

  headerText: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#ffffff",
  },

  userPicture: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  EURAmountContainer: {
    display: "flex",
    width: "100%",
    borderBottomColor: "#ffffff",
    alignItems: "center",
  },

  EURAmount: {
    flexDirection: "row",
    color: "#ffffff",
    fontSize: RFPercentage(4.2),
    fontFamily: "Jost",
    fontWeight: "700",
  },

  EURAmountEUR: {
    flexDirection: "row",
    color: "#ffffff",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    marginBottom: 10,
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  scrollView: {
    height: "100%",
  },

  transactionsContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: "100%",
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
    marginTop: 10,
  },

  actionIcon: {
    width: 40,
    height: 40,
  },

  actionTitle: {
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
    color: "#373945",
    marginTop: 5,
    textAlign: "center",
  },

  receiveCash: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#e25a84",
    width: 60,
    height: 60,
  },

  transferCash: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f7be07",
    width: 60,
    height: 60,
  },

  askCash: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#089baa",
    width: 60,
    height: 60,
  },

  convertCash: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#373945",
    width: 60,
    height: 60,
  },

  transactionsTitle: {
    alignSelf: "flex-start",
    fontWeight: "700",
    color: "#373945",
    fontSize: RFPercentage(2.1),
    fontFamily: "Jost",
    color: "#373945",
    marginBottom: "3%",
  },

  transactions: {
    padding: "5%",
    width: "100%",
    marginTop: "5%",
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    color: "#1F1F1F",
  },

  transactionInfos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "3%",
    borderWidth: 1,
    borderColor: "#b5b5b5",
    borderRadius: 8,
    padding: "3%",
  },

  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "60%",
  },

  transactionRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "40%",
  },

  transactionIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },

  transactionsText: {
    fontSize: RFPercentage(1.9),
    marginLeft: 2,
    fontWeight: "bold",
    fontFamily: "Jost",
    color: "#373945",
  },

  transactionsTextMinus: {
    fontSize: RFPercentage(1.9),
    marginLeft: 2,
    fontWeight: "bold",
    fontFamily: "Jost",
    color: "#373945",
  },

  transactionsTextPlus: {
    fontSize: RFPercentage(1.9),
    marginLeft: 2,
    fontWeight: "bold",
    fontFamily: "Jost",
    color: "#089baa",
  },

  transactionsDate: {
    fontSize: RFPercentage(1.9),
    marginLeft: 2,
    fontWeight: "bold",
    fontFamily: "Jost",
    color: "#8e9991",
  },

  transactionsAmountContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  transactionsAmount: {
    fontSize: RFPercentage(1.9),
    marginLeft: 2,
    color: "#0EA1B1",
    fontFamily: "JostBold",
    justifyContent: "space-between",
  },

  transactionsAmountMinus: {
    fontSize: RFPercentage(1.9),
    marginLeft: 2,
    color: "#8e9991",
    fontFamily: "JostBold",
  },

  eyeContainer: {
    width: 20,
    height: 20,
  },

  eye: {
    width: "100%",
    height: "100%",
  },

  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
