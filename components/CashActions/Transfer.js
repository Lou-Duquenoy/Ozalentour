import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DataContext } from "../Context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SendCashRecap from "../CashRecap/SendCashRecap";
import Shimmer from "../Shimmer";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";

export default function Transfer({ updateWallet }) {
  const { setOpenTransfer, openSendCashRecap, setOpenSendCashRecap, locale } =
    useContext(DataContext);

  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [receiversList, setReceiversList] = useState([]);
  const [receiverWalletId, setReceiverWalletId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverAvatar, setReceiverAvatar] = useState("");
  const [receiverFocus, setReceiverFocus] = useState(null);
  const [senderWalletId, setSenderWalletId] = useState(false);
  const [motive, setMotive] = useState("");
  const [warning, setWarning] = useState(false);
  const [token, setToken] = useState("");
  const [activeShimmer, setActiveShimmer] = useState(false);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  // When the component mounts, we get the user token and the user public key from the async storage
  useEffect(() => {
    async function getData() {
      let getToken = await AsyncStorage.getItem("token");
      let getSenderwalletId = await AsyncStorage.getItem("walletId");

      setToken(getToken);
      setSenderWalletId(getSenderwalletId);
    }

    getData();

    const backAction = () => {
      setOpenTransfer(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // If the receiver input contains a value, we fetch the users in the database that match
  useEffect(() => {
    setActiveShimmer(true);
    receiver
      ? axios
          .post(
            `${BASE_URL}/user/getUserForTransaction`,

            { token: token, user: receiver },
            {
              //withCredentials: true,
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          )
          .then((res) => {
            let list = res.data.user;
            setReceiversList(list.slice(0, 10));

            console.log(receiversList);
            console.log(res.data.user);
            setActiveShimmer(false);
          })
      : "";
  }, [receiver]);

  console.log(receiversList);

  // If all the fields are filled, we call setOpenCashRecap
  const onSubmit = () => {
    if (amount && receiverName && motive) {
      setOpenSendCashRecap(true);
    } else {
      setWarning(true);
    }
  };

  // If a receiver is selected, we get his complete ans his wallet key
  const selectReceiver = (index) => {
    let receiver = receiversList[index].walletId;
    let receiverAvatar = receiversList[index].avatar;
    let receiverName =
      receiversList[index].firstName + " " + receiversList[index].lastName;

    setReceiverWalletId(receiver);
    setReceiverAvatar(receiverAvatar);
    setReceiverName(receiverName);
    console.log(
      receiversList[index].firstName + " " + receiversList[index].lastName
    );
  };

  // When the component mounts we display the inputs
  return !openSendCashRecap ? (
    <>
      <View style={styles.container}>
        <View style={styles.transferHeader}>
          <View>
            <Pressable
              onPress={() => {
                setOpenTransfer(false), setReceiverFocus(null);
              }}
            >
              <Image
                source={require("../../assets/arrowHeader.png")}
                style={styles.arrow}
              />
            </Pressable>
          </View>
          <Text style={styles.titleHeader}>{i18n.t("envoyer")}</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              caretHidden={true}
              onChangeText={(e) => {
                setAmount(e);
              }}
              value={amount}
            />
            <Text style={styles.fakeInput}>
              {amount || "0"}
              <Text
                style={{
                  fontSize: RFPercentage(3),
                  textAlignVertical: "center",
                }}
              >
                €EUR
              </Text>
            </Text>
          </View>

          <Text style={styles.search}>{i18n.t("rechercheBénéficiaire")}</Text>
          {receiverFocus == null && (
            <TextInput
              style={styles.receiverInput}
              caretHidden={true}
              onChangeText={(e) => {
                setReceiver(e);
              }}
              value={receiver}
              placeholder={i18n.t("recherchePlaceholder")}
            />
          )}

          {/* If there is no receiver selected, we display the previous contacts list */}
          {!receiver ? (
            <>
              <Text style={styles.selectReceiverText}>
                {i18n.t("sélectionnerBénéficiaire")}
              </Text>
              <View style={styles.scrollViewContainer}>
                <ScrollView style={styles.receiversContainer}>
                  <Text style={styles.receiversText}>
                    {i18n.t("pasDeBénéficiaire")}
                  </Text>
                </ScrollView>
              </View>
              <Text style={styles.contacts}>{i18n.t("contacts")}</Text>
            </>
          ) : /* If the search input contains a value, we map on the receivers list to display all the results */
          receiverFocus == null ? (
            <View style={{ width: "80%", height: "40%" }}>
              <ScrollView
                contentContainerStyle={{
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                {receiversList.map((user, index) => {
                  console.log(index);
                  return activeShimmer ? (
                    <View
                      key={index}
                      style={{
                        width: 200,
                        height: 30,
                        borderRadius: 50,
                        marginTop: 10,
                      }}
                    >
                      <Shimmer />
                    </View>
                  ) : (
                    <TouchableOpacity
                      key={index}
                      style={styles.receiverData}
                      onPress={() => {
                        selectReceiver(index), setReceiverFocus(index);
                      }}
                    >
                      <Image
                        style={styles.receiverAvatar}
                        source={require("../../assets/userPlaceholder.png")}
                        resizeMode="cover"
                      />
                      <Text
                        style={
                          receiverFocus == index
                            ? styles.receiverFocus
                            : styles.receiver
                        }
                      >
                        {user.firstName + " " + user.lastName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            /* If a receiver is focused, we replace the input and all the results vy its avatar and name */
            <TouchableOpacity
              style={styles.receiverData}
              onPress={() => {
                setReceiverFocus(null);
              }}
            >
              <Image
                style={styles.receiverAvatar}
                source={require("../../assets/userPlaceholder.png")}
                resizeMode="cover"
              />
              <Text style={styles.receiverFocus}>{receiverName}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.note}>{i18n.t("note")}</Text>
          <TextInput
            style={styles.motiveInput}
            caretHidden={true}
            onChangeText={(e) => {
              setMotive(e);
            }}
            value={motive}
            placeholder={i18n.t("descriptionPlaceholder")}
          />
          {warning ? (
            <Text style={styles.warning}>{i18n.t("descriptionWarning")}</Text>
          ) : null}
          <TouchableOpacity style={styles.touchable}>
            <Pressable style={styles.submit} onPress={onSubmit}>
              <Text style={styles.submitText}>
                {i18n.t("envoyerMaintenant")}
              </Text>
            </Pressable>
          </TouchableOpacity>
        </View>
      </View>
    </>
  ) : (
    <SendCashRecap
      amount={amount}
      receiverName={receiverName}
      receiverWalletId={receiverWalletId}
      motive={motive}
      updateWallet={updateWallet}
      receiverAvatar={receiverAvatar}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#373945",
    zIndex: 3000,
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

  transferHeader: {
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
    marginRight: "43%",
  },

  search: {
    alignSelf: "flex-start",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    marginTop: "7%",
    marginLeft: "5%",
  },

  note: {
    alignSelf: "flex-start",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    marginTop: "5%",
    marginLeft: "5%",
  },

  arrow: {
    width: 40,
    height: 40,
  },

  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
  },

  amountInput: {
    fontSize: RFPercentage(5),
    fontFamily: "Jost",
    fontWeight: "600",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    color: "transparent",
    textAlign: "center",
    marginLeft: -18,
  },

  fakeInput: {
    fontSize: RFPercentage(5),
    fontFamily: "Jost",
    fontWeight: "600",
    position: "absolute",
    left: 10,
    width: "100%",
    textAlign: "center",
    zIndex: -1,
    color: "#373945",
  },

  currency: {
    justifyContent: "center",
    marginRight: "10%",
  },

  currencyText: {
    fontSize: RFPercentage(4.5),
    fontFamily: "Jost",
    fontWeight: "600",
    color: "#686c82",
  },

  receiverInput: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "400",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "7%",
    color: "#373945",
    borderBottomWidth: 1,
    borderColor: "#373945",
    marginTop: 20,
    padding: 10,
  },

  motiveInput: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "400",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "5%",
    color: "#373945",
    borderBottomWidth: 1,
    borderColor: "#373945",
    marginTop: 20,
    padding: 10,
  },

  selectReceiverText: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#089baa",
    marginTop: 20,
  },

  scrollViewContainer: {
    height: "30%",
    width: "80%",
  },

  receiversContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 10,
    marginTop: 20,
  },

  receiversText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    textAlign: "center",
  },

  contacts: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#089baa",
    marginTop: 20,
  },

  receiverData: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "5%",
  },

  receiverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 15,
  },

  receiver: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#089baa",
  },

  receiverFocus: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#f7be07",
  },

  receiverInfos: {
    flexDirection: "row",
  },

  receiverPicture: {
    width: 25,
    height: 25,
    borderRadius: 30,
    marginRight: 10,
  },

  receiverName: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#373945",
    fontWeight: "700",
    marginBottom: 20,
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

  confirmationTitle: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    marginBottom: 20,
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
    color: "#373945",
    marginBottom: 5,
    fontWeight: "600",
  },

  successTextAmount: {
    fontSize: RFPercentage(2.4),
    fontFamily: "Jost",
    color: "#373945",
    fontWeight: "700",
    marginBottom: 5,
  },

  successTextReceiver: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#373945",
    fontWeight: "600",
  },

  successPicture: {
    width: 200,
    height: 200,
    margin: 20,
  },

  touchable: {
    marginTop: "10%",
    width: "100%",
    height: "7%",
  },

  warning: {
    alignSelf: "center",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#e25a84",
    marginTop: "5%",
  },
});
