describe('Main', () => {
  it('should display header text', () => {
    cy.visit('/')
    cy.contains('.home-page', 'home-page')
  })
})
