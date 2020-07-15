import React, { useEffect, useState } from "react"
import "./App.css"
import Posts from "./components/Posts"
import { db } from "./firebase"

function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })))
    })
  }, [])

  return (
    <div className="app">
      <div className="app-header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQPX3Ej-uhPxVXSoJZKSJ98Th53RSsKbit3ew&usqp=CAU"
          alt="logo"
          className="logo"
        />
      </div>
      <div className="post-container">
        {posts.map(({ id, post }) => (
          <Posts post={post} key={id} id={id} />
        ))}
      </div>
    </div>
  )
}

export default App
