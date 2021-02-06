import { enMessages } from "./Lang/English";
import { ptbrMessages } from "./Lang/BrasilianPortuguese";
import { esMessages } from "./Lang/Spanish";
import { ruMessages } from "./Lang/Russian";
import { fallbackBuilder } from "./Tools";

export const initialState = {
  code: "en",
  lang: "English",
  name: "English",
  msgs: enMessages,
  fallback: "en",
};

export const LocaleReducer = (state: any, action: any) => {
  switch (action.type) {
    case "en":
      return initialState;

    case "pt-br":
      return {
        ...initialState,
        code: "pt-br",
        lang: "Portuguese",
        name: "Português",
        msgs: fallbackBuilder(ptbrMessages, enMessages),
      };

    case "ru":
      return {
        ...initialState,
        code: "ru",
        lang: "Russian",
        name: "Русский",
        msgs: fallbackBuilder(ruMessages, enMessages),
      };

    case "es":
      return {
        ...initialState,
        code: "es",
        lang: "Espanish",
        name: "Español",
        msgs: fallbackBuilder(esMessages, enMessages),
      };

    default:
      return initialState;
  }
};
