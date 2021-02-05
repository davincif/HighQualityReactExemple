import { enMessages } from "./English";
import { ptbrMessages } from "./BrasilianPortuguese";
import { esMessages } from "./Spanish";
import { ruMessages } from "./Russian";

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

    case "ru":
      return {
        ...initialState,
        code: "ru",
        lang: "Russian",
        name: "Русский",
        msgs: ruMessages,
      };

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
