module.exports = function(grunt) {
    // Loads each task referenced in the packages.json file
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);

    //var mySecret = false;
    //if (grunt.file.exists('secret.json')) {
    //    mySecret = grunt.file.readJSON('secret.json');
    //}


    // Initiate grunt tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        moment: require('moment'),

        m2j: {
            release: {
                options: {
                    minify: false,
                    width: 10000
                },
                files: {
                    'build/data.json': ['content/*.md']
                },
            }
        },
        clean: {
            dist: ['dist/**/*'],
            deploy: ['deploy/**/*'],
            build: ['build/**/*']
        },
        copy: {
            images: {
                expand: true,
                cwd: 'assets/illustrations',
                src: '**',
                dest: 'build/illustrations',
                filter: 'isFile'
            },
            files: {
                expand: true,
                cwd: 'build',
                src: '**',
                dest: 'dist',
                filter: 'isFile'
            }
        },
        secret: grunt.file.readJSON('secret.json'),
        sftp: {
            stage: {
                files: {
                    "./": "dist/**"
                },
                options: {
                    path: '<%= secret.stage.path %>',
                    srcBasePath: "dist/",
                    host: '<%= secret.stage.host %>',
                    username: '<%= secret.stage.username %>',
                    password: '<%= secret.stage.password %>',
                    //privateKey: grunt.file.read('id_rsa'),
                    //passphrase: '<%= secret.passphrase %>',
                    showProgress: true,
                    createDirectories: true,
                    directoryPermissions: parseInt(755, 8)
                }
            },
            prod: {
                files: {
                    "./": "dist/**"
                },
                options: {
                    path: '<%= secret.prod.path %>',
                    srcBasePath: "dist/",
                    host: '<%= secret.prod.host %>',
                    username: '<%= secret.prod.username %>',
                    password: '<%= secret.prod.password %>',
                    //privateKey: grunt.file.read('id_rsa'),
                    //passphrase: '<%= secret.passphrase %>',
                    showProgress: true,
                    createDirectories: true,
                    directoryPermissions: parseInt(755, 8)
                }
            }
        }

    });

    // ----------------------------------------------------------
    // Tasks

    // Register tasks
    grunt.registerTask('default', ['m2j']);
    grunt.registerTask('build', ['m2j', 'copy']);

    grunt.registerTask('deploy-stage', ['clean', 'm2j', 'copy', 'sftp:stage']);
    grunt.registerTask('deploy-prod', ['clean', 'm2j', 'copy', 'sftp:prod']);

};
