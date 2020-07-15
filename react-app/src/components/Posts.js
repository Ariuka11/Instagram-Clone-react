import React from "react"
import "./Post.css"
import earth from "../images/earth.jpg"
import Avatar from "@material-ui/core/Avatar"

function Posts({ post }) {
  return (
    <div className="post">
      <div className="post-header">
        <Avatar className="post-avatar" alt="avatar" src={post.imgUrl} />
        <h3>{post.username}</h3>
      </div>
      <img src={earth} alt="react img" className="post-image" />
      <h4 className="post-h4">
        <strong>{post.username}:</strong> {post.caption}
      </h4>
    </div>
  )
}

export default Posts
