describe('Website', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080', {
      onBeforeLoad: window => {
        cy.stub(window, 'open').as('windowOpen');
      }
    });
  });

  it('shows help', () => {
    cy.get('.cli-input')
      .type('help')
      .type('{enter}');
    cy.contains('help');
    cy.contains('whoami');
    cy.contains('projects');
    cy.contains('github');
    cy.contains('linkedin');
    cy.contains('clear');
    cy.contains('oops');
  });

  it('shows whoami', () => {
    cy.get('.cli-input')
      .type('whoami')
      .type('{enter}');
    cy.contains('Hi! My name is');
  });

  it('shows projects', () => {
    cy.get('.cli-input')
      .type('projects')
      .type('{enter}');
    cy.contains('Lickit');
  });

  it('shows github', () => {
    cy.get('.cli-input')
      .type('github')
      .type('{enter}');
    const url = 'https://github.com/hugo-cardenas';
    cy.contains(url);
    cy.get('@windowOpen').should('be.calledWith', url);
  });

  it('shows linkedin', () => {
    cy.get('.cli-input')
      .type('linkedin')
      .type('{enter}');
    const url = 'https://linkedin.com/in/hugocardenas/?locale=en_US';
    cy.contains(url);
    cy.get('@windowOpen').should('be.calledWith', url);
  });

  it('invalid command', () => {
    cy.get('.cli-input')
      .type('foo')
      .type('{enter}');
    cy.contains('foo');
    cy.contains('Command not found: foo');
  });

  it('clears history', () => {
    cy.get('.cli-input')
      .type('foo')
      .type('{enter}');
    cy.contains('foo');
    cy.get('.cli-input')
      .type('clear')
      .type('{enter}');
    cy.contains('foo').should('not.exist');
  });

  it('navigates through command history', () => {
    cy.get('.cli-input')
      .type('foo')
      .type('{enter}')
      .type('bar')
      .type('{enter}')
      .type('baz')
      .type('{enter}');
    
    cy.get('.cli-input')
      .should('have.value', '')
      .type('{uparrow}')
      .should('have.value', 'baz')
      .type('{uparrow}')
      .should('have.value', 'bar')
      .type('{uparrow}')
      .should('have.value', 'foo')
      // Already in beginning of history
      .type('{uparrow}')
      .should('have.value', 'foo')
      .type('{downarrow}')
      .should('have.value', 'bar')
      .type('{downarrow}')
      .should('have.value', 'baz')
      // In end of history
      .type('{downarrow}')
      .should('have.value', 'baz');
  });

  // TODO Fix
  // it('clears current command with Ctrl+C', () => {
  //   cy.get('.cli-input')
  //     .type('foobar')
  //     .should('have.value', 'foobar')
  //     .type('{ctrl}c', { release: false })
  //     .should('have.value', '');
  // });
});