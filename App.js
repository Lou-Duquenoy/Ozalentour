import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import Tabs from "./navigation/tabs";
import ContextProvider from "./components/Context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [loaded] = useFonts({
    Jost: require("./assets/fonts/Jost.ttf"),
    JostBold: require("./assets/fonts/Jost-Bold.ttf"),
    MontserratSemiBold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
    MontserratRegular: require("./assets/fonts/Montserrat-Regular.ttf"),
    MontserratMedium: require("./assets/fonts/Montserrat-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ContextProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      </ContextProvider>
    </GestureHandlerRootView>
  );
}
