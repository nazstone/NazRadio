module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                report: 'gzip'
            },
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/public/assets/js/nazradio/',
                    src: '**/*.js',
                    dest: 'dist/public/assets/js/nazradio/'
                }]
            }
        },
        cssmin: {
            options: {
                report: 'gzip'
            },
            main: {
                expand: true,
                cwd: 'src/',
                src: ['public/assets/css/**/*.css', '!public/assets/css/**/*.min.css'],
                dest: 'dist/'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.*', '!public/assets/js/nazradio/**/*.js', '!*.sqlite3', '!public/assets/css/**/*.css', 'public/assets/css/**/*.min.css'],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: './',
                        src: ['package.json'],
                        dest: 'dist/'
                    },
            ]
            }
        },
        clean: {
            main: ["dist"]
        },
        compress: {
            main: {
                options: {
                    archive: 'nazMpd.zip'
                },
                files: [
                    {
                        src: ['dist/**/*.*'],
                        dest: '.'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/template/index.handlebars': 'src/template/index.handlebars'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'copy', 'uglify', 'cssmin', 'htmlmin']);

};