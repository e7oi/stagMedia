var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {

    mix.sass('app.scss');

    // css
    mix.styles([
        'bootstrap-3.3.5/css/bootstrap.css',
        'bootstrap-3.3.5/css/bootstrap-theme.css'
    ], 'public/css/vendors.css', 'public/vendor');

    // fonts
    mix.copy('public/vendor/bootstrap-3.3.5/fonts', 'public/fonts');

    // vendor js
    mix.scripts([
        'bootstrap-3.3.5/js/bootstrap.js',
        'holder/holder.js'
    ], 'public/js/vendors.js', 'public/vendor');


});
