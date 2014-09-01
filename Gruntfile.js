'use strict';

module.exports = function (grunt) {

  var pkg = require('./package.json');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Grunt package with settings
    pkg: grunt.file.readJSON('package.json'),

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      html: {
        files: [
          '<%= pkg.config.source %>/**/*.html'
        ],
        tasks: ['copy:html', 'wiredep']
      },
      js: {
        files: ['<%= pkg.config.source %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/unit/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'jasmine:dist']
      },
      sass: {
        files: ['<%= pkg.config.source %>/styles/**/*.{scss,sass}'],
        tasks: ['sass:server']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.tmp/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= pkg.config.source %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: '<%= pkg.config.connectPort %>',
        hostname: '<%= pkg.config.connectHost %>',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= pkg.config.source %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= pkg.config.source %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= pkg.config.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= pkg.config.source %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= pkg.config.dist %>/*',
              '!<%= pkg.config.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp',
      test: '<%= pkg.config.test.junitXmlPath %>'
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['.tmp/**/*.html'],
        ignorePath: '<%= pkg.config.source %>/',
        exclude: '<%= pkg.config.bowerExclude %>'
      }
    },

    // Compile SASS into CSS with libsass (node-sass)
    sass: {
      options: {
        includePaths: pkg.config.sassIncludePaths,
        imagePath: '<%= pkg.config.source %>/images'
      },
      dist: {
        options: {
          sourceComments: 'none'
        },
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.source %>/styles',
            src: '{,*/}*.{scss,sass}',
            ext: '.css',
            dest: '.tmp/styles'
          }
        ]
      },
      server: {
        options: {
          sourceMap: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.source %>/styles',
            src: '{,*/}*.{scss,sass}',
            ext: '.css',
            dest: '.tmp/styles'
          }
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      src: ['.tmp/*.html'],
      options: {
        dest: '<%= pkg.config.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= pkg.config.dist %>/{,*/}*.html'],
      css: ['<%= pkg.config.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= pkg.config.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.source %>/images',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: '<%= pkg.config.dist %>/images'
          }
        ]
      }
    },
    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.source %>/images',
            src: '{,*/}*.svg',
            dest: '<%= pkg.config.dist %>/images'
          }
        ],
        options: {
          plugins: [
            { removeEmptyContainers: true },
            { cleanupIDs: false },
            { removeUnknownsAndDefaults: false }
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.dist %>',
            src: ['*.html'],
            dest: '<%= pkg.config.dist %>'
          }
        ]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat/scripts',
            src: '*.js',
            dest: '.tmp/concat/scripts'
          }
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= pkg.config.source %>',
            dest: '<%= pkg.config.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'bower_components/**/*',
              'images/{,*/}*.{webp}',
              'fonts/*'
            ]
          },
          {
            expand: true,
            cwd: '.tmp',
            dest: '<%= pkg.config.dist %>',
            src: [
              '*.html'
            ]
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= pkg.config.source %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      html: {
        files: [
          {
            expand: true,
            dot: false,
            cwd: '<%= pkg.config.source %>',
            dest: '.tmp',
            src: [
              '**/*.html',
              '!bower_components/**'
            ]
          }
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass:server'
      ],
      test: [
        'sass:dist'
      ],
      dist: [
        'sass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    jasmine: {
      options: {
        specs: 'test/spec/**/*.spec.js',
        helpers: 'test/spec/**/*.helper.js',
        phantomjs: {
          'ignore-ssl-errors': true
        }
      },
      dist: {
        src: pkg.config.test.testResources
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'copy:html',
      'wiredep',
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function () {
    grunt.task.run([
      'clean:server',
      'concurrent:test',
      'connect:test',
      'jasmine:dist'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'copy:html',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    pkg.config.prepareForAngular ? 'ngmin' : 'noop',
    'copy:dist',
    'cssmin',
    'uglify',
    'usemin',
    pkg.config.minifyHtml ? 'htmlmin' : 'noop'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  // Doing nothing for better task disabling
  grunt.registerTask('noop', function () {
  });
};
