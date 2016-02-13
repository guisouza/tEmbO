module.exports = function(grunt) {
  'use strict';

  var tasks = [
    'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-contrib-jasmine',
    'grunt-contrib-watch',
    'grunt-contrib-uglify',
  ];

 var config = {};

  // *********************************************
  // jshint
  config.jshint = {};
  config.jshint.all = ['src/core/*.js','src/helpers/*.js','src/interface/*.js','src/defaultProperties/*.js'];
  config.jshint.options = {
    jshintrc : true
  }


  // *********************************************
  // concat
  config.concat = {
    dist: {
      src: [
        'src/Tembo.js',
        'src/Tembo.Component.js',
        'src/Tembo.DOMElement.js',
        'src/core/*.js',
        'src/interface/*.js',
        'src/helpers/*.js',
        'src/defaultProperties/*.js'
      ],
      dest: 'dist/tambo.js'
    }
  }


  // *********************************************
  // uglify
  config.uglify = {};
  config.uglify.all = {
    files: {
      'dist/tambo.min.js': [ 'dist/tambo.js' ]
    },
    options: {
      preserveComments: false,
      sourceMap: 'dist/tambo.min.map',
      sourceMappingURL: 'tambo.min.map',
      report: 'min',
      beautify: {
        ascii_only: true
      },
      compress: {
        hoist_funs: false,
        loops: false,
        unused: false
      }
    }
  }


  // *********************************************
  // watch
  config.watch = {};
  config.watch.scripts = {
    files: ['src/**/*.js','src/*.js'],
    tasks: ['default'],
    options: {
      spawn: false
    }
  }

  grunt.initConfig(config);

  tasks.forEach(grunt.loadNpmTasks);

  grunt.registerTask('hint', ['jshint']);

  grunt.registerTask('test', ['jasmine']);

  grunt.registerTask('default', ['jshint', 'concat', 'uglify','watch']);

};
