import React from "react";
import { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import SurpriseCountdownGate, { isCountdownUnlocked } from "./components/SurpriseCountdownGate.jsx";
import "./styles.css";

function Root() {
  const [unlocked, setUnlocked] = useState(isCountdownUnlocked);
  const unlockSite = useCallback(() => setUnlocked(true), []);

  if (!unlocked) {
    return <SurpriseCountdownGate onUnlock={unlockSite} />;
  }

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
