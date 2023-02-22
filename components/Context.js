import { createContext, useState } from "react";

export const DataContext = createContext();

export default function ContextProvider(props) {
  const [user, setUser] = useState({});
  const [login, setLogin] = useState(0);
  const [token, setToken] = useState(false);
  const [walletId, setWalletId] = useState(false);
  const [menu, setMenu] = useState(true);
  const [menuPage, setMenuPage] = useState("");
  const [userData, setUserData] = useState();
  const [amount, setAmount] = useState("");
  const [OZP, setOZP] = useState("");
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openAskCash, setOpenAskCash] = useState(false);
  const [openCollect, setOpenCollect] = useState(false);
  const [openQrCode, setOpenQrCode] = useState(false);
  const [openConvert, setOpenConvert] = useState(false);
  const [openConvertSuccess, setOpenConvertSuccess] = useState(false);
  const [openConvertFail, setOpenConvertFail] = useState(false);
  const [openRecharge, setOpenRecharge] = useState(false);
  const [openTransactionSuccess, setOpenTransactionSuccess] = useState(false);
  const [openTransactionFail, setOpenTransactionFail] = useState(false);
  const [openAskCashNotifSuccess, setOpenAskCashNotifSuccess] = useState(false);
  const [openAskCashNotifFail, setOpenAskCashNotifFail] = useState(false);
  const [openSendCashRecap, setOpenSendCashRecap] = useState(false);
  const [openAskCashRecap, setOpenAskCashRecap] = useState(false);
  const [openConnectBSCWallet, setOpenConnectBSCWallet] = useState(false);
  const [screenName, setScreenName] = useState("Home");
  const [notifModal, setNotifModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [refreshTransactions, setRefreshTransactions] = useState(false);
  const [refreshNotifications, setRefreshNotifications] = useState(false);
  const [locale, setLocale] = useState("fr");
  const [BSCWallet, setBSCWallet] = useState("");
  const [BSCAmount, setBSCAmount] = useState("");
  const [showNotAvailable, setShowNotAvailable] = useState(false);
  const [updateBSCWallet, setUpdateBSCWallet] = useState(false);

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        login,
        setLogin,
        token,
        setToken,
        walletId,
        setWalletId,
        menu,
        setMenu,
        menuPage,
        setMenuPage,
        userData,
        setUserData,
        amount,
        setAmount,
        OZP,
        setOZP,
        openConnectBSCWallet,
        setOpenConnectBSCWallet,
        openTransfer,
        setOpenTransfer,
        openAskCash,
        setOpenAskCash,
        openCollect,
        setOpenCollect,
        openQrCode,
        setOpenQrCode,
        openConvert,
        setOpenConvert,
        openConvertSuccess,
        setOpenConvertSuccess,
        openConvertFail,
        setOpenConvertFail,
        openRecharge,
        setOpenRecharge,
        screenName,
        setScreenName,
        openMenu,
        setOpenMenu,
        notifModal,
        setNotifModal,
        openSendCashRecap,
        setOpenSendCashRecap,
        openAskCashRecap,
        setOpenAskCashRecap,
        openTransactionSuccess,
        setOpenTransactionSuccess,
        openTransactionFail,
        setOpenTransactionFail,
        openAskCashNotifSuccess,
        setOpenAskCashNotifSuccess,
        openAskCashNotifFail,
        setOpenAskCashNotifFail,
        userAvatar,
        setUserAvatar,
        refreshTransactions,
        setRefreshTransactions,
        refreshNotifications,
        setRefreshNotifications,
        locale,
        setLocale,
        BSCWallet,
        setBSCWallet,
        BSCAmount,
        setBSCAmount,
        showNotAvailable,
        setShowNotAvailable,
        updateBSCWallet,
        setUpdateBSCWallet,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
