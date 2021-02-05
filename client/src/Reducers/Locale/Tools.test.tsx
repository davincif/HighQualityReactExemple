// Third party libs
import React from "react";

// Local Imports
import { capitalize, capitalizeInitials } from "./Tools";

describe("Locale Tools", () => {
  test("capitalize", () => {
    expect(capitalize("asd")).toBe("Asd");
    expect(capitalize("¿olvidaste?")).toBe("¿Olvidaste?");
    expect(capitalize("inicar sessão?")).toBe("Inicar sessão?");
    expect(capitalize("¿no tienes cuenta?")).toBe("¿No tienes cuenta?");
  });

  test("capitalizeInitials", () => {
    expect(capitalizeInitials("asd")).toBe("Asd");
    expect(capitalizeInitials("¿olvidaste?")).toBe("¿Olvidaste?");
    expect(capitalizeInitials("inicar sessão?")).toBe("Inicar Sessão?");
    expect(capitalizeInitials("¿no tienes cuenta?")).toBe("¿No Tienes Cuenta?");
  });
});
