import { faker } from '@faker-js/faker'

const options = {env: {snapshotOnly: true}}

describe('Create Project',options, () => {
  beforeEach(() => {
    cy.login()
  })

  it('successfully', () => {
    const project = {
      name: `project-${faker.string.uuid()}`,
      description: faker.lorem.words(5)
    }

    cy.gui_createProject(project)

    cy.env(['user_name'], { log: false }).then(({ user_name }) => {

      cy.url().should('be.equal', `${Cypress.config('baseUrl')}/${user_name}/${project.name}`)

    })
    cy.contains(project.name).should('be.visible')
    cy.contains(project.description).should('be.visible')
  })
})