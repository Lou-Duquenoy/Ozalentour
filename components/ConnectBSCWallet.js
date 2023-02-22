import { useState, useEffect, useContext } from "react";
import { DataContext } from "../components/Context";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";
import axios from "axios";

const BASE_URL = "https://api007.ozalentour.com";

export default function connectBSCWallet() {
  const { locale, setOpenConnectBSCWallet, setBSCWallet } =
    useContext(DataContext);
  const [key, setKey] = useState("");
  const [firstCheckBox, setFirstCheckBox] = useState(0);
  const [secondCheckBox, setSecondCheckBox] = useState(0);
  const [submit, setSubmit] = useState(false);
  const [inputWarning, setInputWarning] = useState(false);
  const [checkBoxWarning, setCheckBoxWarning] = useState(false);
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState(false);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  useEffect(() => {
    const getData = async () => {
      let getToken = await AsyncStorage.getItem("token");
      setToken(getToken);
    };

    getData();
    const backAction = () => {
      setOpenConnectBSCWallet(false);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const onSubmit = () => {
    setInputWarning(false);
    setCheckBoxWarning(false);

    !key && setInputWarning(true);

    if (firstCheckBox == 0 || secondCheckBox == 0) {
      setCheckBoxWarning(true);
    }

    if (key && firstCheckBox == 1 && secondCheckBox == 1) {
      setSubmit(true);

      let newUserData = {
        BSCWallet: key,
      };

      axios
        .post(
          `${BASE_URL}/user/update`,
          {
            token: token,
            newUserData: newUserData,
          },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        )
        .then(async function (res) {
          if (res.status == 200) {
            let BSCAmount = await axios.post(
              `${BASE_URL}/user/getBSCBalance`,
              {
                token: token,
                BSCWallet: key,
              },
              {
                headers: {
                  "Content-Type": "application/json; charset=UTF-8",
                },
              }
            );

            AsyncStorage.setItem("BSCAmount", BSCAmount.data);
            AsyncStorage.setItem("BSCWallet", key);
            setBSCWallet(key);
            setSuccess(true);
          }
        });
    }
  };

  return (
    <>
      <View style={styles.container}>
        {!success ? (
          <View style={styles.main}>
            <TouchableOpacity
              onPress={() => {
                setOpenConnectBSCWallet(false);
              }}
              style={styles.arrowContainer}
            >
              <Image
                style={styles.arrow}
                source={require("../assets/arrowHeader.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.OZALogo}
              source={require("../assets/OZA.png")}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t("importerMonWallet")}</Text>
              <Text style={styles.title}>OZACOIN ($OZA)</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t("cléBSC")}</Text>
              <TextInput
                style={styles.key}
                onChangeText={(e) => {
                  setKey(e);
                }}
                value={key}
                placeholder={"X000 ..."}
              />
            </View>

            <View style={{ marginTop: "10%" }}>
              <View style={styles.checkBoxContainer}>
                <BouncyCheckbox
                  style={styles.checkBox}
                  size={30}
                  unfillColor={"#373945"}
                  onPress={() => setFirstCheckBox(1)}
                />

                <Text style={styles.checkBoxText}>
                  {i18n.t("attestationHonneur")}
                </Text>
              </View>

              <View style={styles.checkBoxContainer}>
                <BouncyCheckbox
                  style={styles.checkBox}
                  size={30}
                  unfillColor={"#373945"}
                  onPress={() => setSecondCheckBox(1)}
                />

                <Text style={styles.checkBoxText}>
                  {i18n.t("cléEnregistrée")}
                </Text>
              </View>
              {inputWarning && (
                <Text style={styles.warning}>{i18n.t("renseignerCLé")}</Text>
              )}

              {checkBoxWarning && (
                <Text style={styles.warning}>{i18n.t("warningCheckbox")}</Text>
              )}
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
        ) : (
          <View style={styles.main}>
            <TouchableOpacity
              onPress={() => {
                setOpenConnectBSCWallet(false);
              }}
              style={styles.arrowContainer}
            >
              <Image
                style={styles.arrow}
                source={require("../assets/arrowHeader.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.OZALogo}
              source={require("../assets/success.png")}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t("importation")}</Text>
              <Text style={styles.title}>
                OZACOIN ($OZA) {i18n.t("réussie")} !
              </Text>
            </View>
            <Text style={styles.text}>
              {i18n.t("félicitations")} OZACOIN's ($OZA)
            </Text>

            <TouchableOpacity style={styles.returnContainer}>
              <Pressable
                style={styles.return}
                onPress={() => {
                  setOpenConnectBSCWallet(false);
                }}
              >
                <Text style={styles.submitText}>{i18n.t("retour")}</Text>
              </Pressable>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "#373945",
    zIndex: 3000,
  },

  arrowContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },

  arrow: {
    width: 40,
    height: 40,
  },

  main: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: "98%",
    borderRadius: 20,
    padding: 25,
    marginTop: "5%",
  },

  OZALogo: {
    height: 150,
    width: 150,
    marginTop: "3%",
  },

  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
  },

  title: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    fontWeight: "600",
    color: "#373945",
  },

  text: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "600",
    color: "#373945",
    textAlign: "center",
    marginTop: "10%",
  },

  inputContainer: {
    marginTop: "20%",
    width: "100%",
    alignItems: "flex-start",
    height: "8%",
  },

  key: {
    height: "60%",
    width: "100%",
    marginTop: 2,
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "400",
    alignItems: "center",
    justifyContent: "center",
    color: "#373945",
    borderBottomWidth: 1,
    borderColor: "#373945",
    padding: 10,
  },

  label: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "400",
    color: "#373945",
  },

  checkBoxContainer: {
    flexDirection: "row",
    marginBottom: "5%",
    paddingRight: 10,
    width: "100%",
  },

  checkBox: {
    marginTop: "5%",
    marginLeft: 5,
  },

  touchable: {
    marginTop: "10%",
    width: "100%",
    height: "15%",
    alignItems: "center",
    alignSelf: "center",
    alignItems: "center",
  },

  submit: {
    width: "60%",
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

  warning: {
    textAlign: "center",
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#e25a84",
  },

  returnContainer: {
    marginTop: "20%",
    width: "50%",
    height: "6 %",
  },

  return: {
    width: "100%",
    height: "100%",
    padding: 10,
    backgroundColor: "#089baa",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
