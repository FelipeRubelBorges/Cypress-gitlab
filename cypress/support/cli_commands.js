Cypress.Commands.add('cloneViaSSH', project =>
  cy.env(['user_name'], { log: false }).then(({ user_name }) =>
    cy.task('cloneGitLabProject', { user: user_name, project: project.name }, { log: false })
  )
)
