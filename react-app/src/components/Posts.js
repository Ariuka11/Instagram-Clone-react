import React, { useState, useEffect } from "react"
import "./Post.css"
import Avatar from "@material-ui/core/Avatar"
import { db } from "../firebase"
import firebase from "firebase"

function Posts({ post, postId, user }) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState()

  useEffect(() => {
    let unsubscribe
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("Comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()))
        })
    }
    return () => {
      unsubscribe()
    }
  }, [postId])

  const postComment = (e) => {
    e.preventDefault()
    db.collection("posts").doc(postId).collection("Comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setComment("")
  }

  return (
    <div className="post">
      <div className="post-header">
        <Avatar className="post-avatar" alt="avatar" src="" />
        <h3>{post.username}</h3>
      </div>
      <img src={post.imgUrl} alt="react img" className="post-image" />
      <h4 className="post-h4">
        <strong>{post.username}:</strong> {post.caption}
      </h4>
      <div className="post-comment">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong>
            {comment.text}
          </p>
        ))}
      </div>
   {user && (
      <form className="post-commentbox">
        <input
          className="post-input"
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="post-button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
   )}
    </div>
  )
}

export default Posts
