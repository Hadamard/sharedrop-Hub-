'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Load local grunt tasks
  grunt.loadTasks('./tasks');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.config.init({
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      emberTemplates: {
        files: 'app/scripts/app/templates/**/*.{hbs,hjs,handlebars}',
        tasks: ['emberTemplates:dev']
      },

      compass: {
        files: 'app/styles//**/*.{sass,scss}',
        tasks: ['compass:dev']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
          '.tmp',
          'dist/*',
          '!dist/.git*'
          ]
        }]
      },
      dev: '.tmp'
    },

    compass: {
      dist: {
        options: {
          sassDir: 'app/styles',
          cssDir: '.tmp/styles',
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: 'app/styles',
          cssDir: '.tmp/styles'
        }
      }
    },

    // Compiles Handlebar templates to a single JS file
    emberTemplates: {
      options: {
        templateBasePath: 'app/scripts/app/templates'
      },
      dev: {
        src: 'app/scripts/app/templates/**/*.{hbs,hjs,handlebars}',
        dest: '.tmp/scripts/app/compiled_templates.js'
      },
      dist: {
        src: 'app/scripts/app/templates/**/*.{hbs,hjs,handlebars}',
        dest: '.tmp/scripts/app/compiled_templates.js'
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist'
      }
    },

    // Performs rewrites based on the useminPrepare configuration
    usemin: {
      html: 'dist/index.html',
      options: {
        dirs: ['dist']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app',
          dest: 'dist',
          src: [
            'index.html',
            'server.js'
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      dev: [
        'compass:dev',
        'emberTemplates:dev'
      ],

      dist: [
        'compass:dist',
        'emberTemplates:dist'
      ]
    },

    env: {
      dev: {
        src : ".env"
      }
    },

    server: {
      dev: {
        options: {
          dir: 'app',
          base: [
            '.tmp',
            'app'
          ]
        }
      },

      dist: {
        options: {
          dir: 'dist',
          base: [
            'dist'
          ]
        }
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'server:dist:keepalive']);
    }

    grunt.task.run([
      'clean:dev',
      'env:dev',
      'concurrent:dev',
      'server:dev',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};