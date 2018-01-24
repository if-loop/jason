module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'server/index.js'
        }
      }
    },

    watch: {
      express: {
        files:  [ 'server/**/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    }
  });

  grunt.registerTask('default', ['express:dev', 'watch']);
};