import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "./Context";
import Register from "./Register";
import ResetPassword from "./ResetPassword";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";

const BASE_URL = "https://api007.ozalentour.com";
//const BASE_URL = "http://localhost:8000";

let loginToken = null;

export default function Login({ setTransactions }) {
  const { setLogin, setToken, setWalletId, locale, setLocale, setBSCAmount } =
    useContext(DataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStep, setLoginStep] = useState(0);
  const [askLogin, setAskLogin] = useState(false);
  const [warning, setWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  const submitHandler = () => {
    console.log(email, password);
    setAskLogin(true);

    let data = {
      email: email,
      password: password,
    };

    axios
      .post(
        `${BASE_URL}/login`,

        {
          data: data,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          setAskLogin(false);
          setWarning(true);
        }
      })
      .then(async function (res) {
        console.log("result", res);
        if (res != undefined) {
          loginToken = res.data.token;
          await AsyncStorage.setItem("token", loginToken);

          const data = await axios.post(
            `${BASE_URL}/user/getData`,

            {
              token: loginToken,
            },
            {
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          );
          console.log(data.data.EUR);
          AsyncStorage.setItem("EUR", data.data.EUR.toString());
          AsyncStorage.setItem("firstName", data.data.firstName);
          AsyncStorage.setItem("lastName", data.data.lastName);
          AsyncStorage.setItem("walletId", data.data.walletId);
          AsyncStorage.setItem("avatar", data.data.avatar);
          AsyncStorage.setItem("BSCWallet", data.data.BSCWallet);

          console.log(data.data);
          axios
            .post(
              `${BASE_URL}/user/getBSCBalance`,
              {
                token: res.data.token,
                BSCWallet: data.data.BSCWallet,
              },
              {
                headers: {
                  "Content-Type": "application/json; charset=UTF-8",
                },
              }
            )
            .then((data) => {
              AsyncStorage.setItem("BSCAmount", data.data);
              setBSCAmount(data.data);
            });

          setToken(res.data.token);
          setWalletId(data.data.walletId);

          setLogin(1);
        }
      });
  };

  switch (loginStep) {
    case 0:
      return (
        <>
          <View style={styles.container}>
            <View style={styles.phonePictureContainer}>
              <Image
                style={styles.phonePicture}
                source={require("../assets/phoneRegister.jpg")}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.loginTitle}>{i18n.t("compte")}</Text>
            <Text style={styles.loginText}>{i18n.t("appPaiement")}</Text>
            <TouchableOpacity>
              <Pressable
                style={styles.mailButton}
                onPress={() => {
                  setLoginStep(1);
                }}
              >
                <Text style={styles.buttonText}>{i18n.t("seConnecter")}</Text>
              </Pressable>
            </TouchableOpacity>

            {locale == "en" ? (
              <TouchableOpacity
                onPress={() => {
                  setLocale("fr");
                }}
              >
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    alignSelf: "center",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                  source={require("../assets/flagFr.jpg")}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setLocale("en");
                }}
              >
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    alignSelf: "center",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                  source={require("../assets/flagEn.png")}
                />
              </TouchableOpacity>
            )}
            {/*   <TouchableOpacity>
              <Pressable style={styles.googleButton}>
                <Image
                  source={require("../assets/google.png")}
                  style={styles.googleIcon}
                  resizeMode="contain"
                />
                <Text style={styles.googleButtonText}>
                  Connexion via Google
                </Text>
              </Pressable>
            </TouchableOpacity> */}

            <Text style={styles.registerText}>
              {i18n.t("pasInscrit")}{" "}
              <Text
                onPress={() => {
                  setLoginStep(2);
                }}
                style={styles.registerLink}
              >
                {" "}
                {i18n.t("ouvrirCompte")}{" "}
              </Text>
            </Text>
          </View>
        </>
      );

    case 1:
      return openResetPassword ? (
        <ResetPassword showResetPassword={setOpenResetPassword} />
      ) : (
        <View style={styles.container}>
          <View style={styles.loginHeader}>
            <Pressable
              style={styles.returnContainer}
              onPress={() => {
                setLoginStep(0);
              }}
            >
              <Image
                source={require("../assets/arrowHeader.png")}
                style={styles.arrow}
                resizeMode="contain"
              />

              <Text style={styles.return}> {i18n.t("retour")}</Text>
            </Pressable>

            <Image
              source={require("../assets/help.png")}
              style={styles.help}
              resizeMode="contain"
            />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.loginLabel}> {i18n.t("adresseEmail")}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            ></TextInput>
            <Text style={styles.loginLabel}> {i18n.t("motDePasse")}</Text>
            <View>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={showPassword ? false : true}
              />

              <TouchableOpacity
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
                style={styles.eyeContainer}
              >
                <Image
                  style={styles.eye}
                  source={
                    showPassword
                      ? require("../assets/hidden.png")
                      : require("../assets/show.png")
                  }
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {warning ? (
              <Text style={styles.warning}>{i18n.t("pasValide")}</Text>
            ) : null}
            <Text style={styles.lostPasswordText}>{i18n.t("perdu")}</Text>
            <TouchableOpacity
              onPress={() => {
                setOpenResetPassword(true);
              }}
            >
              <Text style={styles.lostPasswordLink}>
                {i18n.t("réinitialisez")}
              </Text>
            </TouchableOpacity>

            {!askLogin ? (
              <TouchableOpacity>
                <Pressable style={styles.loginButton} onPress={submitHandler}>
                  <Text style={styles.loginButtonText}>
                    {i18n.t("seConnecter")}
                  </Text>
                </Pressable>
              </TouchableOpacity>
            ) : (
              <ActivityIndicator size="large" color="#14b9c5" />
            )}
          </View>
        </View>
      );

    case 2:
      return <Register />;
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: "10%",
    backgroundColor: "#ffffff",
  },

  phonePictureContainer: {
    width: "100%",
    alignItems: "center",
  },

  phonePicture: {
    width: 230,
    height: 230,
    marginTop: 20,
    marginBottom: 10,
  },

  loginTitle: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    fontWeight: "bold",
    width: "80%",
    marginBottom: 20,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 26,
  },

  loginText: {
    fontSize: RFPercentage(2.2),
    fontFamily: "Jost",
    color: "#373945",
    marginBottom: 30,
    alignSelf: "center",
    textAlign: "center",
  },

  loginLabel: {
    fontSize: RFPercentage(2.2),
    fontFamily: "Jost",
    color: "#373945",
    marginTop: 20,
  },

  mailButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 52,
    padding: 15,
    backgroundColor: "#089baa",
    borderRadius: 30,
    marginBottom: 15,
  },

  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#089baa",
    borderRadius: 30,
    marginBottom: 20,
  },

  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  buttonText: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#FFFFFF",
  },

  googleButtonText: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    color: "#14b9c5",
  },

  registerText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    color: "#373945",
    margin: "auto",
    alignSelf: "center",
  },

  registerLink: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    color: "#14b9c5",
    margin: "auto",
  },

  lostPasswordText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    color: "#373945",
    margin: "auto",
    alignSelf: "center",
  },

  lostPasswordLink: {
    alignSelf: "center",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    color: "#14b9c5",
    margin: "auto",
  },

  input: {
    width: "100%",
    height: 30,
    marginTop: 5,
    marginBottom: 25,
    borderBottomWidth: 1,
    borderColor: "#373945",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
  },

  eyeContainer: {
    position: "absolute",
    bottom: 30,
    right: 0,
    zIndex: 3000,
    width: 30,
    height: 30,
  },

  eye: {
    width: "100%",
    height: "100%",
  },

  ozaphyreContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: "95%",
  },

  ozaphyreGradient: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: "95%",
    padding: "5%",
  },

  ozaphyreLogo: {
    width: 20,
    height: 20,
    marginTop: 1,
    marginLeft: 4,
  },

  ozaphyre: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  ozaphyreTitle: {
    flexDirection: "row",
  },

  ozaphyreText: {
    color: "#ffffff",
    fontSize: RFPercentage(2.5),

    fontFamily: "Jost",
  },

  rechargeButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    width: "35%",
    padding: "1.5%",
    marginLeft: "4%",
  },

  rechargeButtonText: {
    fontWeight: "600",
    color: "#089baa",
  },

  loginHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 50,
  },

  returnContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "30%",
  },

  arrow: {
    width: 40,
    height: 40,
  },

  return: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "500",
    color: "#373945",
  },

  help: {
    width: 20,
    height: 20,
  },

  warning: {
    alignSelf: "center",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#e25a84",
    marginTop: "3%",
    marginBottom: "3%",
  },

  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#089baa",
    borderRadius: 20,
    width: "100%",
    height: 40,
    padding: "1.5%",
    marginTop: "10%",
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: RFPercentage(2),

    fontFamily: "Jost",
  },
});
