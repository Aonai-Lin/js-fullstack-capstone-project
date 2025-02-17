import React, { createContext, useState, useContext } from 'react';

// 创建一个上下文(context)对象，名为AppContext，用于在组件树中传递数据，初始值为undefined
const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

// 1. 数据流
// 提供者（AuthProvider）：
//    创建全局状态（isLoggedIn 和 userName）。
//    通过 AppContext.Provider 将这些状态传递给子组件树。
// 消费者（useAppContext）：
//    使用 useContext(AppContext) 从上下文中读取值。
//    在组件中通过解构直接使用这些值和函数。

// 2. 图解
// +----------------+        +----------------+        +----------------+
// |               |        |               |        |               |
// |  App.js        | -----> |  AuthProvider  | -----> |  MyComponent   |
// |  (Root)        |        |  (Provider)    |        |  (Consumer)    |
// |               |        |               |        |               |
// +----------------+        +----------------+        +----------------+
// App.js：根组件，使用 AuthProvider 包裹子组件树。
// AuthProvider：提供全局状态。
// MyComponent：通过 useAppContext 消费全局状态。

// 3. summary
// AppContext：上下文对象，用于定义上下文。
// AuthProvider：提供者组件，用于创建和提供全局状态。
// AppContext.Provider：提供上下文值，将状态传递给子组件。
// useContext(AppContext)：从上下文中读取值，通常通过自定义钩子 useAppContext 封装。
