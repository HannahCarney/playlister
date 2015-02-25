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
      src: ['/js']
    },
    mocha_casperjs: {
      options: {
      },
      files: {
        src: 'test/**/*.js'
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

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-casperjs');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.registerTask('default', ['jshint','jasmine_node', 'express:test', 'mocha_casperjs', 'express:test:stop']);

};
