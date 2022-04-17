import { createContext, useEffect, useState, useContext } from "react";

export const appContext = createContext(null);

export const store = {
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

export const connect = (Component) => {
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

export const reducer = (state, { type, payload }) => {
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
