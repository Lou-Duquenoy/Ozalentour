import { View, Text, StyleSheet } from "react-native";
import SendCashFromNotif from "./SendCashFromNotif";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function NotificationModal({ props }) {
  console.log(props);

  return props.notificationType == "request" ? (
    <SendCashFromNotif props={props} />
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>{props.data.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",

    width: "100%",
    backgroundColor: "rgba(136, 181, 186, .2)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
  },

  text: {
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
    color: "#FFFFFF",
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },

  send: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#14b9c5",
    borderRadius: 20,
    padding: 5,
    width: "25%",
  },

  cancel: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e25a84",
    borderRadius: 20,
    padding: 5,
    width: "25%",
  },

  buttonText: {
    fontSize: RFPercentage(1.6),
    fontFamily: "Jost",
    color: "#FFFFFF",
  },
});
