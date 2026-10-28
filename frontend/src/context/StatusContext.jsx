// This context is used to manage the status messages (like success or error messages)
//  that are displayed to the user. It provides a way to set a status message and 
// automatically clears it after 3 seconds. The StatusPortal component is used to display the
//  current status message in a portal.
import { createContext, useContext, useEffect, useState } from "react";

const StatusContext = createContext(null);

export function StatusProvider({ children }) {
  const [status, setStatus] = useState({
    type: "",
    text: "",
  });

  // Automatically remove status message after 3 seconds
  useEffect(() => {
    if (!status.text) return;

    const timer = setTimeout(() => {
      setStatus({
        type: "",
        text: "",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
}

export function useStatus() {
  const ctx = useContext(StatusContext);

  if (!ctx) {
    throw new Error("useStatus must be used within StatusProvider");
  }

  return ctx;
}

export function StatusPortal() {
  const { status } = useStatus();

  if (!status.text) return null;

  return (
    <div
      className={`status-portal ${status.type}`}
      role="status"
      aria-live="polite"
    >
      {status.text}
    </div>
  );
}
