describe('Hero Slider Functionality', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
  });

  it('should display the hero section with slider', () => {
    // Check that the hero section exists and is visible
    cy.get('[role="banner"]').should('be.visible');

    // Check that the progress bar exists and is visible
    cy.get('.progressBar').should('be.visible');

    // Check that navigation arrows exist and are visible
    cy.get('.navArrow').should('have.length', 2).and('be.visible');

    // Check that slide indicators exist and are visible
    cy.get('.indicators').should('exist').and('be.visible');
    cy.get('.indicator').should('have.length', 3).and('be.visible'); // We have 3 slides
  });

  it('should auto-advance slides', () => {
    // Wait for the first slide to be visible
    cy.get('[id*="hero-heading-"]').should('contain', 'Professional Repair Parts & Tools');

    // Wait for auto-advance (5 seconds + buffer)
    cy.wait(6000);

    // Check that the slide has changed
    cy.get('[id*="hero-heading-"]').should('contain', 'Premium iPhone & Samsung Parts');
  });

  it('should pause on hover', () => {
    // Get initial slide content
    cy.get('[id*="hero-heading-"]').should('contain', 'Professional Repair Parts & Tools');

    // Hover over the hero section with force to bypass hidden element error
    cy.get('[role="banner"]').trigger('mouseenter', { force: true });

    // Check that pause indicator appears
    cy.get('.pauseIndicator').should('be.visible');

    // Wait for more than 5 seconds
    cy.wait(6000);

    // Slide should not have changed while hovering
    cy.get('[id*="hero-heading-"]').should('contain', 'Professional Repair Parts & Tools');
  });

  it('should navigate with arrow buttons', () => {
    // Click next arrow with force to bypass hidden element error
    cy.get('.nextArrow').click({ force: true });

    // Check that slide changed
    cy.get('[id*="hero-heading-"]').should('contain', 'Premium iPhone & Samsung Parts');

    // Click previous arrow with force
    cy.get('.prevArrow').click({ force: true });

    // Check that we're back to first slide
    cy.get('[id*="hero-heading-"]').should('contain', 'Professional Repair Parts & Tools');
  });

  it('should navigate with slide indicators', () => {
    // Click on the second indicator (index 1) with force
    cy.get('.indicator').eq(1).click({ force: true });

    // Check that second slide is active
    cy.get('[id*="hero-heading-"]').should('contain', 'Premium iPhone & Samsung Parts');
    cy.get('.indicator').eq(1).should('have.class', 'active');

    // Click on the third indicator (index 2) with force
    cy.get('.indicator').eq(2).click({ force: true });

    // Check that third slide is active
    cy.get('[id*="hero-heading-"]').should('contain', 'Expert Repair Tools & Equipment');
    cy.get('.indicator').eq(2).should('have.class', 'active');
  });

  it('should support keyboard navigation', () => {
    // Focus on the hero section
    cy.get('[role="banner"]').focus({ force: true });

    // Press right arrow key
    cy.get('[role="banner"]').type('{rightarrow}', { force: true });

    // Check that slide changed
    cy.get('[id*="hero-heading-"]').should('contain', 'Premium iPhone & Samsung Parts');

    // Press left arrow key
    cy.get('[role="banner"]').type('{leftarrow}', { force: true });

    // Check that we're back to first slide
    cy.get('[id*="hero-heading-"]').should('contain', 'Professional Repair Parts & Tools');
  });

  it('should have proper accessibility attributes', () => {
    // Check ARIA labels on navigation buttons
    cy.get('.navArrow').first().should('have.attr', 'aria-label', 'Previous slide');
    cy.get('.navArrow').last().should('have.attr', 'aria-label', 'Next slide');

    // Check ARIA labels on indicators
    cy.get('.indicator').first().should('have.attr', 'aria-label', 'Go to slide 1');
    cy.get('.indicator').eq(1).should('have.attr', 'aria-label', 'Go to slide 2');
    cy.get('.indicator').eq(2).should('have.attr', 'aria-label', 'Go to slide 3');

    // Check tab index
    cy.get('[role="banner"]').should('have.attr', 'tabindex', '0');
  });

  it('should display progress bar animation', () => {
    // Check that progress bar starts at 0
    cy.get('.progressFill').should('have.css', 'width', '0px');

    // Wait for progress to advance
    cy.wait(1000);

    // Check that progress bar has advanced (width should be greater than 0)
    cy.get('.progressFill').invoke('width').should('be.greaterThan', 0);
  });

  it('should be responsive on mobile', () => {
    // Set viewport to mobile size
    cy.viewport('iphone-6');

    // Check that hero section still exists and is visible
    cy.get('[role="banner"]').should('be.visible');

    // Check that navigation arrows are still present and visible
    cy.get('.navArrow').should('have.length', 2).and('be.visible');

    // Check that indicators are still present and visible
    cy.get('.indicator').should('have.length', 3).and('be.visible');
  });
});
