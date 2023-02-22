import { useState, useEffect, useContext } from "react";
import { DataContext } from "../Context";
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
} from "react-native";
import QrCode from "./QrCode";
import { fr, en } from "../../languages";
import { I18n } from "i18n-js";

let digit = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0"];

export default function Collect() {
  const {
    amount,
    setAmount,
    setOpenCollect,
    openQrCode,
    setOpenQrCode,
    locale,
  } = useContext(DataContext);

  const [warning, setWarning] = useState(false);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  useEffect(() => {
    const backAction = () => {
      setOpenCollect(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // If the amount is greater than 0, we open the QrCode, else, we show a warning message
  const onSubmit = () => {
    amount > 0
      ? (setOpenCollect(false), setOpenQrCode(true))
      : setWarning(true);
  };

  return (
    <>
      {openQrCode ? <QrCode /> : null}
      <View style={styles.collectContainer}>
        <View style={styles.collectHeader}>
          <View>
            <Pressable
              onPress={() => {
                setOpenCollect(false), setAmount("");
              }}
            >
              <Image
                source={require("../../assets/arrowHeader.png")}
                style={styles.arrow}
              />
            </Pressable>
          </View>
          <Text
            style={locale == "fr" ? styles.titleHeader : styles.titleHeaderEN}
          >
            {i18n.t("encaisser")}
          </Text>
        </View>
        <View style={styles.collectMain}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.amountInput}
              caretHidden={true}
              keyboardType="numeric"
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

          <View style={styles.calculatorContainer}>
            {digit.map((digit, index) => {
              return (
                <TouchableOpacity
                  style={styles.digitContainer}
                  key={index}
                  onPress={() => {
                    setAmount(amount + digit);
                  }}
                >
                  <Text style={styles.digit}>{digit}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setAmount(amount.slice(0, -1));
              }}
            >
              <Image
                style={styles.erase}
                source={require("../../assets/effacer.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {warning ? (
              <Text style={styles.warning}>{i18n.t("montantMinimum")}</Text>
            ) : null}

            <TouchableOpacity style={styles.touchable} onPress={onSubmit}>
              <Pressable style={styles.submit} onPress={onSubmit}>
                <Text style={styles.submitText}>{i18n.t("facturer")}</Text>
              </Pressable>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  collectContainer: {
    position: "absolute",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#373945",
    zIndex: 3000,
  },

  /*   collect: {
    backgroundColor: "#FFFFFF",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  }, */

  collectHeader: {
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
    marginRight: "40%",
  },

  titleHeaderEN: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "500",
    color: "#FFFFFF",
    marginRight: "42%",
  },

  arrow: {
    width: 40,
    height: 40,
  },

  collectMain: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: " 5%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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

  collectForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  collectFormAmount: {
    fontSize: 2,
    fontWeight: "600",
    marginBottom: 5,
    width: "100%",
  },

  collectFormDesription: {
    fontSize: 1,
    width: "50%",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(211, 209, 209)",
  },

  input: {
    fontSize: RFPercentage(5),
    fontFamily: "Jost",
    fontWeight: "600",
    alignItems: "center",
    justifyContent: "center",
    width: "56%",
    height: "100%",
    color: "#686c82",
    textAlign: "center",
  },

  calculatorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "60%",
    marginTop: 15,
  },

  digitContainer: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "rgb(148, 147, 147)",
    borderRadius: 5,
    color: "rgb(104, 103, 103)",
    margin: 8,
    width: "27%",
    height: "20%",
  },

  digit: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#373945",
  },

  erase: {
    alignItems: "center",
    padding: 10,
    width: 42,
    height: 42,
    marginLeft: 38,
    marginRight: 38,
  },

  touchable: {
    width: "100%",
  },

  submit: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#089baa",
    borderRadius: 30,
    color: "#ffffff",
    marginTop: 30,
  },

  submitText: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#FFFFFF",
  },

  warning: {
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#089baa",
  },
});
