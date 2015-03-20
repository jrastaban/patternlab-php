'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Include project variables
  var pkg = require('./package.json');

  // Project configuration.
  grunt.initConfig({

    uglify: {
        options: {
              beautify: true
            },
        dist: {
          files: {
            'source/js/bootstrap.js': [
              'source/bower_components/sass-bootstrap/js/transition.js',
              'source/bower_components/sass-bootstrap/js/alert.js',
              'source/bower_components/sass-bootstrap/js/button.js',
              'source/bower_components/sass-bootstrap/js/carousel.js',
              'source/bower_components/sass-bootstrap/js/collapse.js',
              'source/bower_components/sass-bootstrap/js/dropdown.js',
              'source/bower_components/sass-bootstrap/js/modal.js',
              'source/bower_components/sass-bootstrap/js/tooltip.js',
              'source/bower_components/sass-bootstrap/js/popover.js',
              'source/bower_components/sass-bootstrap/js/scrollspy.js',
              'source/bower_components/sass-bootstrap/js/tab.js',
              'source/bower_components/sass-bootstrap/js/affix.js'
            ]
          }
        }
      },

    copy: {
      dist: {
          files: [{
              expand: true,
              dot: true,
              cwd: 'source',
              dest: 'public',
              src: [
                  'images/{,*/}*.{ico,png,svg,jpg,gif}',
                  'js/**/*.js',
              ]
          }]
      },
    },

    // Task configuration.
    shell: {
      patternlab: {
        command: 'php core/builder.php -g'
      },
      patternlabPatterns: {
        command: 'php core/builder.php -gp'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      dist: {
        options: {
          style: 'compressed',
          sourcemap: 'auto' //requires Sass 3.4.0+ (http://coolestguidesontheplanet.com/running-installing-sass-osx-10-9-mavericks/)
        },
        files: {
          'public/css/style.css': 'source/css/style.scss',
          'public/styleguide/css/styleguide.css': 'public/styleguide/css/styleguide.scss',
          'public/styleguide/css/styleguide-specific.css': 'public/styleguide/css/styleguide-specific.scss'
        }
      }
    },


    watch: {
      options: {
        livereload: {
          options: {livereload: '<%= connect.options.livereload %>'},
          files: [
            'public/**/*'
          ]
        }
      },
      html: {
        files: [
          'source/_patterns/**/*.mustache',
          'source/_patterns/**/*.json',
          'source/_data/*.json',
        ],
        tasks: [ 'shell:patternlabPatterns' ],
      },
      sass: {
        files: [
          'source/css/*.scss',
          'source/css/**/*.scss',
          'public/styleguide/css/**/*.scss'
        ],
        tasks: ['sass'],
      },
      images: {
        files: [
          'source/images/**/*.svg',
          'source/images/**/*.png',
          'source/images/**/*.jpg',
          'source/images/**/*.gif',
          'source/images/**/*.ico'
        ],
        tasks: ['copy:dist'],
      },
      js: {
        files: [
          'source/js/**/*.js'
        ],
        tasks: ['copy:dist']
      }
    },

    connect: {
      options: {
          port: 9000,
          livereload: 35729,
          // Change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost'
      },
      livereload: {
          options: {
              open: 'http://localhost:9000',
              base: [
                  'public/'
              ]
          }
      },
      dist: {
          options: {
              open: true,
              base: 'public/',
              livereload: false
          }
      }
    },

    // Task to deploy the built scripts
    buildcontrol: {
      options: {
        dir: 'public',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%',
      },
      dist: {
        options: {
          remote: 'git@bitbucket.org:wustl/wustl-pattern-lab.git',
          branch: 'dist',
          tag: pkg.version
        }
      }
    },


  }); // End Project Config

  // build task
  grunt.registerTask('build', [ 'uglify', 'shell:patternlab', 'sass']);

  // grunt serve to build and serve PL locally
  grunt.registerTask('serve', ['build', 'connect:livereload', 'watch']);

  // deploy task
  grunt.registerTask('deploy', [
    'buildcontrol:dist',
  ]);

  grunt.registerTask('default', ['build']);


};
