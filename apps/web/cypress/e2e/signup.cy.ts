describe("signup", () => {
  beforeEach(() => {
    cy.visit("/auth/signup");
  });

  it("should show all form fields", () => {
    cy.get('input[name="name"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
  });
});
