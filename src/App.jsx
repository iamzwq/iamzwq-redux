import React, { useEffect, useState, useContext } from "react";
import "./App.css";

const store = {
  state: {
    user: { name: "iamz", age: 18 },
  },
  setState(newState) {
    store.state = newState;
    store.lisenters.forEach((fn) => fn(store.state));
  },
  // 订阅队列
  lisenters: [],
  // 订阅函数，返回值为取消订阅
  subscribe(fn) {
    store.lisenters.push(fn);
    return () => {
      const index = store.lisenters.indexOf(fn);
      store.lisenters.splice(index, 1);
    };
  },
};

const connect = (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext);
    const [, update] = useState({});
    const dispatch = (action) => {
      // setState会遍历订阅，执行订阅传入的方法
      setState(reducer(state, action));
    };

    // 在这里增加订阅，然后dispatch里会调用store.setState()
    useEffect(() => {
      store.subscribe(() => {
        // update来重新渲染页面
        update({});
      });
    }, []);
    return <Component {...props} state={state} dispatch={dispatch} />;
  };
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "modify":
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      };
    default:
      return store.state;
  }
};

const FirstChild = () => {
  console.log("大儿子执行了");
  return (
    <section>
      大儿子
      <User />
    </section>
  );
};
const SecondChild = () => {
  console.log("二儿子执行了");
  return (
    <section>
      二儿子
      <UserModify />
    </section>
  );
};
const LastChild = () => {
  console.log("小儿子执行了");
  return <section>小儿子</section>;
};

// 订阅了才会触发页面重新渲染，所以要用connect包裹
const User = connect(({ state }) => {
  console.log("User组件执行了");
  return <div>User: {state.user.name}</div>;
});

const UserModify = connect(({ state, dispatch, children }) => {
  console.log("UserModify组件执行了");
  const onChange = (e) => {
    dispatch({
      type: "modify",
      payload: { name: e.target.value },
    });
  };
  return (
    <div>
      {children}
      User:
      <input type="text" value={state.user.name} onChange={onChange} />
    </div>
  );
});

const appContext = React.createContext(null);
export default function App() {
  return (
    <appContext.Provider value={store}>
      <FirstChild />
      <SecondChild />
      <LastChild />
    </appContext.Provider>
  );
}
