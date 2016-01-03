const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const debug = require('debug')('alpine')

const versions = require('./versions')
const source = fs.readFileSync(path.join(__dirname, 'Dockerfile.template.hbs'), 'utf-8')
const template = Handlebars.compile(source)

function generate () {
  debug('Starting generating alpine Dockerfiles')
  versions.forEach((version) => {
    const dockerFileContent = template({
      VERSION: version,
      DEL_PKGS: 'libgcc libstdc++',
      RM_DIRS: '/usr/include'
    })

    const dockerFileLocation = path.join(__dirname, version)

    mkdirp.sync(dockerFileLocation)
    fs.writeFileSync(`${dockerFileLocation}/Dockerfile`, dockerFileContent)
    debug('Dockerfile for alpine with Node %s is done.', version)
  })
}

module.exports.generate = generate