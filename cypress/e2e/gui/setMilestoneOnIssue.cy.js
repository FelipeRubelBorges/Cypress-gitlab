import { faker } from '@faker-js/faker'

const options = { env: { snapshotOnly: true } }

describe('Set milestone on issue', options, () => {
  const issue = {
    title: `issue-${faker.string.uuid()}`,
    description: faker.lorem.words(3),
    project: {
      name: `project-${faker.string.uuid()}`,
      description: faker.lorem.words(5)
    }
  }

  const milestone = {
    title: `milestone-${faker.lorem.word()}`
  }

  beforeEach(() => {
    cy.login()
    cy.api_createIssue(issue)
      .then(response => {
        cy.api_createMilestone(response.body.project_id, milestone)
        cy.env(['user_name'], { log: false }).then(({ user_name }) => {
          cy.visit(`${user_name}/${issue.project.name}/issues/${response.body.iid}`)
        })
      })
  })

  it('successfully', () => {
    cy.gui_setMilestoneOnIssue(milestone)

    cy.get('.block.milestone').should('contain', milestone.title)
  })
})