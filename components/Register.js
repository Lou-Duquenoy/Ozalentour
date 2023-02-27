import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useEffect, useState, useContext } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import PhoneInput from "react-native-phone-input";
import { DataContext } from "./Context";
import axios from "axios";
import Login from "./Login";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";
import Onboarding from "./Onboarding";

const BASE_URL = "https://api007.ozalentour.com";

export default function Register() {
  const {
    login,
    setLogin,
    locale,
    wasAppOpenedPreviously,
    setWasAppOpenedPreviously,
  } = useContext(DataContext);
  const [boxSelected, setBoxSelected] = useState(false);
  const [userData, setUserData] = useState({
    lastName: "",
    firstName: "",
    password: "",
    verifyPassword: "",
    city: "",
    phone: "",
    email: "",
    emailCode: "",
    phoneCode: "",
  });
  const [checkBox, setCheckBox] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const [emptyInputError, setEmptyInputError] = useState(false);
  const [passwordTypeError, setPasswordTypeError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [checkBoxError, setCheckBoxError] = useState(false);
  const [emailTypeError, setEmailTypeError] = useState(false);
  const [phoneTypeError, setPhoneTypeError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dataSent, setDataSent] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  let passwordType = false;
  let passwordMatch = false;
  let emailType = false;
  let phoneType = false;

  const onSubmitFirstStep = () => {
    setEmptyInputError(false);
    setPasswordTypeError(false);
    setPasswordTypeError(false);

    console.log(userData, checkBox);
    let password = userData.password;

    if (userData.lastName.trim().length !== 0) {
      console.log("input value is NOT empty");
    } else {
      console.log("lastName value is empty");
      setEmptyInputError(true);
    }

    if (userData.firstName.trim().length !== 0) {
      console.log("input value is NOT empty");
    } else {
      console.log("firstName value is empty");
      setEmptyInputError(true);
    }

    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!-@#$%^:;,?µ£¨<>+=&*]).{12,}$/.test(
        password
      )
    ) {
      passwordType = true;
      console.log("passwordType ok");
    } else {
      setPasswordTypeError(true);
      console.log("passwordType error");
    }

    if (userData.password == userData.verifyPassword) {
      passwordMatch = true;
      console.log("passwordMatch ok");
    } else {
      setPasswordMatchError(true);
      console.log("passwordMatch error");
    }

    if (!checkBox) {
      setCheckBoxError(true);
    }

    passwordType && passwordMatch && checkBox && !emptyInputError
      ? setFormStep(2)
      : console.log(passwordType, passwordMatch);
  };

  const onSubmitSecondStep = () => {
    setEmptyInputError(false);
    setEmailTypeError(false);
    setPhoneTypeError(false);

    console.log("on submit", userData);
    let email = userData.email;
    let phone = userData.phone;
    console.log(phone);

    if (userData.city.trim().length !== 0) {
      console.log("city value is NOT empty");
    } else {
      console.log("city value is empty");
      setEmptyInputError(true);
    }

    if (
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      emailType = true;
      console.log("emailType ok");
    } else {
      setEmailTypeError(true);
      console.log("emailType error");
    }

    if (/^\+(?:[0-9]?){6,14}[0-9]$/.test(phone)) {
      phoneType = true;
      console.log("phoneType ok");
    } else {
      setPhoneTypeError(true);
      console.log("phoneType error");
    }

    let data = {
      email: email,
      language: "fr",
    };

    axios
      .post(
        `${BASE_URL}/register/sendRegisterEmail`,
        {
          data: data,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function () {
        emailType && phoneType && !emptyInputError
          ? setFormStep(3)
          : console.log(passwordType, passwordMatch);
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          setEmailWarning(true);
        }
      });
  };

  const onSubmitThirdStep = () => {
    console.log(userData);

    let data = {
      visitorData: userData.email,
      visitorCode: userData.emailCode,
    };

    axios
      .post(
        `${BASE_URL}/register/verifyCode`,
        {
          data,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        console.log(response.status);

        response.status == 200 && setFormStep(4);

        let phone = userData.phone;

        axios
          .post(
            `${BASE_URL}/register/sendRegisterSMS`,
            {
              phone,
            },
            {
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          )
          .then(function (response) {
            console.log(response.data);
            setFormStep(4);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    /* setFormStep(4); */
  };

  const sendCodeAgain = () => {
    axios
      .post(
        `${BASE_URL}/register/sendRegisterSMS`,
        {
          data: userData.phone,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmitFourthStep = () => {
    console.log(userData);

    let data = {
      visitorData: userData.phone,
      visitorCode: userData.phoneCode,
    };

    axios
      .post(
        `${BASE_URL}/register/verifyCode`,
        {
          data,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (res) {
        console.log(res);
        //console.log("final register", userData.password);

        let data = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: userData.password,
          city: userData.city,
          company: userData.company || null,
          siret: userData.siret || null,
          phoneNumber: userData.phone,
          email: userData.email,
        };

        axios
          .post(
            `${BASE_URL}/register/createUser`,
            {
              data: data,
            },
            {
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          )
          .then(function () {
            setFormStep(5);
          })
          .catch(function (error) {
            console.log(error);
          });
      });
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    if (!wasAppOpenedPreviously) {
      setFormStep(7);
    }
  }, [wasAppOpenedPreviously]);

  switch (formStep) {
    /* **********************************************************************
     ---------------------------------- FIRST STEP ----------------------------
     ********************************************************************** */
    case 1:
      return (
        <View style={styles.container}>
          <View style={styles.registerHeader}>
            <TouchableOpacity
              style={styles.returnContainer}
              onPress={() => {
                setLogin(0), setFormStep(6);
              }}
            >
              <Image
                source={require("../assets/registerArrow.png")}
                style={styles.arrow}
                resizeMode="contain"
              />

              <Text style={styles.return}>{i18n.t("retour")}</Text>
            </TouchableOpacity>
            <Image
              source={require("../assets/help.png")}
              style={styles.arrow}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>{i18n.t("inscription")}</Text>
          <Text style={styles.description}>{i18n.t("ouvrezCompte")}</Text>

          <View style={styles.registerForm}>
            <Text style={styles.registerFormLabel}>{i18n.t("nom")}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t("nomPlaceholder")}
              name="lastName"
              onChangeText={(lastName) => {
                setUserData(() => ({ ...userData, lastName }));
              }}
              value={userData.lastName}
            />
            {emptyInputError ? (
              <Text style={styles.registerFormError}>
                {i18n.t("champsRequis")}
              </Text>
            ) : null}

            <Text style={styles.registerFormLabel}>{i18n.t("prénom")}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t("prénomPlaceholder")}
              name="firstName"
              onChangeText={(firstName) => {
                setUserData(() => ({ ...userData, firstName }));
              }}
              value={userData.firstName}
            />
            {emptyInputError ? (
              <Text style={styles.registerFormError}>
                {i18n.t("champsRequis")}
              </Text>
            ) : null}

            <Text style={styles.registerFormLabel}>{i18n.t("motDePasse")}</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder={i18n.t("motDePassePlaceholder")}
                name="password"
                secureTextEntry={showPassword ? false : true}
                onChangeText={(password) => {
                  setUserData(() => ({ ...userData, password }));
                }}
                value={userData.password}
              />
              {showPassword ? (
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(false);
                  }}
                  style={styles.eyeContainer}
                >
                  <Image
                    style={styles.eye}
                    source={require("../assets/hidden.png")}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(true);
                  }}
                  style={styles.eyeContainer}
                >
                  <Image
                    style={styles.eye}
                    source={require("../assets/show.png")}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
            {passwordTypeError ? (
              <Text style={styles.registerFormError}>
                {i18n.t("motDePasseErreur")}
              </Text>
            ) : null}
            <Text style={styles.registerFormLabel}>
              {i18n.t("confirmation")}
            </Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder={i18n.t("confirmationPlaceholder")}
                name="verifyPassword"
                secureTextEntry={showPassword ? false : true}
                onChangeText={(verifyPassword) => {
                  setUserData(() => ({ ...userData, verifyPassword }));
                }}
                value={userData.verifyPassword}
              />
              {showPassword ? (
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(false);
                  }}
                  style={styles.eyeContainer}
                >
                  <Image
                    style={styles.eye}
                    source={require("../assets/hidden.png")}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(true);
                  }}
                  style={styles.eyeContainer}
                >
                  <Image
                    style={styles.eye}
                    source={require("../assets/show.png")}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
            {passwordMatchError ? (
              <Text style={styles.registerFormError}>{i18n.t("match")}</Text>
            ) : null}

            <View style={styles.checkBoxContainer}>
              <BouncyCheckbox
                style={styles.checkBox}
                size={30}
                unfillColor={"#373945"}
                onPress={() => setCheckBox(1)}
              />

              <Text style={styles.checkBoxText}>{i18n.t("conditions")}</Text>
            </View>

            {checkBoxError ? (
              <Text style={styles.registerFormError}>
                {i18n.t("conditionsErreur")}
              </Text>
            ) : null}

            <Pressable style={styles.submit} onPress={onSubmitFirstStep}>
              <Text style={styles.submitText}>{i18n.t("étapeSuivante")}</Text>
            </Pressable>
            <Text style={styles.loginQuestion}>
              {i18n.t("déjàUnCompte")}
              <TouchableOpacity
                onPress={() => {
                  setFormStep(6);
                }}
              >
                <Text style={styles.loginText}>{i18n.t("seConnecter")}</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      );

    /* **********************************************************************
     ---------------------------------- SECOND STEP --------------------------
     ********************************************************************** */

    case 2:
      return (
        <View style={styles.container}>
          <View style={styles.registerHeader}>
            <TouchableOpacity
              style={styles.returnContainer}
              onPress={() => {
                setFormStep(1);
              }}
            >
              <Image
                source={require("../assets/registerArrow.png")}
                style={styles.arrow}
                resizeMode="contain"
              />

              <Text style={styles.return}>{i18n.t("retour")}</Text>
            </TouchableOpacity>
            <Image
              source={require("../assets/help.png")}
              style={styles.arrow}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>
            {i18n.t("informationsComplémentaires")}
          </Text>
          <Text style={styles.description}>{i18n.t("vérification")}</Text>

          <View style={styles.registerForm}>
            <Text style={styles.registerFormLabel}>{i18n.t("ville")}</Text>
            <TextInput
              style={styles.input}
              placeholder={"Inscrivez votre ville"}
              name="ville"
              onChangeText={(city) => {
                setUserData(() => ({ ...userData, city }));
              }}
              value={userData.city}
            />
            {emptyInputError ? (
              <Text style={styles.registerFormError}>
                {i18n.t("champsRequis")}
              </Text>
            ) : null}
            <Text style={styles.registerFormLabel}>{i18n.t("téléphone")}</Text>
            <PhoneInput
              style={styles.input}
              onChangePhoneNumber={(phone) => {
                setUserData(() => ({ ...userData, phone }));
              }}
              initialCountry={"fr"}
              flagStyle={{
                width: 40,
                height: 25,
                borderWidth: 0,
              }}
            />
            {phoneTypeError ? (
              <Text style={styles.registerFormError}>
                {i18n.t("téléphoneErreur")}
              </Text>
            ) : null}
            <Text style={styles.registerFormLabel}>{i18n.t("email")}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t("emailPlaceholder")}
              name="email"
              onChangeText={(email) => {
                setUserData(() => ({ ...userData, email }));
              }}
              value={userData.email}
            />
            {emailTypeError ? (
              <Text style={styles.registerFormError}>
                {i18n.t("emailErreur")}
              </Text>
            ) : null}

            {emailWarning ? (
              <Text style={styles.registerFormError}>
                {i18n.t("existeDéjà")}
              </Text>
            ) : null}

            {!dataSent ? (
              <TouchableOpacity>
                <Pressable style={styles.submit} onPress={onSubmitSecondStep}>
                  <Text style={styles.submitText}>
                    {i18n.t("étapeSuivante")}
                  </Text>
                </Pressable>
              </TouchableOpacity>
            ) : (
              <ActivityIndicator size="large" color="#14b9c5" />
            )}
          </View>
        </View>
      );

    /* **********************************************************************
     ---------------------------------- THIRD STEP ---------------------------
     ********************************************************************** */

    case 3:
      return (
        <View style={styles.container}>
          <View style={styles.registerHeader}>
            <TouchableOpacity
              style={styles.returnContainer}
              onPress={() => {
                setFormStep(2);
              }}
            >
              <Image
                source={require("../assets/registerArrow.png")}
                style={styles.arrow}
                resizeMode="contain"
              />

              <Text
                style={styles.return}
                onPress={() => {
                  setFormStep(2);
                }}
              >
                Retour
              </Text>
            </TouchableOpacity>
            <Image
              source={require("../assets/help.png")}
              style={styles.arrow}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{i18n.t("vérificationEmail")}</Text>
          <Text style={styles.description}>{i18n.t("codeTransmisMail")}</Text>

          <View style={styles.registerForm}>
            <TextInput
              style={styles.input}
              name="emailCode"
              onChangeText={(emailCode) => {
                setUserData(() => ({ ...userData, emailCode }));
              }}
              value={userData.emailCode}
            />

            <Pressable style={styles.submit} onPress={onSubmitThirdStep}>
              <Text style={styles.submitText}>{i18n.t("étapeSuivante")}</Text>
            </Pressable>
          </View>
        </View>
      );

    /* **********************************************************************
     ---------------------------------- FOURTH STEP ---------------------------
     ********************************************************************** */
    case 4:
      return (
        <View style={styles.container}>
          <View style={styles.registerHeader}>
            <TouchableOpacity
              style={styles.returnContainer}
              onPress={() => {
                setFormStep(3);
              }}
            >
              <Image
                source={require("../assets/registerArrow.png")}
                style={styles.arrow}
                resizeMode="contain"
              />

              <Text style={styles.return}>{i18n.t("retour")}</Text>
            </TouchableOpacity>
            <Image
              source={require("../assets/help.png")}
              style={styles.arrow}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{i18n.t("vérificationTéléphone")}</Text>
          <Text style={styles.description}>
            {i18n.t("codeTransmisTéléphone")}
          </Text>

          <View style={styles.registerForm}>
            <TextInput
              style={styles.input}
              name="phoneCode"
              onChangeText={(phoneCode) => {
                setUserData(() => ({ ...userData, phoneCode }));
              }}
              value={userData.phoneCode}
            />

            <Pressable style={styles.submit} onPress={sendCodeAgain}>
              <Text style={styles.submitText}>{i18n.t("renvoyerCode")}</Text>
            </Pressable>
            <Pressable style={styles.submit} onPress={onSubmitFourthStep}>
              <Text style={styles.submitText}>{i18n.t("étapeSuivante")}</Text>
            </Pressable>
          </View>
        </View>
      );

    /* **********************************************************************
     ---------------------------------- FINAL STEP --------------------------
     ********************************************************************** */
    case 5:
      return (
        <View style={styles.container}>
          <Text style={styles.finalTitle}>{i18n.t("compteCréé")}</Text>
          <Text style={styles.description}>{i18n.t("merci")}</Text>
          <Text style={styles.description}>{i18n.t("connectezVous")}</Text>
          <Pressable
            style={styles.submit}
            onPress={() => {
              setFormStep(6);
            }}
          >
            <Text style={styles.submitText}>{i18n.t("seConnecter")}</Text>
          </Pressable>
        </View>
      );

    case 6:
      return <Login />;
    case 7:
      return (
        <Onboarding
          navigateToRegister={() => {
            setFormStep(1);
          }}
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: "6%",
    backgroundColor: "#ffffff",
  },

  registerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  returnContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "30%",
  },

  registerFormLabel: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
  },

  registerFormError: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    marginBottom: 10,
    width: "100%",
    textAlign: "justify",
    color: "#e25a84",
  },

  arrow: {
    width: 20,
    height: 40,
    marginRight: 10,
  },

  title: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    fontWeight: "bold",
    marginBottom: 10,
    color: "#373945",
  },

  finalTitle: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    color: "#373945",
  },

  description: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    marginBottom: 30,
    width: "100%",
    textAlign: "justify",
    color: "#373945",
  },

  input: {
    width: "100%",
    height: 30,
    marginTop: 5,
    marginBottom: 25,
    borderBottomWidth: 1,
    borderColor: "#373945",
    color: "#373945",
  },

  eyeContainer: {
    position: "absolute",
    width: 30,
    height: 30,
    bottom: 25,
    right: 0,
  },

  eye: {
    width: 30,
    height: 30,
  },

  checkBoxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingRight: 10,
  },

  checkBox: {
    marginTop: 12,
    marginLeft: 5,
  },

  checkBoxText: {
    fontSize: RFPercentage(1.5),
    marginTop: 14,
  },

  submit: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "#14b9c5",
    borderRadius: 30,
    marginBottom: 10,
  },

  submitText: {
    color: "#FFFFFF",
  },

  loginQuestion: {
    alignSelf: "center",
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    marginTop: 20,
    color: "#373945",
  },

  loginText: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    color: "#14b9c5",
  },
});
