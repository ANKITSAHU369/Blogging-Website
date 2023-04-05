import { useEffect, useState } from "react";
import { loadState, saveState } from "../utility/serializer";
import { useRouter } from "next/router";
import "react-quill/dist/quill.snow.css";
import styles from "../styles/homepage.module.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import axios from "axios";

const HomePage = ({ blogs }) => {
  const [user, setUser] = useState(null);
  const [blogsList, setBlogsList] = useState(blogs||[])
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = loadState("user");
    setUser(user)
    if (!user?.isLoggedIn) {
      router.push("/");
    }
    setLoading(false);
  }, []);

  const handleSearch = (e) => {
    const tempBlogs = blogs?.filter((i) => i?.title?.includes(e?.target.value) || i?.content?.includes(e?.target?.value)) || blogs
    setBlogsList(tempBlogs)
  }

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

  if (loading) {
    return <>Loading....</>;
  }

  return (
    <main className={styles.redOneBackground}>
      <div className={styles.navBar}>
        <button className={styles.homeButton}>Home</button>
        {user?.userType !== "reader" && <button className={styles.createBlogButton} onClick={handleCreateBlog}>CREATE BLOG</button>}
        <input type="text" placeholder={"Search"} onChange={handleSearch}/>
        <button className={styles.logoutButton} onClick={handleLogout}>LOGOUT</button>
      </div>
      <div style={{margin:"30px"}}>
      {blogsList?.length ?
        blogsList?.map((blog, index) => (
          <div
            key={index}
            className={styles.content}
          >
            <h3 style={{padding:"0px 15px"}}>{blog.title}</h3>
            <ReactQuill value={blog.content} readOnly={true} theme={"bubble"} />
            <button className={styles.viewButton} onClick={() => handleBlogClick(blog.blogId)}>view</button>
          </div>
        ))
        :
        <span>No blogs added yet</span>
    
      }
      </div>
    </main>
  );
};

export default HomePage;

export async function getServerSideProps() {
  const rootUrl = "https://blogging-website-backend.onrender.com";
  let data = [];
  const res = await axios({ url: `${rootUrl}/getBlogs`, method: "get" });
  data = res.data;
  return {
    props: { blogs: data },
  };
}
