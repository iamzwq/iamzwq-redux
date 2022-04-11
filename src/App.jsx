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

const UserModify = () => {
  const { appState, setAppState } = useContext(appContext);

  const onChange = (e) => {
    appState.user.name = e.target.value;
    setAppState({ ...appState });
  };
  return (
    <div>
      User: <input type="text" value={appState.user.name} onChange={onChange} />
    </div>
  );
};
