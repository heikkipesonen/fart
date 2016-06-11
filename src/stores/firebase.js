/* eslint-disable */
import Firebase from 'firebase'

const CONFIG = {
  apiKey: 'AIzaSyCls0sh2cO_7Le6R2RcxcUkHCE32SIaLTA',
  authDomain: 'project-1923338296558972405.firebaseapp.com',
  databaseURL: 'https://project-1923338296558972405.firebaseio.com',
  storageBucket: 'project-1923338296558972405.appspot.com'
}

Firebase.initializeApp(CONFIG)
let firebase = Firebase.database()
/* eslint-enable */

export default firebase.ref()
