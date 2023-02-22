import { View, Text, Image, StyleSheet } from "react-native";
import { useContext } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { fr, en } from "../languages";
import { I18n } from "i18n-js";
import { DataContext } from "../components/Context";

const BASE_URL = "https://api007.ozalentour.com";

export default function Publish() {
  const { locale } = useContext(DataContext);

  const i18n = new I18n({ fr, en });
  i18n.enableFallback = true;

  i18n.locale = locale;

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/notAvailable.jpg")}
        style={styles.notAvailable}
        resizeMode="contain"
      />
      <Text style={styles.text}>
        Cette fonctionnalité sera bientôt disponible :)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: "10%",
  },

  notAvailable: {
    width: 300,
    height: 300,
  },

  text: {
    color: "#373945",
    fontSize: RFPercentage(2.5),
    fontFamily: "Jost",
    marginTop: 30,
    textAlign: "justify",
  },
});

/* import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useRef, forwardRef } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import RichTextEditor from "../components/RichTextEditor";

export default function Publish() {
  const [post, setPost] = useState("");
  const transactionsSheetRef = useRef(null);
  const editorRef = useRef(null);
  const snapPoints = ["90%"];

  const pickPicture = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result);

    const data = new FormData();
    data.append("avatar", result.file);

    console.log(data);

    axios
      .post(
        `https://test-hauspie.fr/uploadPostPicture`,

        data,

        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .catch(function (error) {
        console.log(error);
      })
      .then(async function (res) {
        console.log(res.data);
        console.log(token);
        let picture = res.data.filename;
        axios
          .post(
            `https://test-hauspie.fr/userData/update`,
            {
              token: token,
              picture: picture,
            },

            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
          )
          .catch(function (error) {
            console.log(error);
          });
        setUserAvatar(picture);
        AsyncStorage.setItem("avatar", picture);
      });
  };

  console.log(post);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.publishHeader}>
          <Text style={styles.titleHeader}>Publier un post</Text>
        </View>
        <BottomSheet
          ref={transactionsSheetRef}
          snapPoints={snapPoints}
          handleIndicatorStyle={{ display: "none" }}
        >
          <View style={styles.main}>
            <RichTextEditor />
          </View>
        </BottomSheet>
      </View>
    </>
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
    paddingLeft: "5%",
    paddingRight: "5%",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: "83%",
  },

  title: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "600",
    color: "#373945",
    marginBottom: 20,
  },

  publishHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: "10%",

    backgroundColor: "#373945",
  },

  titleHeader: {
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "500",
    color: "#FFFFFF",
  },

  postInput: {
    fontSize: RFPercentage(1.5),
    fontFamily: "Jost",
    fontWeight: "400",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "30%",
    color: "#1F1F1F",
    borderWidth: 1,
    borderColor: "#1F1F1F",
    borderRadius: 20,

    padding: 10,
    marginBottom: 30,
  },

  cameraContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#089baa",
    width: 60,
    height: 60,
    alignSelf: "center",
    marginBottom: 30,
  },

  camera: {
    width: 40,
    height: 40,
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
});
 */
