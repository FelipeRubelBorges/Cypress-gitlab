describe('Login', () => {
  it('successfully', () => {
    cy.login(undefined, undefined, { cacheSession: false })

    cy.get('.qa-user-avatar').should('be.visible')
  })
})