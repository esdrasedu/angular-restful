'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.description %>\n' +
                ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * @link <%= pkg.homepage %>\n' +
                ' * @author <%= pkg.author %>\n' +
                ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
                ' */\n'
        },
        dirs: {
            dest: 'dist'
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['src/*.js'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
            }
        },
        zip: {
            'dist/angular-restful.zip': ['<%= dirs.dest %>/<%= pkg.name %>.js', '<%= dirs.dest %>/<%= pkg.name %>.min.js']
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            build: {
                singleRun: true,
                autoWatch: false
            },
            dev: {
                autoWatch: true
            }
        },
        changelog: {
            options: {
                dest: 'CHANGELOG.md'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-karma');

    grunt.loadNpmTasks('grunt-conventional-changelog');

    grunt.loadNpmTasks('grunt-zip');


    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['karma:build', 'concat', 'uglify', 'zip']);

    grunt.registerTask('test', ['karma:build']);

    grunt.registerTask('bump', 'Increment version number', function() {
        var versionType = grunt.option('type');
        function bumpVersion(version, versionType) {
            var type = {patch: 2, minor: 1, major: 0},
                parts = version.split('.'),
                idx = type[versionType || 'patch'];
            parts[idx] = parseInt(parts[idx], 10) + 1;
            while(++idx < parts.length) { parts[idx] = 0; }
            return parts.join('.');
        }
        var version;
        function updateFile(file) {
            var json = grunt.file.readJSON(file);
            version = json.version = bumpVersion(json.version, versionType || 'patch');
            grunt.file.write(file, JSON.stringify(json, null, '  '));
        }
        updateFile('package.json');
        updateFile('bower.json');
        grunt.log.ok('Version bumped to ' + version);
    });

};