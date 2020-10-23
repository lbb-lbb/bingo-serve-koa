const mongodb = require('mongodb').MongoClient;
const url = 'mongodb://lbb:15278277301lol@localhost4:27017/BlogData';


class Mongodb {
    //静态方法，多次连接共享一个实例对象
    static getInstance() {
        if (!Mongodb.instance) {
            Mongodb.instance = new Mongodb()
        }
        return Mongodb.instance
    }
    constructor() {
            this.client = {};
            //实例化时候就连接数据库，减少连接时间
            this.connect()
        }
        //连接
    connect() {
            return new Promise(((resolve, reject) => {
                if (this.client) {
                    mongodb.connect(url, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    }, (err, client) => {
                        try {
                            this.client = client.db('BlogData');
                            console.log('连接成功')
                            resolve(this.client)
                        } catch (e) {
                            throw new Error(err)
                        }
                    })
                } else {
                    console.log('连接成功')
                    resolve(this.client)
                }
            }))
        }
        //添加
    add(name, json) {
            return new Promise((resolve, reject) => {
                this.connect().then(db => {
                    db.collection(name).insertOne(json, (err, result) => {
                        if (!err) {
                            console.log('增加' + json + '成功')
                            resolve(result)
                        } else {
                            reject(err)
                        }
                    })
                })
            })
        }
        //删除
    remove(name, json) {
            return new Promise((resolve, reject) => {
                this.connect().then(db => {
                    db.collection(name).removeOne(json, (err, result) => {
                        if (!err) {
                            console.log('删除' + json + '成功')
                            resolve(result)
                        } else {
                            reject(err)
                        }
                    })
                })
            })
        }
        //更新数据
    update(name, condition, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(name).updateOne(condition, { $set: json }, (err, result) => {
                    if (!err) {
                        resolve(result)
                    } else {
                        reject(err)
                    }
                })
            })
        })
    }
    find(name, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                let result = db.collection(name).find(json);
                result.toArray((err, data) => {
                    if (!err) {
                        resolve(data)
                    } else {
                        reject(err)
                    }
                })
            })
        })
    }
    findOne(name, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(name).findOne(json, (err, result) => {
                    if (!err) {
                        resolve(result)
                    } else {
                        reject(err)
                    }
                })
            })
        })
    }
}
module.exports = Mongodb.getInstance()