import React, { useEffect, useState } from "react"
import "./App.css"
import Posts from "./components/Posts"
import { db, auth } from "./firebase"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import { Button, Input } from "@material-ui/core"

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "30rem",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

function App() {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [user, setUser] = useState(null)
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("authUser", authUser)
        setUser(authUser)
      } else {
        setUser(null)
      }
    })
  }, [user, input.username])

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })))
    })
  }, [])

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const signUp = (e) => {
    e.preventDefault()
    auth
      .createUserWithEmailAndPassword(input.email, input.password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: input.username,
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false)
  }
  const login = (e) => {
    e.preventDefault()
    auth
      .signInWithEmailAndPassword(input.email, input.password)
      .catch((error) => alert(error.message))
    setOpenLogin(false)
  }

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={signUp} className="app-signup">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQPX3Ej-uhPxVXSoJZKSJ98Th53RSsKbit3ew&usqp=CAU"
              alt="logo"
              className="logo"
            />
            <Input
              type="text"
              placeholder="username"
              name="username"
              value={input.username}
              onChange={handleChange}
            />
            <Input
              type="text"
              placeholder="email"
              name="email"
              value={input.email}
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="password"
              name="password"
              value={input.password}
              onChange={handleChange}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={login} className="app-signup">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQPX3Ej-uhPxVXSoJZKSJ98Th53RSsKbit3ew&usqp=CAU"
              alt="logo"
              className="logo"
            />
            <Input
              type="text"
              placeholder="email"
              name="email"
              value={input.email}
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="password"
              name="password"
              value={input.password}
              onChange={handleChange}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Modal>
      <div className="app-header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQPX3Ej-uhPxVXSoJZKSJ98Th53RSsKbit3ew&usqp=CAU"
          alt="logo"
          className="logo"
        />

        {user ? (
          <div className="app-login-container">
            <Button onClick={() => auth.signOut()}>LogOut</Button>
          </div>
        ) : (
          <div className="app-login-container">
            <Button onClick={() => setOpen(true)}>SignUp</Button>
            <Button onClick={() => setOpenLogin(true)}>Login</Button>
          </div>
        )}
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
