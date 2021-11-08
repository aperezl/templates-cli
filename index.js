#!/usr/bin/env node

import inquirer from 'inquirer'
import * as fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

import createDirectoryContents from './createDirectoryContents.js'
const CURR_DIR = process.cwd()

const __dirname = dirname(fileURLToPath(import.meta.url))
console.log(`${__dirname}/templates`)
const CHOICES = fs.readdirSync(`${__dirname}/templates`, 'utf8')

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES,
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: input => {
      if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true
      else
        return 'Project name may only include letters, numbers, underscores and hashes.'
    },
  },
]

inquirer.prompt(QUESTIONS).then(async answers => {
  const projectChoice = answers['project-choice']
  const projectName = answers['project-name']
  const templatePath = `${__dirname}/templates/${projectChoice}`
  fs.mkdirSync(`${CURR_DIR}/${projectName}`)
  createDirectoryContents(templatePath, projectName)
  exec(
    `cd ${CURR_DIR}/${projectName} && git init && npm install`,
    (err, stdout, stderr) => {
      if (err) console.log(err)
      console.log(stdout)
      console.log(stderr)
    }
  )
})
