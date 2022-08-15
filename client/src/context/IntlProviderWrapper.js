import React, {useState, useEffect} from "react";
import { IntlContext, languages } from "./IntlContext";
import { IntlProvider } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateLanguage, getUser } from "../features/users/userSlice";

export default function IntlProviderWrapper({children}) {
    const user = useSelector(selectUser);
    useEffect(() => {
        const data = {
          userId: user.user.id,
          accessToken: user.accessToken,
        };
        dispatch(getUser(data));
      }, []);
      const defaultLocale = navigator.language === "pl" ? "pl" : "en";
    const defaultValue = user.auth ? languages[user.user.lang] : languages[defaultLocale];
    const [langs, setLangs] = useState(defaultValue);
    const dispatch = useDispatch();
    const handleChange = (e) => {
        const lang = e.target.value;
        setLangs(languages[lang])
        if (user.user.lang !== lang && user.auth) {
            const data = {
                userId: user.user.id,
                accessToken: user.accessToken,
                lang: { newLang: lang }
            }
            dispatch(updateLanguage(data))
        }
    }
return (
    <>
    {langs && 
    <IntlContext.Provider value={{langs, handleChange}}>
    <IntlProvider
      key={langs.locale}
      locale={langs.locale}
      messages={langs.messages}
      defaultLocale="en"
    >
      {children}
    </IntlProvider>
  </IntlContext.Provider>
    }
    </>
)
}
  