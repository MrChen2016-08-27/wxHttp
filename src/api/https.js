const resHandler = {
    success: (response, reqUrl) => {
        return response
    },
    error: err => {
        console.log(`ajax错误:${JSON.stringify(err)}`)
        return err
    }
}

const reqHandler = {
    before: reqUrl => {}
}

class Https {
    constructor () {
        this.type = null
        this.data = { r: Date.now() }
        this.defaults = {
            baseUrl: '',
            headers: {
                'content-type': 'application/json', // 默认值
                'Authorazition': 'Bearer token'
            }
        }

        this.interceptors = {
            response: {
                use: function (success, error) {
                    if (success) {
                        resHandler.success = success
                    }
                    if (error) {
                        resHandler.error = error
                    }
                }
            },
            request: {
                use: function (before) {
                    if (before) {
                        reqHandler.before = before
                    }
                }
            }
        }
    }

    request ({ url, type, data, header }) {
        console.log('wx request')
        return new Promise((resolve, reject) => {
            let reqUrl = `${this.defaults.baseUrl}${url}`
            reqHandler.before(reqUrl)
            wx.request({
                url: reqUrl,
                method: type || this.type,
                data: {
                    ...this.data,
                    ...data
                },
                header: Object.assign(this.defaults.headers, header),
                success: function (res) {
                    let response = resHandler.success(res, reqUrl)
                    resolve(response)
                },
                fail: function (err) {
                    let errObj = resHandler.error(err)
                    reject(errObj)
                }
            })
            console.log(this.data, '***')
        })
    }
    /**
     * @desc 文件上传接口
     * @params
     */
    upload ({ url, filePath, name }) {
        return new Promise((resolve, reject) => {
            reqHandler.before()
            wx.uploadFile({
                url: this.defaults.baseUrl + url,
                filePath,
                name,
                success (res) {
                    let response = resHandler.success(res)
                    resolve(response)
                }
            })
        })
    }

    static getInstance () {
        if (Https.instance) {
            return Https.instance
        } else {
            Https.instance = new Https()
            return Https.instance
        }
    }
}

export default Https.getInstance()
