import React, { useState, useEffect } from "react"
import "./Post.css"
import Avatar from "@material-ui/core/Avatar"
import { db } from "../firebase"
import firebase from "firebase"
import IconButton from "@material-ui/core/IconButton"
import SendOutlinedIcon from "@material-ui/icons/SendOutlined"
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import FavoriteIcon from "@material-ui/icons/Favorite"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder"
import { Button } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"

const ColorButton = withStyles(() => ({
  root: {
    color: "rgba(var(--d69,0,149,246),1)",
    fontSize: "14px",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    fontWeight: 600,
    textTransform: "none",
  },
}))(Button)
function Posts({ post, postId, user }) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState()
  const [like, setLike] = useState(post.likes)
  const [clicked, setClicked] = useState(false)
  const [openComment, setOpenComment] = useState(false)
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

  const addLikes = (e) => {
    setLike(like + 1)

    db.collection("posts").doc(postId).update({
      likes: like,
    })
    setClicked(true)
  }

  const removeLikes = (e) => {
    setLike(like - 1)
    db.collection("posts").doc(postId).update({
      likes: like,
    })
    setClicked(false)
  }

  return (
    <div className="post">
      <div className="post-header">
        <div className="avatar-h4">
          <Avatar className="post-avatar" alt="avatar" src="" />
          <h4>{post.username}</h4>
        </div>
        <IconButton>
          <MoreHorizIcon style={{ color: "black" }} />
        </IconButton>
      </div>
      <img src={post.imgUrl} alt="react img" className="post-image" />
      <div className="post-icons">
        <div className="first-three">
          {clicked ? (
            <IconButton onClick={removeLikes}>
              <FavoriteIcon style={{ color: "red", fontSize: "30px" }} />
            </IconButton>
          ) : (
            <IconButton onClick={addLikes}>
              <FavoriteBorderIcon
                style={{ color: "black", fontSize: "30px" }}
              />
            </IconButton>
          )}
          <IconButton onClick = {() => setOpenComment(!openComment)}>
            <ChatBubbleOutlineOutlinedIcon
              style={{ color: "black", fontSize: "30px" }}
            />
          </IconButton>
          <IconButton>
            <SendOutlinedIcon style={{ color: "black", fontSize: "30px" }} />
          </IconButton>
        </div>
        <div>
          <IconButton>
            <BookmarkBorderIcon style={{ color: "black", fontSize: "30px" }} />
          </IconButton>
        </div>
      </div>

      {post.likes > 0 ? <p className="likes">{like} likes</p> : ""}
      <div className="post-caption">
        <p className="post-username">{post.username}</p>
        <p>{post.caption}</p>
      </div>

      {comments.map((comment) => (
        <div className="post-comment" key={post.like}>
          <p className="comment-username" >
            {comment.username}
          </p>
          <p >{comment.text}</p>
        </div>
      ))}
      <p className="comment-time">15 HOURS AGO</p>
      {user, openComment &&  (
        <form className="post-commentbox">
          <input
            className="post-input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <ColorButton
            className="post-button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
            size="small"
          >
            Post
          </ColorButton>
        </form>
      )}
    </div>
  )
}

export default Posts
