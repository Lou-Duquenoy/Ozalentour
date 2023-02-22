import Index from "./Index";
import { useContext } from "react";
import { DataContext } from "../Context";
import Profile from "../Profile/Profile";
import Settings from "./Settings";

export default function Menu() {
  const { menu, setMenu, menuPage, setMenuPage, login } =
    useContext(DataContext);

  if (menu) {
    switch (menuPage) {
      case "index":
        return <Index />;

      case "profile":
        return <Profile />;

      //  case "settings":
      //   return <Settings />;
    }
  } else {
    return null;
  }
}
