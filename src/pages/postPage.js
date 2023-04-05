import { useEffect, useState } from "react";
import { loadState, saveState } from "../utility/serializer";
import { useRouter } from "next/router";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import styles from "../styles/postPage.module.css"
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import axios from "axios";

const PostPage = ({ data }) => {
  const rootUrl = "https://blogging-website-backend.onrender.com";
  const [commentData, setCommentData] = useState("");
  const [postData, setPostData] = useState(data);
  const [edit, setEdit] = useState(false);

  const user = loadState("user");

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getPosts = async () => {
    const res = await axios({
      url: `${rootUrl}/getBlog`,
      method: "get",
      params: { blogId: postData?.blogId },
    });
    setPostData(res?.data);
    setCommentData("");
  };

  useEffect(() => {
    if (!user?.isLoggedIn) {
      router.push("/");
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    saveState("user", null);
    router.push("/");
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const comment = {
      commentedById: user?.id,
      comment: commentData,
      commentedByName: user?.userName,
      commentedOn: new Date(),
    };
    let currentBlog = postData;
    currentBlog.comments.push(comment);
    await axios({
      url: `${rootUrl}/updateBlog`,
      method: "put",
      data: currentBlog,
    }).then(() => getPosts());
  };

  if (loading) {
    return <>Loading....</>;
  }

  const handleDelete = async () => {
    await axios({
      url: `${rootUrl}/deleteBlog`,
      method: "delete",
      params: { blogId: postData?.blogId },
    }).then(() => router.push("/homePage"));
  };

  const handlePostBlog = async (e) => {
    e.preventDefault();
    await axios({
      url: `${rootUrl}/updateBlog`,
      method: "put",
      data: postData,
    }).then(() => {
      setEdit(false);
      getPosts();
    });
  };

  return (
    <div className={styles.postPage}>
      {edit ? (
        <form onSubmit={(e) => handlePostBlog(e)}>
          <div className={styles.titleWrapper}>
            <label htmlFor="title" >TITLE</label>
            <input
              type="text"
              required
              name="title"
              value={postData?.title}
              onChange={(e) =>
                setPostData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className={styles.postContentWrapper}>
          <ReactQuill
            theme="snow"
            value={postData.content}
            onChange={(e) => setPostData((prev) => ({ ...prev, content: e }))}
            className={styles.postContentText}
          />
          </div>
          <button className={styles.updateBlogButton}>Update your blog</button>
        </form>
      ) : (
        <div>
          <div className={styles.navBar}>
          <h1>{postData?.title}</h1>
          <div >
          {(postData.userId === user.userId || user.userType === "admin") && (
            <button onClick={() => setEdit(true)}>Edit</button>
          )}
          {user.userType === "admin" && (
            <button onClick={handleDelete}>Delete</button>
          )}
          <button onClick={()=>router.push("/homePage")}>Home</button>
          <button onClick={handleLogout}>Logout</button>
          </div>
          </div>

          <div style={{ display: "flex" }}>
            <h5 style={{ margin: 0, marginRight: "10px" }}>
              {postData?.userName}
            </h5>
            <span>{postData?.postTimestamp}</span>
          </div>
          <p style={{boxShadow:"2px 2px 2px 3px rgb(63, 64, 110)"}}>
            <ReactQuill
              value={postData?.content}
              readOnly={true}
              theme={"bubble"}
            />
          </p>
          <form onSubmit={(e) => handleAddComment(e)}>
            <h4>Comments :</h4>
            <div className={styles.comment}>
            <textarea
              value={commentData}
              onChange={(e) => setCommentData(e?.target?.value)}
              placeholder=" Add Comment Here"
              style={{ resize: "none", width: "80%" ,border:"1ps solid black",
              background:"transparent",outline:"none",padding:"2px 10px"}}
            />
            <button>ADD COMMENT</button>
            </div>
          </form>
          {postData?.comments?.length ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid black",
                padding: 5,
                marginTop: "10px",
              }}
            >
              {postData?.comments?.map((comment) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid black",
                    marginBottom: 5,
                    padding: 5,
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <h5 style={{ margin: 0, marginRight: 10 }}>
                      {comment?.commentedByName}
                    </h5>
                    <span>{comment?.commentedOn}</span>
                  </div>
                  <p>{comment?.comment}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PostPage;

export async function getServerSideProps(ctx) {
  const rootUrl = "https://blogging-website-backend.onrender.com";
  let data = {};
  const res = await axios({
    url: `${rootUrl}/getBlog`,
    method: "get",
    params: ctx?.query,
  });
  data = res?.data;
  return {
    props: { data },
  };
}
