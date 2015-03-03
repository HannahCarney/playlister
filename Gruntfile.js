module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine_node: {
      options: {
        forceExit: true,
      },
      all: ['spec/']
    },
    jshint: {
      src: ['public/js/*.js', 'server.js', 'models/*.js', 'routes/*.js', 'controllers/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    mocha_casperjs: {
      options: {
      },
      files: {
        src: ['test/*']
      }
    },

    mochacli: {
      options: {
        require: ['chai'],
        reporter: 'spec',
        timeout: 60000,
        bail: true
      },
      all: ['specs/*.js', 'tests/*.js']
    },

    run: {
      selenium_server: {
        options: {
          wait: false
        },
        exec: 'selenium-standalone start &>/dev/null'
      }
    },

    express: {
      test: {
        options: {
          script: 'server.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-casperjs');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.registerTask('default', ['express:test', 'run:selenium_server', 'mochacli', 'stop:selenium_server']);
  grunt.registerTask('hint', 'jshint')
};
