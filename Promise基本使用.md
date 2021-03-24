# Promise的基本使用

```javascript
const pro = new Promise((resolve,reject) => {
	// 未决阶段的处理，立即执行
    // 通过调用resolve函数将Promise推向已决阶段的resolved状态
    // 通过调用reject函数将Promise推向已决阶段的rejected状态
    // resolve和reject均可以传递最多一个参数，表示推向状态的数据
})
pro.then(data => {
	// 这是thenable函数，如果当前的Promise已经是resolved状态，该函数会立刻执行
    // 如果当前是未决阶段，则会加入作业队列，等待resolved状态执行
    // data 为状态数据
},err => {
	// 这是catchable函数，如果当前的Promise已经是rejected状态，该函数会立刻执行
    // 如果当前是未决阶段，则会加入作业队列，等待rejected状态执行
    // err 为状态数据
})
```

**细节**

1. 未决阶段的处理函数是同步的，会立即执行

2. thenable和catchable函数是异步的，就算是立即执行，也会加入事件队列种等待执行，并且，加入的的队列是微队列

   1. ```javascript
      const pro = new Promise((resolve,reject) => {
          consloe.log('sss'); // 同步代码
          resolve(1); // 微队列
          setTimeOut(() => { // 宏队列
              console.log(2)
          },1000)
      });
      pro.then(data => {
          console.log(data)
      })
      console.log('aaa'); // 同步代码
      // sss aaa 1 2;
      ```

      

3. pro.then可以只添加thenable函数，pro.catch可以单独添加catchable函数

4. 在未决阶段的处理函数中，如果发生未捕获的错误，会将状态推向rejected，并被catchable捕获

   1. ```javascript
      const pro = new Promise((resolve,rejevt) => {
          throw new Error('ssss')
      })
      pro.catch(err => {
          console.log(err);
      })
      ```

5. 一旦状态推向已决阶段，无法再对状态做任何的更改

   1. ```javascript
      const pro = new Promise((resolve, reject) => {
          resolve(1);
          reject(2); // 无效
          resolve(1); // 无效
          reject(2); // 无效
      })
      pro.then(res => {
          console.log(res) // 1
      })
      
      pro.catch(err => {
          console.log(err)
      })
      ```

6. **Promise并没有消除回调，只是让回调变的可控**

