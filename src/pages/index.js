import { useEffect, useState } from "react";
import { getUsers } from "../utility/users";
import { saveState, loadState } from "../utility/serializer";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../styles/login.module.css";

export default function Home({ data }) {
  const [loading, setLoading] = useState(true);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = loadState("user");
    if (user?.isLoggedIn) {
      router.push("/homePage");
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    const user = data?.find((user) => user.email === loginId);
    if (user) {
      if (user?.password === password) {
        saveState("user", {
          userId: user.userId,
          userType: user.userType,
          userName: user.userName,
          isLoggedIn: true,
        });
        router.push("/homePage");
      } else {
        alert("Incorrect password");
      }
    } else {
      alert("User not found!");
    }
  };

  if (loading) {
    return <>Loading....</>;
  }

  return (
    <form
    className={styles.redBackground}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <div className={styles.loginWrapper}>
      <h4 className={styles.loginId}>Login Id:</h4>
      <input
        className={styles.loginIdInput}
        type="email"
        onChange={(e) => setLoginId(e?.target?.value)}
        placeholder="Enter your email id"
        required
      />
      <h4>Password:</h4>
      <input
        type="Password"
        onChange={(e) => setPassword(e?.target?.value)}
        placeholder="Enter your password"
        required
      />
      <button type="submit">LOGIN</button>
      </div>
    </form>
  );
}

export async function getServerSideProps() {
  const rootUrl = "https://blog-app-kgar.onrender.com";
  let data = [];
  const res = await axios({ url: `${rootUrl}/getUsers`, method: "get" });
  data = res.data;
  console.log(data);
  return {
    props: { data },
  };
}
