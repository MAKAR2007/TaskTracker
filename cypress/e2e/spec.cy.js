describe("Главная станица", () => {
  it("прогрмма должны зарендерить главную страницу", () => {
    cy.visit("http://localhost:3000/");
    cy.get("h1").contains(
      "УК ПК: эффективное управление задачами и проектами с ментором задач.",
    );
  });
});

describe("Навигация авторизации", () => {
  it("прогрмма должны перейти на страницу авторищации", () => {
    cy.visit("http://localhost:3000/");

    // Find a link with an href attribute containing "login" and click it
    cy.get('a[href*="login"]').click();

    //the new url should contain 'login'
    cy.url().should("include", "/login");

    cy.get("h1").contains("Вход в учетную запись");
  });
});

describe("Навигация регистрации", () => {
  it("программа должны перейти на страницу регистрации", () => {
    // cy.mount()
    cy.visit("http://localhost:3000/");

    // Find a link with an href attribute containing "login" and click it
    cy.get('a[href*="register"]').click();

    //the new url should contain 'login'
    cy.url().should("include", "/cc/register");

    cy.get("h1").contains("Зарегистрировать сотрудника");
  });
});

describe("Доска проектов", () => {
  it("прогрмма не должны зарендерить страницу без логина", () => {
    cy.visit("http://localhost:3000/cc");
    cy.get("h1").contains("Доска проектов");
  });
});
