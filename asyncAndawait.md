# async 和 await

## async

async 用于修饰函数（无论是函数字面量还是函数表达式），放置在函数最开始的位置，被修饰函数的返回结果一定是Promise对象

```javascript
	async function test() {
        console.log(1);
        return 1; // return 表示完成时的状态数据 如果返回的是Promise的话，就直接用返回的Promise
    }

	// 等效于
	function rest () {
        return new Promise((resolve,reject) => {
            console.log(1);
            resolve(1);
		})
    }
```

**如果await后面不是Promise,则会其使用Promise.resolve包装后按照规则运行**

```javascript
async function test(){
    const res = await 1;
    consloe.log(res);
}

// 等效于
function test(){
    return new Promise((resolve,reject) => {
        Promise.resolve(1).then(data => {
            const res = data;
            consloe.log(res);
            resolve();
        })
    })
}
```

**如果发生错误**

```javascript
async function test(){
    if(Math.random() < 0.5){
        return 1;
    }else {
        throw 2;
    }
}

async function test1(){
    try{
        const res = await test();
        console.log(res);
    }catch(err) {
        console.log(res);
    }
}
```

