/* eslint-disable */
import Firebase from 'firebase'
import { CONFIG } from '../conf'

Firebase.initializeApp(CONFIG)
let firebase = Firebase.database()
/* eslint-enable */

export default firebase.ref()
