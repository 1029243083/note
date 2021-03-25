# Promise的其他api

## 原型成员

- `then` : 注册一个后续处理函数，当Promise为resolved状态时运行此函数

- `catch`: 注册一个后续处理函数，当Promise为rejected状态时运行此函数

- `finally`： [ES2018]注册一个后续处理函数（无参），当Promise为已决时运行此函数

  

## 构造函数成员

- resolve（数据）：该方法返回一个resolve状态的Promise，传递的数据作为状态数据
  - 特殊情况：如果传递的数据时Promise，则直接返回传递的Promise对象
- reject（数据）：该方法返回一个reject状态的Promise，传递的数据作为状态数据
- `all`（iterable）: 这个方法返回一个全新的Promise，该Promise要等iterable参数里的所有Promise对象全部成功后才能触发成功，一旦有一个失败，那么这个Promise对象失败。这个Promise成功后会将之前所有的Promise的返回结果，做成一个数据，作为成功后的参数，失败也一样
- `race` : 这个方法返回一个全新的Promise，更竞赛一样，看那个Promise先完成是是什么状态，那这个Promise就是什么状态