describe('PWA Install Prompt Removal', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should not display the PWA install prompt', () => {
    cy.get('div[class*="PWAInstallPrompt_promptContent"]').should('not.exist');
  });

  it('should load main sections of the homepage', () => {
    cy.get('header').should('exist');
    cy.get('main').should('exist');
    cy.contains('Featured Products').should('exist');
    cy.contains('New Arrivals').should('exist');
    cy.contains('Best Sellers').should('exist');
  });

  it('should navigate through main menu links', () => {
    cy.get('nav').first().within(() => {
      cy.contains('iPhone Parts').click();
    });
    cy.url().should('include', '/products?category=iphone-parts');
  });
});
