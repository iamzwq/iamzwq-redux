import React, { useState, useContext } from "react";
import "./App.css";

const FirstChild = () => (
  <section>
    大儿子
    <User />
  </section>
);
const SecondChild = () => (
  <section>
    二儿子
    <UserModify />
  </section>
);
const LastChild = () => <section>小儿子</section>;

const appContext = React.createContext(null);
export default function App() {
  const [appState, setAppState] = useState({
    user: { name: "iamzwq", age: 18 },
  });

  const contextValue = { appState, setAppState };

  return (
    <appContext.Provider value={contextValue}>
      <FirstChild />
      <SecondChild />
      <LastChild />
    </appContext.Provider>
  );
}

const User = () => {
  const { appState } = useContext(appContext);
  return <div>User: {appState.user.name}</div>;
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
      return appState;
  }
};

const connect = (Component) => {
  return (props) => {
    const { appState, setAppState } = useContext(appContext);
    const dispatch = (action) => {
      setAppState(reducer(appState, action));
    };
    return <Component {...props} state={appState} dispatch={dispatch} />;
  };
};

const UserModify = connect(({ state, dispatch, children }) => {
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
