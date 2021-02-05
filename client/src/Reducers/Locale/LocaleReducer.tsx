import { enMessages } from "./English";
import { ptbrMessages } from "./BrasilianPortuguese";
import { esMessages } from "./Spanish";

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
        msgs: ptbrMessages,
      };

    // case "ru":
    //   return initialState;

    case "es":
      return {
        ...initialState,
        code: "es",
        lang: "Espanish",
        name: "Español",
        msgs: esMessages,
      };

    default:
      return initialState;
  }
};
