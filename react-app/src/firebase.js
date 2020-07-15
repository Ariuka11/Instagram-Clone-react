
  import firebase from 'firebase'

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCtPZYzW9Ki6L1FKbpbdHEEZhVWaf_ABBk",
    authDomain: "instagram-clone-react-2fc0e.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-2fc0e.firebaseio.com",
    projectId: "instagram-clone-react-2fc0e",
    storageBucket: "instagram-clone-react-2fc0e.appspot.com",
    messagingSenderId: "61277143939",
    appId: "1:61277143939:web:b893ec51239a2e55df2cb6",
    measurementId: "G-BX9K7DV5PK"
  })

  const db = firebaseApp.firestore()
  const auth = firebase.auth()
  const storage = firebase.storage()

  export {db , auth , storage};
