module.exports = function(grunt){
  'use strict';

  var tasks = [
    'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-browserify',
    'grunt-tape',
    'grunt-contrib-jasmine',
    'grunt-contrib-watch',
    'grunt-contrib-uglify',
    'grunt-jscs'
  ];

  var config = {};

  // *********************************************
  // jshint
  config.jshint = {};
  config.jshint.src = ['src/core/*.js','src/helpers/*.js','src/interface/*.js','src/defaultProperties/*.js'];
  config.jshint.test = ['tests/**/*.js','Gruntfile.js'];
  config.jshint.options = {
    jshintrc : true
  };

  // *********************************************
  // tape
  config.tape = {
    options : {
      pretty : false,
      output : 'console'
    },
    files : ['tests/**/index.js']
  };

  // *********************************************
  // browserify
  config.browserify = {
    dist : {
      files : {
        'dist/tembo.js' : ['src/Tembo.js']
      },
      options : {
        standalone : true
      }
    }
  };

  // *********************************************
  // jscs
  config.jscs = {
    src  : 'src/**/*.js',
    test : ['tests/**/*.js','Gruntfile.js'],
    options : {
      config : '.jscsrc'
    }
  };

  // *********************************************
  // concat
  // config.concat = {
  //   dist: {
  //     src: [
  //       'src/Tembo.js',
  //       'src/core/*.js',
  //       'src/interface/*.js',
  //     ],
  //     dest: 'dist/tembo.js'
  //   }
  // }

  // *********************************************
  // uglify
  config.uglify = {};
  config.uglify.all = {
    files : {
      'dist/tembo.min.js' : ['dist/tembo.js']
    },
    options : {
      preserveComments : false,
      sourceMap : 'dist/tembo.min.map',
      sourceMappingURL : 'tembo.min.map',
      report : 'min',
      beautify : {
        ascii_only : true
      },
      compress : {
        hoist_funs : false,
        loops : false,
        unused : false
      }
    }
  };

  // *********************************************
  // watch
  config.watch = {};
  config.watch.scripts = {
    files : ['src/**/*.js','src/*.js'],
    tasks : ['default'],
    options : {
      spawn : false
    }
  };

  grunt.initConfig(config);

  tasks.forEach(grunt.loadNpmTasks);

  grunt.registerTask('build',['browserify','uglify']);

  grunt.registerTask('hint',['jshint','jscs']);

  grunt.registerTask('test',['tape','jasmine']);

  grunt.registerTask('default',['hint','browserify','uglify','watch']);

};
