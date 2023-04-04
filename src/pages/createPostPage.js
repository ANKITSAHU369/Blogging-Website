import React, { useState, useEffect } from "react";
import { loadState, saveState } from "../utility/serializer";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import styles from "../styles/createBlog.module.css"
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export async function getServerSideProps() {
  const rootUrl = "https://blogging-website-backend.onrender.com";
  let data = [];
  const res = await axios({ url: `${rootUrl}/getUsers`, method: "get" });
  data = res.data;
  return {
    props: { data },
  };
}

const CreatePostPage = ({ data }) => {
  const [user, setUser] = useState(null);
  const [blogContent, setBlogContent] = useState("");
  const [blogTitle, setBlogTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const rootUrl = "https://blogging-website-backend.onrender.com";

  useEffect(() => {
    const user = loadState("user");
    setUser(user);
    if (!user?.isLoggedIn) {
      router.push("/");
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  if (loading) {
    return <>Loading....</>;
  }

  const handlePostBlog = (e) => {
    e.preventDefault();
    const currDate = new Date();
    const newBlog = {
      blogId: currDate.getTime(),
      title: blogTitle,
      content: blogContent,
      userName: user.userName,
      postTimestamp: currDate,
      userId: user.id,
      comments: [],
    };

    axios({
      url: "https://blog-app-kgar.onrender.com/addBlog",
      method: "post",
      data: newBlog,
    }).then((res) => {
      console.log(res.data);
      router.push("/homePage");
      setBlogTitle("");
      setBlogContent("");
    });
  };

  return (
    <div className={styles.createBlogWrapper}>
    <form  onSubmit={(e) => handlePostBlog(e)}>
      <div className={styles.titleWrapper}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          required
          name="title"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
      </div>
      <div className={styles.postContentWrapper}>
      <ReactQuill className={styles.postContentText} theme="snow" value={blogContent} onChange={setBlogContent} />
      <button className={styles.postBtn}>Post your blog</button>
      </div>
    </form>
    </div>
  );
};

export default CreatePostPage;
