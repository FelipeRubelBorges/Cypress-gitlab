import { faker } from '@faker-js/faker'

const options = { env: { snapshotOnly: true } }

describe('Set label on issue', options, () => {
  const issue = {
    title: `issue-${faker.string.uuid()}`,
    description: faker.lorem.words(3),
    project: {
      name: `project-${faker.string.uuid()}`,
      description: faker.lorem.words(5)
    }
  }

  const label = {
    name: `label-${faker.lorem.word()}`,
    color: '#ffaabb'
  }

  beforeEach(() => {
    cy.login()
    cy.api_createIssue(issue)
      .then(response => {
        cy.api_createLabel(response.body.project_id, label)
        cy.env(['user_name'], { log: false }).then(({ user_name }) => {
          cy.visit(`${user_name}/${issue.project.name}/issues/${response.body.iid}`)
        })
      })
  })

  it('successfully', () => {
    cy.gui_setLabelOnIssue(label)

    cy.get('.qa-labels-block').should('contain', label.name)
    cy.get('.qa-labels-block span')
      .should('have.attr', 'style', `background-color: ${label.color}; color: #333333;`)
  })
})