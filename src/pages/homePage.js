import { useEffect, useState } from "react";
import { loadState, saveState } from "../utility/serializer";
import { useRouter } from "next/router";
import "react-quill/dist/quill.snow.css";
import styles from "../styles/homepage.module.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import axios from "axios";

const HomePage = ({ blogs }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = loadState("user");
    if (!user?.isLoggedIn) {
      router.push("/");
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    saveState("user", null);
    router.push("/");
  };

  if (loading) {
    return <>Loading....</>;
  }

  const handleBlogClick = (id) => {
    saveState("currentBlogId", id);
    router.push(`/postPage?blogId=${id}`);
  };

  const handleCreateBlog = () => {
    router.push("/createPostPage");
  };

  return (
    <main className={styles.redOneBackground}>
      <div className={styles.navBar}>
      <button className={styles.homeButton}>Home</button>
      <button className={styles.logoutButton} onClick={handleLogout}>LOGOUT</button>
      <button className={styles.createBlogButton} onClick={handleCreateBlog}>CREATE BLOG</button>
      </div>
      <div style={{margin:"30px"}}>
      {blogs?.map((blog, index) => (
        <div
          key={index}
          className={styles.content}
          // onClick={() => handleBlogClick(blog.blogId)}
          // style={{ cursor: "pointer",border:"1px solid white",marginBottom:"10px" }}
          // style={{padding:"20px"}}
        >
          <h3 style={{padding:"0px 15px"}}>{blog.title}</h3>
          <ReactQuill value={blog.content} readOnly={true} theme={"bubble"} />
          <button onClick={() => handleBlogClick(blog.blogId)}>view</button>
        </div>
      ))}
      </div>
    </main>
  );
};

export default HomePage;

export async function getServerSideProps() {
  const rootUrl = "https://blog-app-kgar.onrender.com";
  let data = [];
  const res = await axios({ url: `${rootUrl}/getBlogs`, method: "get" });
  data = res.data;
  return {
    props: { blogs: data },
  };
}
