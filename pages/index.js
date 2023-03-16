import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [kiddoInput, setKiddoInput] = useState("");
  const [request, setRequest] = useState("");
  const [changed, setChanged] = useState(true);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kiddo: kiddoInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setChanged(false);
      setResult(data.result);
      setKiddoInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/kiddo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/kiddo.png" className={styles.icon} />
        <h3>Name my kid</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="kiddo"
            placeholder="Enter a nationality, and Boy or Girl"
            value={kiddoInput}
            onChange={(e) => {
              setKiddoInput(e.target.value);
              setRequest(e.target.value);
              setChanged(true);
            }}
          />
          <input type="submit" value="Generate names" />
        </form>
        {!changed && <div className={styles.request}>Trending name for a <span className={styles.requestMain}>{request}</span>:</div>}
        {!changed && <div className={styles.result}>{result}</div>}
      </main>
    </div>
  );
}
