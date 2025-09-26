// src/stores/StoreContext.tsx
import React, { createContext, useContext } from "react";
import ConfiguratorStore from "./ConfiguratorStore";

const store = new ConfiguratorStore();

export const StoreContext = createContext<ConfiguratorStore>(store);

export const useStore = () => useContext(StoreContext);
