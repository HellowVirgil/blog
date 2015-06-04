module.exports = function (grunt) {

    grunt.initConfig({
        less: {
            compile: {
                files: {
                    'public/stylesheets/style.css': 'public/stylesheets/style.less'
                }
            }
        },
        watch: {
            scripts: {
                files: ['public/stylesheets/*.less'],
                tasks: ['less']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less', 'watch']);
};
