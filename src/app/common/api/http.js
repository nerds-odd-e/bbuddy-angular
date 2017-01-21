import {Inject} from '../decorators'

@Inject('$http', 'Notification')
export default class Http{
    constructor($http, notification) {
        this.$http = $http
        this.notification = notification
        this.hostUrl = 'http://localhost:3000/'
    }
    url(path) {
        return `${this.hostUrl}${path}`
    }
    callbackWithResponseData(callback){
        return (response) => callback(response.data)
    }
    errorHandler(){
        return (response) => {
            var errorMessage = response.data.errors ? response.data.errors.join('<br/>') : `Something bad happened! (${response.status})`;
            this.notification.error(errorMessage)
        }
    }
    get(path, callback) {
        this.$http.get(this.url(path)).then(this.callbackWithResponseData(callback), this.errorHandler())
    }
    post(path, data, config, callback){
        if (typeof config === 'function'){
            callback = config
            config = {}
        }
        this.$http.post(this.url(path), data, config).then(this.callbackWithResponseData(callback), this.errorHandler())
    }
}

