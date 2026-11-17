import { faker } from '@faker-js/faker'

const options = {env: {snapshotOnly: true}}


describe('Create Issue', options,  () => {
  const issue = {
    title: `issue-${faker.string.uuid()}`,
    description: faker.lorem.words(3),
    project: {
      name: `project-${faker.string.uuid()}`,
      description: faker.lorem.words(5)
    }
  }

  beforeEach(() => {
    cy.login()
    cy.api_createProject(issue.project)
  })

  it('successfully', () => {
    cy.gui_createIssue(issue)

    cy.get('.issue-details')
      .should('contain', issue.title)
      .and('contain', issue.description)
  })
})