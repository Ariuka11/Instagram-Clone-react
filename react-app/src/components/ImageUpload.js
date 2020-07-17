import React, { useState } from "react"
import { Button } from "@material-ui/core"
import { storage, db } from "../firebase"
import firebase from "firebase"
import "./ImageUpload.css"
import LinearProgress from "@material-ui/core/LinearProgress"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/core/styles"

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
})

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState(null)
  const [progress, setProgress] = useState(0)
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },
      (err) => {
        console.log(err)
        alert(err.message)
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgUrl: url,
              username: username,
            })
            setProgress(0)
            setCaption("")
            setImage(null)
          })
      }
    )
  }
  const classes = useStyles()
  return (
    <div className="imageupload">
      {caption && (
        <div className={classes.root}>
          {" "}
          <LinearProgressWithLabel value={progress} />
        </div>
      )}
      <TextField
        id="standart-basic"
        label="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <label className="fileContainer" for="Upload">
        Add photo
        <input
          type="file"
          onChange={handleChange}
          className="custom-file-input"
          placeholder="Add Picture"
        />
      </label>
      <Button onClick={image ? handleUpload : null}>Upload</Button>
    </div>
  )
}

export default ImageUpload
