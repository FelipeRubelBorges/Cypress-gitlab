const createdProjects = new Set()

function gitlabRequest(options) {
  return cy.env(['gitlab_access_token'], { log: false }).then(({ gitlab_access_token }) => {
    if (!gitlab_access_token) throw new Error('Set CYPRESS_gitlab_access_token before running the GitLab tests.')
    return cy.request({
      ...options,
      headers: { Authorization: `Bearer ${gitlab_access_token}` },
      log: false,
    })
  })
}

Cypress.Commands.add('api_createProject', project =>
  gitlabRequest({
    method: 'POST',
    url: '/api/v4/projects/',
    body: {
      name: project.name,
      description: project.description,
      initialize_with_readme: true,
    },
  }).then(response => {
    if (response.status === 201 && Number.isInteger(response.body.id)) {
      createdProjects.add(String(response.body.id))
    }
    return response
  })
)

Cypress.Commands.add('api_trackProject', (namespace, project) => {
  if (!/^[\w.-]+$/.test(namespace) || !/^project-[\da-f-]{36}$/i.test(project)) return
  createdProjects.add(encodeURIComponent(namespace + '/' + project))
})

Cypress.Commands.add('api_deleteProjects', () => {
  for (const id of createdProjects) {
    gitlabRequest({ method: 'DELETE', url: `/api/v4/projects/${id}`, failOnStatusCode: false }).then(({ status }) => {
      expect(status).to.be.oneOf([202, 204, 404])
      createdProjects.delete(id)
    })
  }
})

Cypress.Commands.add('api_createIssue', issue =>
  cy.api_createProject(issue.project).then(({ body }) => gitlabRequest({
    method: 'POST',
    url: `/api/v4/projects/${body.id}/issues`,
    body: { title: issue.title, description: issue.description },
  }))
)

Cypress.Commands.add('api_createLabel', (projectId, label) =>
  gitlabRequest({ method: 'POST', url: `/api/v4/projects/${projectId}/labels`, body: label })
)

Cypress.Commands.add('api_createMilestone', (projectId, milestone) =>
  gitlabRequest({ method: 'POST', url: `/api/v4/projects/${projectId}/milestones`, body: { title: milestone.title } })
)
