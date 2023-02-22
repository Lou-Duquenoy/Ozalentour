import { useState, useEffect, useContext } from "react";
import { DataContext } from "../Context";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";

const BASE_URL = "https://api007.ozalentour.com";

export default function Settings() {
  const { setOpenMenu, setMenuPage, userAvatar, setUserAvatar } =
    useContext(DataContext);
  const [userData, setUserData] = useState({});
  const [openForm, setOpenForm] = useState(0);
  const [newUserData, setNewUserData] = useState({
    city: "",
    activity: "",
    email: "",
    phoneNumber: "",
  });
  const [warning, setWarning] = useState(0);
  const [token, setToken] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    async function getData() {
      let token = await AsyncStorage.getItem("token");
      setToken(token);

      axios
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
        .catch(function (error) {
          console.log(error);
        })
        .then(function (res) {
          setUserData(res.data);
        });
    }

    getData();
  }, []);

  // useEffect(() => {
  //   let avatar = await AsyncStorage.getItem("avatar");

  //   setUserData({ ...userserData, avatar: avatar });
  // }, [userData]);

  console.log(userData);

  const pickPicture = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result.file);

    const data = new FormData();
    data.append("avatar", result.file);

    console.log(data);

    axios
      .post(
        `${BASE_URL}/uploadAvatar`,

        data,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .catch(function (error) {
        console.log(error);
      })
      .then(function (res) {
        changePicture(res);
      });
  };

  const changePicture = (res) => {
    console.log("axios dans le .then");

    console.log(token);
    let newPicture = res.data.filename;

    console.log(res.data.filename);

    let newUserData = {
      picture: newPicture,
    };

    axios
      .post(
        `${BASE_URL}/userData/update`,
        {
          token: token,
          newUserData,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });

    // setUserAvatar(picture);
    // AsyncStorage.setItem("avatar", picture);

    // setUserData(userData => ({ ...userData,  avatar: picture}));
  };

  const handleChange = (inputName) => {
    return (value) => {
      setNewUserData({ ...newUserData, [inputName]: value });
    };
  };

  const handleSubmit = () => {
    axios
      .post(
        `${BASE_URL}/userData/update`,
        {
          token: token,
          newUserData,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setUpdateSuccess(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(newUserData);
  }, [newUserData]);

  return openForm == 0 ? (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setMenuPage("index");
        }}
      >
        <Image
          style={styles.arrow}
          source={require("../../assets/arrowHeader.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.avatarContainer} onPress={pickPicture}>
        <Image
          style={styles.avatar}
          source={{ uri: `${BASE_URL}/avatars/${userData.avatar}` }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.divider}></View>

      <View style={styles.userPropertyContainer}>
        <Text style={styles.userProperty}>Nom: </Text>
        <Text style={styles.userInfo}>{userData.lastName}</Text>
      </View>
      <View style={styles.userPropertyContainer}>
        <Text style={styles.userProperty}>Prénom: </Text>
        <Text style={styles.userInfo}>{userData.firstName}</Text>
      </View>
      <View style={styles.userPropertyContainer}>
        <Text style={styles.userProperty}>Ville: </Text>
        <Text style={styles.userInfo}>{userData.city}</Text>
      </View>
      <View style={styles.userPropertyContainer}>
        <Text style={styles.userProperty}>Activité professionnelle: </Text>
        <Text style={styles.userInfo}>{userData.activity}</Text>
      </View>

      <View style={styles.userPropertyContainer}>
        <Text style={styles.userProperty}>Adresse email: </Text>
        <Text style={styles.userInfo}>{userData.email}</Text>
      </View>
      <View style={styles.userPropertyContainer}>
        <Text style={styles.userProperty}>Téléphone: </Text>
        <Text style={styles.userInfo}>{userData.phoneNumber}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setOpenForm(1);
        }}
      >
        <Text style={styles.buttonText}>Modifier mes informations </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setMenuPage("index");
        }}
      >
        <Image
          style={styles.arrow}
          source={require("../../assets/arrowHeader.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.avatarContainer} onPress={pickPicture}>
        <Image
          style={styles.avatar}
          source={{ uri: `${BASE_URL}/avatars/${userData.avatar}` }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.divider}></View>

      {updateSuccess ? (
        <Text style={styles.userProperty}>Votre profil a été mis à jour </Text>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Ville</Text>
          <TextInput
            style={styles.input}
            value={newUserData.city}
            onChangeText={handleChange("city")}
          ></TextInput>
          <Text style={styles.label}>Activité professionnelle</Text>
          <TextInput
            style={styles.input}
            value={newUserData.activity}
            onChangeText={handleChange("activity")}
          ></TextInput>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            value={newUserData.password}
            onChangeText={handleChange("password")}
            secureTextEntry={true}
          ></TextInput>
          {warning ? (
            <Text style={styles.warning}>
              L'adresse email ou le mot de passe est invalide
            </Text>
          ) : null}
          <Text style={styles.label}>Adresse email</Text>
          <TextInput
            style={styles.input}
            value={newUserData.email}
            onChangeText={handleChange("email")}
          ></TextInput>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            value={newUserData.phoneNumber}
            onChangeText={handleChange("phoneNumber")}
          ></TextInput>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#373945",
    justifyContent: "flex-start",
    zIndex: 3000,
    paddingLeft: "10%",
    paddingRight: "10%",
  },

  arrow: {
    width: 40,
    height: 40,
    marginTop: "10%",
  },

  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: "5%",
    marginBottom: "5%",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
  },

  divider: {
    width: "100%",
    height: "1%",
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    marginTop: "10%",
    marginBottom: "10%",
  },

  userPropertyContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginBottom: "10%",
  },

  userProperty: {
    color: "#FFFFFF",
    fontSize: RFPercentage(2),
    fontFamily: "Jost",
    fontWeight: "700",
  },

  userInfo: {
    color: "#FFFFFF",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
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
    color: "#FFFFFF",
    fontSize: RFPercentage(1.8),
    fontFamily: "Jost",
  },

  formContainer: {
    flex: 1,
  },

  input: {
    padding: "5%",
    backgroundColor: "#FFFFFF",
    height: "6%",
    borderRadius: 20,
    color: "#373945",
    fontSize: RFPercentage(1.8),
    marginBottom: 20,
  },

  label: {
    fontSize: RFPercentage(1.8),
    fontWeight: 700,
    color: "#FFFFFF",
    marginBottom: 10,
  },
});
