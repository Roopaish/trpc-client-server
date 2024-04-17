import { useState } from "react";
import "./App.css";
import { api } from "./trpc/provider";

function App() {
  const [wsData, setWSData] = useState("");
  const [name, setName] = useState("");

  const { data, isLoading, error } = api.hello.useQuery({
    name: name,
  });

  api.onHello.useSubscription(undefined, {
    onData(data) {
      setWSData(data);
    },
  });

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e?.target?.value);
        }}
      />
      <div>{isLoading ? "Loading...." : JSON.stringify(data)}</div>
      <div>{error ? error?.message : ""}</div>
      <div>WS Data: {JSON.stringify(wsData)}</div>
    </>
  );
}

export default App;
