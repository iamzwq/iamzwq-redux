import React from "react";
import { appContext, connect, store } from "./redux";
import "./App.css";

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

export default function App() {
  return (
    <appContext.Provider value={store}>
      <FirstChild />
      <SecondChild />
      <LastChild />
    </appContext.Provider>
  );
}
