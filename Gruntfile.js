module.exports = function (grunt) {

    grunt.initConfig({
        less: {
            compile: {
                files: {
                    '/stylesheets/style.css': '/stylesheets/style.less'
                }
            }
        },
        watch: {
            scripts: {
                files: ['/stylesheets/*.less'],
                tasks: ['less']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less', 'watch']);
};
