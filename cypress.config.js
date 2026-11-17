const { defineConfig } = require('cypress')
const { execFile } = require('node:child_process')
const fs = require('node:fs/promises')
const path = require('node:path')
const { promisify } = require('node:util')

const runGit = promisify(execFile)

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost',
    env: {
      hideCredentials: true,
      requestMode: true,
    },
    setupNodeEvents(on, config) {
      on('task', {
        async cloneGitLabProject({ user, project }) {
          if (typeof user !== 'string' || !/^[\w.-]+$/.test(user) ||
              typeof project !== 'string' || !/^project-[\da-f-]{36}$/i.test(project)) {
            throw new Error('Invalid GitLab test project path.')
          }
          const host = new URL(config.baseUrl).hostname
          const downloads = path.join(config.projectRoot, 'cypress', 'downloads')
          await fs.mkdir(downloads, { recursive: true })
          await runGit('git', ['clone', '--', `git@${host}:${user}/${project}.git`, project], { cwd: downloads })
          return null
        },
      })
    },
  },
  fixturesFolder: false,
  video: false,
})
