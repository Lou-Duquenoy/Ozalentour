import { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "./Context";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";

export default function Recharge() {
  const { setOpenRecharge, locale } = useContext(DataContext);
  const [amount, setAmount] = useState("");
  const [fees, setFees] = useState(0);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  const [optionText, setOptionText] = useState(i18n.t("accepter"));
  const [optionTitle, setOptionTitle] = useState(i18n.t("recevoir"));

  const scrollViewRef = useRef();

  useEffect(() => {
    let changeFees = parseInt(amount * 1.8) / 100;
    setFees(changeFees);
  }, [amount]);

  // useEffect(() => {
  //   console.log("switch trigger");
  //   if (amount < 24) {
  //     scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  //     setOptionText(i18n.t("accepter"));
  //     setOptionTitle(i18n.t("recevoir"));
  //   }

  //   if (amount > 24 && amount < 50) {
  //     scrollViewRef.current.scrollTo({ x: 190, y: 0, animated: true });
  //     setOptionText(i18n.t("transférer"));
  //     setOptionTitle(i18n.t("payer"));
  //   }

  //   if (amount > 49 && amount < 75) {
  //     scrollViewRef.current.scrollTo({ x: 480, y: 0, animated: true });
  //     setOptionText(i18n.t("créer"));
  //     setOptionTitle(i18n.t("lancer"));
  //   }

  //   if (amount > 74 && amount < 100) {
  //     scrollViewRef.current.scrollTo({ x: 750, y: 0, animated: true });
  //     setOptionText(i18n.t("placer"));
  //     setOptionTitle(i18n.t("gagner"));
  //   }

  //   if (amount >= 100) {
  //     scrollViewRef.current.scrollTo({ x: 1020, y: 0, animated: true });
  //     setOptionText(i18n.t("convertirTexte"));
  //     setOptionTitle(i18n.t("convertirTitre"));
  //   }
  // }, [amount]);

  const handleReturn = () => {
    setOpenRecharge(false);
  };

  return (
    <>
      <View style={styles.rechargeContainer}>
        <View style={styles.rechargeHeader}>
          <TouchableOpacity onPress={handleReturn}>
            <Image
              source={require("../assets/arrowHeader.png")}
              style={styles.arrow}
            />
          </TouchableOpacity>

          <Text style={styles.titleHeader}>{i18n.t("recharger")}</Text>
        </View>
        <View style={styles.rechargeMain}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.amountInput}
              caretHidden={true}
              keyboardType="numeric"
              onFocus={() => {
                setAmount("0");
              }}
              onChangeText={(e) => {
                setAmount(e);
              }}
              value={amount}
            />
            <Text style={styles.fakeInput}>
              {amount || "0"}
              <Text style={{ fontSize: RFPercentage(3) }}>€EUR</Text>
            </Text>
          </View>
          <Text style={styles.fees}>
            {" "}
            {i18n.t("fraisGauche")} {fees} {i18n.t("fraisDroite")}
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              onPress={() => {
                setAmount("50");
              }}
              style={styles.button}
            >
              <Text style={styles.option}>50€</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAmount("100");
              }}
              style={styles.button}
            >
              <Text style={styles.option}>100€</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAmount("200");
              }}
              style={styles.button}
            >
              <Text style={styles.option}>200€</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAmount("300");
              }}
              style={styles.button}
            >
              <Text style={styles.option}>300€</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.warning}>{i18n.t("pasDisponible")}</Text>
        </View>
      </View>
    </>
  );
  {
    /*<View style={styles.ozaphyreContainer}>
            <Text style={styles.ozaphyreTitle}>{i18n.t("entrezMontant")}</Text>
            <Text style={styles.ozaphyreTitle}>{i18n.t("profitez")}</Text>
            <ScrollView
              style={styles.optionsContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              ref={scrollViewRef}
            >
              <View style={styles.translateView}>
                <TouchableOpacity
                  style={styles.option1Container}
                  onPress={() => {
                    setAmount(0);
                  }}
                >
                  <Image
                    source={require("../assets/rocket.png")}
                    style={styles.optionIcon}
                  />
                  <View style={styles.option1}>
                    <Text style={styles.option1Title}>
                      {i18n.t("dès")} 0 €EUR{" "}
                    </Text>
                    <Text style={styles.option1Text}>
                      {i18n.t("accepterEncaisser")}
                    </Text>
                    <Text style={styles.option1Text}>
                      {i18n.t("etRecevoir")}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.option2}
                  onPress={() => {
                    setAmount(25);
                  }}
                >
                  <>
                    <View style={styles.option2Container}>
                      <Image
                        source={require("../assets/rechargeTransfer.png")}
                        style={styles.optionIcon}
                      />
                      <View>
                        <Text style={styles.option1Title}>
                          {i18n.t("dès")} 25 €EUR
                        </Text>
                        <Text style={styles.option1Text}>
                          {i18n.t("transférerArgent")}
                        </Text>
                        <Text style={styles.option1Text}>
                          {i18n.t("etPayer")}
                        </Text>
                      </View>
                    </View>
                  </>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.option3}
                  onPress={() => {
                    setAmount(50);
                  }}
                >
                  <>
                    <View style={styles.option3Container}>
                      <Image
                        source={require("../assets/money.png")}
                        style={styles.optionIcon}
                      />
                      <View>
                        <Text style={styles.option1Title}>
                          {i18n.t("dès")} 50 €EUR
                        </Text>
                        <Text style={styles.option1Text}>
                          {i18n.t("créerActivité")}
                        </Text>
                        <Text style={styles.option1Text}>
                          {i18n.t("etGagner")}
                        </Text>
                      </View>
                    </View>
                  </>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.option4}
                  onPress={() => {
                    setAmount(75);
                  }}
                >
                  <>
                    <View style={styles.option3Container}>
                      <Image
                        source={require("../assets/marketing.png")}
                        style={styles.optionIcon}
                      />
                      <View>
                        <Text style={styles.option1Title}>
                          {i18n.t("dès")} 75 €EUR
                        </Text>
                        <Text style={styles.option1Text}>
                          {i18n.t("placerEur")}
                        </Text>
                        <Text style={styles.option1Text}>
                          {i18n.t("rendement")}
                        </Text>
                      </View>
                    </View>
                  </>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.option5}
                  onPress={() => {
                    setAmount(100);
                  }}
                >
                  <>
                    <View style={styles.option5Container}>
                      <Image
                        source={require("../assets/flow.png")}
                        style={styles.optionIcon}
                      />
                      <View>
                        <Text style={styles.option1Title}>
                          {i18n.t("dès")} 100 €EUR
                        </Text>
                        <Text style={styles.option1Text}>
                          {i18n.t("convertirEur")}
                        </Text>
                        <Text style={styles.option1Text}>
                          {i18n.t("enEur")}
                        </Text>
                      </View>
                    </View>
                  </>
                </TouchableOpacity>
                <View style={styles.ghost} />
              </View>
            </ScrollView>
            <View style={styles.ozaphyreContainer}>
              <View style={styles.ozaphyre}>
                <TextInput
                  style={styles.input}
                  onChangeText={(e) => {
                    setAmount(e);
                  }}
                  keyboardType="numeric"
                  caretHidden={true}
                  onFocus={() => {
                    setAmount("");
                  }}
                  value={amount}
                />
                <Text style={styles.fakeInput}>
                  {amount || "0"}{" "}
                  <Text style={{ fontSize: RFPercentage(3) }}>€EUR</Text>
                </Text>
              </View>
            </View>

            <Text style={styles.optionsDescriptionTitle}>{optionTitle}</Text>
            <Text style={styles.optionsDescriptionText}>{optionText}</Text>
          </View>

           <Pressable style={styles.submitButton}>
            <Text style={styles.submitButtonText}>{"CONTINUER"}</Text>
          </Pressable> */
  }
}

const styles = StyleSheet.create({
  rechargeContainer: {
    position: "absolute",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    zIndex: 3000,
  },

  rechargeMain: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "80%",
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },

  rechargeHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "10%",
    backgroundColor: "#FFFFFF",
    paddingTop: 30,
    padding: 10,
  },

  titleHeader: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "600",
    color: "#373945",
    marginRight: "41%",
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
    height: "10%",
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
  },

  fakeInput: {
    fontSize: RFPercentage(5),
    fontFamily: "Jost",
    fontWeight: "600",
    position: "absolute",

    width: "100%",
    textAlign: "center",
    zIndex: -1,
    color: "#373945",
  },

  fees: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "400",
    marginTop: 5,
  },

  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 3,
    marginTop: "15%",
  },

  button: {
    backgroundColor: "#089baa",
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
    borderRadius: 20,
  },

  option: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    fontFamily: "Jost",
    color: "#ffffff",
  },

  ozaphyreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },

  ozaphyreTitle: {
    fontSize: RFPercentage(2.4),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#FFFFFF",
    width: "100%",
  },

  translateView: {
    flexDirection: "row",
  },

  optionIcon: {
    width: 30,
    height: 30,
  },

  option1Container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#089caa",
    marginRight: 20,
    width: 250,
    height: 100,
  },

  option2Container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  option3Container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  option4Container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  option5Container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  option1Title: {
    fontSize: RFPercentage(1.8),
    fontWeight: "700",
    fontFamily: "Jost",
    color: "#FFFFFF",
  },

  option1Text: {
    fontSize: RFPercentage(1.8),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#FFFFFF",
  },

  option2: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: 250,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#f6b900",
    marginRight: 20,
  },

  option3: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: 250,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#e30189",
    marginRight: 20,
  },

  option4: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: 250,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#089caa",
    marginRight: 20,
  },

  option5: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: 250,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#f6b900",
    marginRight: 20,
  },

  ghost: {
    width: 90,
    backgroundColor: "#373945",
  },

  sliderContainer: {
    width: "100%",
    marginTop: 20,
  },

  input: {
    fontSize: RFPercentage(5),
    fontFamily: "Jost",
    fontWeight: "600",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    color: "transparent",
    textAlign: "center",
  },

  ozaphyreContainer: {
    width: "100%",
    justifyContent: "flex-start",
  },

  ozaphyre: {
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "60%",
  },

  rechargeForm: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
  },

  rechargeFormAmount: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    width: "100%",
    color: "#FFFFFF",
  },

  ozaphyreCurrency: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "80%",
  },

  currency: {
    fontSize: RFPercentage(3),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#ffffff",
  },

  rechargeFormCurencies: {
    justifyContent: "center",
    alignItems: "center",
  },

  optionsDescriptionTitle: {
    fontSize: RFPercentage(2.1),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#ffffff",
    width: "100%",
    marginTop: "5%",
    marginBottom: "2%",
  },

  optionsDescriptionText: {
    fontSize: RFPercentage(1.8),
    fontWeight: "500",
    fontFamily: "Jost",
    color: "#9296b3",
  },

  ozaphyreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "8%",
  },

  optionsTitle: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    marginTop: 10,
    color: "#1F1F1F",
  },

  submitButton: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: 40,
    backgroundColor: "#089caa",
    borderRadius: 30,

    marginTop: 30,
    fontFamily: "Jost",
    fontSize: RFPercentage(2),
  },

  submitButtonText: {
    color: "#ffffff",
  },

  warning: {
    textAlign: "center",
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#e25a84",
    marginTop: 30,
  },
});
