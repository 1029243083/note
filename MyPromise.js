/**
 * 定义三个状态
 * 当前的值
 * 当前的状态
 * 成功的任务队列
 * 失败的任务队列
 * resolve函数
 * reject函数
 */


const MyPromise = (function () {

    const PENDING = 'pending',
        RESOLVED = 'resolved',
        REJECTED = 'reject', //三种状态
        PromiseValue = Symbol('PromiseValue'), // 当前的值
        PromiseStatus = Symbol('PromiseStatus'), // 当前的状态
        changeStatus = Symbol('changeStatus'), // 改变当前的状态
        thenablesList = Symbol('thenablesList'), // then的任务队列
        catchablesList = Symbol('catchablesList'), // catch的任务对象
        addMethodToList = Symbol('addMethodToList'), //添加任务到对应的数组
        linkPromise = Symbol('linkPromise') //返回新的Promise

    return class MyPromise {

        constructor(handle) {
            this[PromiseStatus] = PENDING;
            this[PromiseValue] = undefined;
            this[thenablesList] = [];
            this[catchablesList] = [];
            const resolve = data => {
                this[changeStatus](RESOLVED, data, this[thenablesList]);
            };
            const reject = err => {
                this[changeStatus](REJECTED, err, this[catchablesList]);
            };

            try {
                // 未决阶段的函数
                handle(resolve, reject);
            } catch (error) {
                reject(error)
            }
        }

        /**
         * 改变当前的状态，并执行任务列表
         * @param {String} status // 要改变的状态
         * @param {} data // 传递过来的数据
         * @param {*} handleList // 要执行额任务队列
         * @returns 
         */
        [changeStatus](status, data, handleList) {
            if (this[PromiseStatus !== PENDING]) {
                return;
            }
            this[PromiseStatus] = status;
            this[PromiseValue] = data;
            handleList.forEach(fn => {
                fn(this[PromiseValue])
            });
        }

        /**
         * 添加任务到数组
         * @param {Function} handle 处理函数
         * @param {Symbol} immediately 是否立即执行
         * @param {Array} handleList 任务数组
         */
        [addMethodToList](handle, immediately, handleList) {
            if (typeof handle !== 'function') return;
            if (this[PromiseStatus] === immediately) {
                setTimeout(() => {
                    handle(this[PromiseValue]);
                }, 0)
            } else {
                handleList.push(handle);
            }
        }

        /**
         * 把任务函数添加到数组中，当推向已决状态时，会执行数组中的任务函数，
         * 把当前这个任务函数进行包装，才能知道什么时候到我这个任务函数
         * 
         * 上一个Promise什么时候 推向已决，这一个Promise什么时候推向已决
         * 
         * @param {*} thenHandle // 任务函数 
         * @param {*} catchHandle 
         * @returns 
         */
        [linkPromise](thenHandle, catchHandle) {
            function exec(data, handle, resolve, reject) {
                try {
                    const res = handle(data);
                    if (res instanceof MyPromise) {
                        res.then(result => {
                            resolve(result);
                        }, err => {
                            reject(err)
                        })
                    } else {
                        resolve(res);
                    }
                } catch (error) {
                    reject(error)
                }
            }
            return new MyPromise((resolve, reject) => {
                this[addMethodToList](data => {
                    if (typeof thenHandle !== 'function') {
                        resolve(data);
                        return;
                    }
                    exec(data, thenHandle, resolve, reject)
                }, RESOLVED, this[thenablesList]);

                this[addMethodToList](data => {
                    if (typeof catchHandle !== 'function') {
                        reject(data);
                        return;
                    }
                    exec(data, catchHandle, resolve, reject)
                }, REJECTED, this[catchablesList]);
            })
        }

        /**
         * 添加任务到任务队列
         * @param {Function} thenHandle 
         * @param {Function} catchHandle 
         */
        then(thenHandle, catchHandle) {
            /**
             * 因为要串联 要返回Promise，如果在这里把任务函数添加到队列，就不知道这个任务函数什么时候运行
             * 就不知道怎么去触发下一个Promise
             */
            return this[linkPromise](thenHandle, catchHandle)
        }

        /**
         * 添加错误任务到任务队列
         * @param {Function} catchHandle 
         */
        catch(catchHandle) {
            return this[linkPromise](undefined, catchHandle)
        }

        static all(pros) {
            return new MyPromise((resolve, reject) => {
                const result = pros.map(p => {
                    const obj = {
                        result: undefined,
                        isResolve: false
                    };
                    p.then(res => {
                        obj.result = res;
                        obj.isResolve = true;
                        const allThen = result.filter(i => !i.isResolve);
                        if (allThen.length <= 0) {
                            resolve(result.map(p => p.result));
                        }
                    }, err => {
                        reject(err);
                    })
                    return obj;
                })
            })
        }

        static race(pros) {
            return new Promise((resolve, reject) => {
                pros.forEach(p => {
                    p.then(res => {
                        resolve(res)
                    }, err => {
                        reject(err)
                    })
                })
            })
        }

        static resolve(data) {
            return new Promise((resolve, reject) => {
                resolve(data)
            })
        }

        static reject(err) {
            return new Promise((resolve, reject) => {
                reject(err)
            })
        }
    }


})()