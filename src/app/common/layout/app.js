import 'bootstrap/dist/css/bootstrap.css'
import 'angular-loading-bar/build/loading-bar.css'
import '../../../sass/layout.css'
import angular from 'angular'
import loading from 'angular-loading-bar'
import tokenAuth from 'ng-token-auth'
import cookie from 'angular-cookie'
import uiRouter from 'angular-ui-router'
import header from './header'
import sidebar from './sidebar'


let app = {
    template: require('./app.html'),
    controller: class AppController{
            constructor() {
                this.name = 'BBuddy'
            }
        }
}

function routing($stateProvider) {
    $stateProvider
        .state('app', {
            redirectTo: 'app.dashboard',
            url: '/app',
            component: 'app',
            abstract: true,
            resolve: {
                auth: function(authentication) {
                    return authentication.validateUser()
                }
            }
        });
}
routing.$inject = ['$stateProvider']

export default angular
    .module('app', [uiRouter, loading, cookie, tokenAuth, header, sidebar])
    .component('app', app)
    .config(routing)
    .config(function($authProvider) {
        $authProvider.configure({
            apiUrl: 'http://localhost:3000',
            validateOnPageLoad: false
        })
    })
    .run(($transitions, cfpLoadingBar)=>{
        $transitions.onStart({}, cfpLoadingBar.start)
        $transitions.onSuccess({}, cfpLoadingBar.complete)
    })
    .name
