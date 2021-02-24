// Third party libs
import React from "react";

// Local Imports
import { capitalize, capitalizeInitials } from "./Tools";

describe("Locale Tools", () => {
  test("capitalize", () => {
    expect(capitalize("login")).toBe("Login");

    expect(capitalize("árvore")).toBe("Árvore");
    expect(capitalize("õosd")).toBe("Õosd");
    expect(capitalize("ôs ía войти")).toBe("Ôs ía войти");

    expect(capitalize("забыли пароль?")).toBe("Забыли пароль?");
    expect(capitalize(";№*нет аккаунта?")).toBe(";№*Нет аккаунта?");
    expect(capitalize("логин")).toBe("Логин");

    expect(capitalize("¿olvidaste?")).toBe("¿Olvidaste?");
    expect(capitalize("inicar sessão?")).toBe("Inicar sessão?");
    expect(capitalize("¿no tienes cuenta?")).toBe("¿No tienes cuenta?");
  });

  test("capitalizeInitials", () => {
    expect(capitalizeInitials("login")).toBe("Login");

    expect(capitalizeInitials("árvore")).toBe("Árvore");
    expect(capitalizeInitials("õosd")).toBe("Õosd");
    expect(capitalizeInitials("ôs ía войти")).toBe("Ôs Ía Войти");

    expect(capitalizeInitials("забыли пароль?")).toBe("Забыли Пароль?");
    expect(capitalizeInitials(";№*нет аккаунта?")).toBe(";№*Нет Аккаунта?");
    expect(capitalizeInitials("логин")).toBe("Логин");

    expect(capitalizeInitials("¿olvidaste?")).toBe("¿Olvidaste?");
    expect(capitalizeInitials("inicar sessão?")).toBe("Inicar Sessão?");
    expect(capitalizeInitials("¿no tienes cuenta?")).toBe("¿No Tienes Cuenta?");
  });
});
