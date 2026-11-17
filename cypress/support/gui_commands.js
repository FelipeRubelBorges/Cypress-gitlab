Cypress.Commands.add('login', (
    requestedUser,
    requestedPassword,
    { cacheSession = true } = {},
  ) => cy.env(['user_name', 'user_password'], { log: false }).then(({ user_name, user_password }) => {
    const user = requestedUser ?? user_name
    const password = requestedPassword ?? user_password
    const login = () => {
      cy.visit('/users/sign_in')
  
      cy.get("[data-qa-selector='login_field']").type(user)
      cy.get("[data-qa-selector='password_field']").type(password, { log: false })
      cy.get("[data-qa-selector='sign_in_button']").click()
    }
  
    const validate = () => {
      cy.visit('/')
      cy.location('pathname', { timeout: 1000 })
        .should('not.eq', '/users/sign_in')
    }
  
    const options = {
      cacheAcrossSpecs: true,
      validate,
    }
  
    if (cacheSession) {
      cy.session(user, login, options)
    } else {
      login()
    }
  }))

Cypress.Commands.add('logout', () => {
    cy.get('.qa-user-avatar').click()
    cy.contains('Sign out').click()
})

Cypress.Commands.add('gui_createProject', project => {
    cy.visit('/projects/new')
  
    cy.get('#project_name').type(project.name)
    cy.get('#project_description').type(project.description)
    cy.get('.qa-initialize-with-readme-checkbox').check()
    cy.contains('Create project').click()
    cy.env(['user_name'], { log: false }).then(({ user_name }) => {
      cy.location('pathname').should('eq', `/${user_name}/${project.name}`)
      cy.api_trackProject(user_name, project.name)
    })
  })
  
  Cypress.Commands.add('gui_createIssue', issue => {
    cy.env(['user_name'], { log: false }).then(({ user_name }) => {
      cy.visit(`/${user_name}/${issue.project.name}/issues/new`)
    })
  
    cy.get('.qa-issuable-form-title').type(issue.title)
    cy.get('.qa-issuable-form-description').type(issue.description)
    cy.contains('Submit issue').click()
  })
  
  Cypress.Commands.add('gui_setLabelOnIssue', label => {
    cy.get('.qa-edit-link-labels').click()
    cy.contains(label.name).click()
    cy.get('body').click()
  })

  Cypress.Commands.add('gui_setMilestoneOnIssue', milestone => {
    cy.get('.block.milestone .edit-link').click()
    cy.contains(milestone.title).click()
  })