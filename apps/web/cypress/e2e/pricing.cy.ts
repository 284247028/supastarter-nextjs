describe("pricing page", () => {
  beforeEach(() => {
    cy.visit("/pricing");
  });

  it("should show headline", () => {
    cy.get("h1").should("contain", "Pricing");
  });

  describe("pricing interval tabs", () => {
    it("should show interval tabs", () => {
      const intervalTabs = cy.get('[data-test="price-table-interval-tabs"]');
      intervalTabs.should("exist");
      intervalTabs.should("contain", "Monthly");
      intervalTabs.should("contain", "Yearly");
    });

    it("should show monthly pricing by default", () => {
      cy.get('[data-test="price-table-interval-tabs"]')
        .contains("Monthly")
        .click();
      cy.get('[data-test="price-table-plan"]').should("contain", "/ month");
    });

    it("should show monthly pricing when selected", () => {
      cy.get('[data-test="price-table-interval-tabs"]')
        .contains("Monthly")
        .click();
      cy.get('[data-test="price-table-plan"]').should("contain", "/ month");
    });

    it("should show yearly pricing when selected", () => {
      cy.get('[data-test="price-table-interval-tabs"]')
        .contains("Yearly")
        .click();
      cy.get('[data-test="price-table-plan"]').should("contain", "/ year");
    });
  });

  describe("price table plans", () => {
    it("should order plans by price ascending", () => {
      cy.get('[data-test="price-table-plan"]').then((plans) => {
        const prices = plans
          .map((i, el) => {
            return Number(
              el
                .querySelector('[data-test="price-table-plan-price"]')
                ?.textContent?.replace("$", ""),
            );
          })
          .get();

        const sortedPrices = [...prices].sort((a, b) => a - b);

        expect(prices).to.deep.eq(sortedPrices);
      });
    });
  });
});
