import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useState, useContext } from "react";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";
import { DataContext } from "./Context";

const BASE_URL = "https://api007.ozalentour.com";

export default function ResetPassword({ showResetPassword }) {
  const { locale } = useContext(DataContext);
  const [warningEmail, setWarningEmail] = useState(false);
  const [warning, setWarning] = useState(false);
  const [warningPassword, setWarningPassword] = useState(false);
  const [warningNotFound, setWarningNotFound] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  const onSubmitEmail = () => {
    setWarning(false);
    setWarningEmail(false);

    console.log(email);

    if (
      !email ||
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setWarningEmail(true);
    } else {
      axios
        .post(
          `${BASE_URL}/user/resetPasswordCode`,

          {
            email: email,
          },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        )
        .catch(function (error) {
          console.error(error);
          setWarningNotFound(true);
        })
        .then((res) => {
          console.log(res);
          res && res.status == 200 && setResetStep(1);
        });
    }
  };

  const onSubmitCode = () => {
    setWarning(false);
    setWarningPassword(false);

    if (!token) {
      setWarning(true);
    } else if (
      password != confirmPassword ||
      !password ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^:;,?µ£¨<>+=&-*]).{12,}$/.test(
        password
      )
    ) {
      setWarningPassword(true);
    } else {
      axios
        .post(
          `${BASE_URL}/user/resetPassword`,

          {
            token: token,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        )
        .catch(function (error) {
          console.error(error);
        })
        .then((res) => {
          console.log(res);
          res && res.status == 200 && setResetStep(2);
        });
    }
  };

  switch (resetStep) {
    case 0:
      return (
        <View style={styles.container}>
          <Pressable
            style={styles.returnContainer}
            onPress={() => {
              showResetPassword(false);
            }}
          >
            <Image
              source={require("../assets/arrowHeader.png")}
              style={styles.arrow}
              resizeMode="contain"
            />

            <Text style={styles.return}>{i18n.t("retour")}</Text>
          </Pressable>
          <Image
            style={styles.image}
            source={require("../assets/ozaLogo.png")}
            resizeMode="contain"
          />
          <Text style={styles.title}>{i18n.t("récupération")}</Text>
          <Text>{i18n.t("motDePassePerdu")}</Text>
          <Text>{i18n.t("renseignezEmail")}</Text>

          <Text style={styles.label}>{i18n.t("adresseEmail")}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          {warningEmail && (
            <Text style={styles.warning}>{i18n.t("emailPasValide")}</Text>
          )}

          {warningNotFound && (
            <Text style={styles.warning}>{i18n.t("aucunCompte")}</Text>
          )}
          <TouchableOpacity>
            <Pressable style={styles.button} onPress={onSubmitEmail}>
              <Text style={styles.buttonText}>{i18n.t("valider")}</Text>
            </Pressable>
          </TouchableOpacity>
        </View>
      );

    case 1:
      return (
        <View style={styles.container}>
          <Pressable
            style={styles.returnContainer}
            onPress={() => {
              setResetStep(0);
            }}
          >
            <Image
              source={require("../assets/arrowHeader.png")}
              style={styles.arrow}
              resizeMode="contain"
            />

            <Text style={styles.return}>{i18n.t("retour")}</Text>
          </Pressable>
          <Image
            style={styles.image}
            source={require("../assets/ozaLogo.png")}
            resizeMode="contain"
          />
          <Text>{i18n.t("récupération")}</Text>
          <Text>{i18n.t("renseignerCode")}</Text>

          <Text style={styles.label}>{i18n.t("vérificationCode")}</Text>
          <TextInput
            style={styles.input}
            value={token}
            onChangeText={setToken}
          />
          {warning && (
            <Text style={styles.warning}>{i18n.t("champsRequis")}</Text>
          )}

          <Text>{i18n.t("choisirNouveau")}</Text>

          <Text style={styles.label}>{i18n.t("motDePasse")}</Text>
          <View>
            <TextInput
              style={styles.input}
              secureTextEntry={showPassword ? false : true}
              value={password}
              onChangeText={setPassword}
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

          <Text style={styles.label}>{i18n.t("confirmerNouveau")}</Text>
          <View>
            <TextInput
              style={styles.input}
              secureTextEntry={showPassword ? false : true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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

          <TouchableOpacity>
            {warningPassword && (
              <>
                <Text style={styles.warning}>
                  {i18n.t("motsDePasseIdentiques")}
                </Text>
                <Text style={styles.warning}>
                  {i18n.t("motDePasseWarning")}
                </Text>
              </>
            )}
            <Pressable style={styles.button} onPress={onSubmitCode}>
              <Text style={styles.buttonText}>{i18n.t("valider")}</Text>
            </Pressable>
          </TouchableOpacity>
        </View>
      );

    case 2:
      return (
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../assets/ozaLogo.png")}
            resizeMode="contain"
          />
          <Text style={styles.title}>{i18n.t("motDePasseModifié")}</Text>
          <TouchableOpacity>
            <Pressable
              style={styles.button}
              onPress={() => {
                showResetPassword(false);
              }}
            >
              <Text style={styles.buttonText}>{i18n.t("seConnecter")}</Text>
            </Pressable>
          </TouchableOpacity>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: "10%",
    backgroundColor: "#ffffff",
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

  image: {
    width: "80%",
    height: "10%",
  },

  title: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
    marginTop: 10,
    marginBottom: 10,
  },

  label: {
    fontSize: RFPercentage(2.2),
    fontFamily: "Jost",
    color: "#373945",
    marginTop: 30,
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

  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#089baa",
    borderRadius: 20,
    width: "100%",
    height: 40,
    padding: "1.5%",
    marginTop: "10%",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: RFPercentage(2),

    fontFamily: "Jost",
  },

  warning: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#e25a84",
    marginTop: "3%",
    marginBottom: "3%",
  },
});
