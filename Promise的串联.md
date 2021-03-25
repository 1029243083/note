# Promise的串联

- 当后续的Promise需要用到之前的Promise的处理结果时，需要Promise串联

- Promise对象中，无论是then方法还是catch方法，它们都具有返回值，返回的是一个全新的Promise对象，这个Promise的状态满足下面的规则：

  1. 如果当前的Promise是未决的，得到的新的Promise是挂起状态
  2. 如果当前的Promise是已决的，会运行响应的后续的处理函数，并将后续处理函数的结果(返回值)作为resolved状态数据，应用到新的Promise中；如果后续的处理函数中发生了错误，则把返回值作为rejectd状态数据，应用到新的Promise中。

  ```javascript
  const pro = new Promise((resolve,reject) => {
      resolve(1);
  })
  // pro2一定要等pro（resolved）之后才会已决，才执行then
  // pro2的状态完全看pro是resolved还是rejected
  const pro2 = pro.then(res => res * 2); // then() 返回一个全新的Promise, 返回的值会给下一个Promise
  console.log(pro2); // 挂起状态
  pro2.then(res => {
  	console.log(res); // 2
  })
  ```

  ```javascript
  const pro = new Promise((rseolve,reject) => {
      throw 1;
  })
  
  const pro2 = pro.then(res => {
      return res;
  }, err => {
      throw err * 3;
  })
  
  // 这个catch返回的是新的Promise
  pro.catch(err => {
      throw err * 2;
  })
  
  //这个用的是pro2的Promise
  pro2.then(res => {
      console.log(res);
  }, err => {
      console.log(err) //3 
  })
  ```

  

**后续的Promise一定会等前面的Promise有了后续结果后，才会变成已决状态**

**如果前面的Promise的后续处理，返回的是一个Promise，则返回的新的Promise状态和后续处理返回的Promise状态保持一致** 

```javascript
const pro1 = new Promise((resolve,reject) => {
    resolve(1);
})

const pro2 = new Promise((resolve,reject) => {
    resolve(2)
})

// 按理说这里返回的应该是Promise, 但是在Promise里返回Promise，他会取返回的那个Promise的值
// 就是说pro2 和 pro3 返回的值一致，会把pro2的resolve的值返回
const pro3 = new Promise((resolve,reject) => {
    return pro2; // 假如pro2中有定时器要3秒之后在resolve，尽管pro3的状态已经出来了，但是他要跟pro2的状态保持一致，所以3秒之后，pro3.then() 才会执行
})

pro3.then(res => {
    consloe.log(res); // 2
})
```

