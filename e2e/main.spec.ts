describe('Main', () => {
  it('should display header text', () => {
    cy.visit('/')
    cy.contains('h1', 'Hello Vue 3 + TypeScript + Vite')
  })
})
