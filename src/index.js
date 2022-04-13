import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, onSnapshot, query, where, orderBy, Timestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA6VhNgXTQ6tbalrnDjvy0JxYLVAGbmLHQ",
  authDomain: "live-chat-93b96.firebaseapp.com",
  projectId: "live-chat-93b96",
  storageBucket: "live-chat-93b96.appspot.com",
  messagingSenderId: "1029286346522",
  appId: "1:1029286346522:web:8124c14899059b9bd0f6a3"
}

const appInitialize = initializeApp(firebaseConfig)
const dataBase = getFirestore()
const collectionReference = collection(dataBase, 'chats')

class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = collectionReference
    this.query = query(collectionReference, where("room", "==", this.room), orderBy('created_at'))
    this.unsub
  }
  addChat(message) {
    const chat = { message, username: this.username, room: this.room, created_at: Timestamp.fromDate(new Date()) }
    addDoc(this.chats, chat)
      .then(() => console.log('chat adicionado'))
      .catch(err => console.log(err.message))
  }
  getChats(callback) {
    this.unsub = onSnapshot(this.query, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          callback(change.doc.data())
        }
      })
    })
  }
  updateName(newUsername) {
    this.username = newUsername
  }
  updateRoom(room) {
    this.room = room;
    console.log('room updated')
    if (this.unsub) { this.unsub() }
  }
  updateQuery(newRoom) {
    this.query = query(collectionReference, where("room", "==", newRoom), orderBy('created_at'))
  }
}
// CHAT UI
class ChatUI {
  constructor(list) {
    this.list = list
  }
  render(data) {
    const when = dateFns.distanceInWordsToNow(
      data.created_at.toDate(),
      { addSuffix: true }
    ) 
    const html = `
    <li class="list-group-item">
      <span class="username">${data.username}</span>
      <span class="message">${data.message}</span>
      <div class="time">${when}</div>
    </li>
    `
    this.list.innerHTML += html
  }
}
// dom queries
const chatList = document.querySelector('.chat-list')
const newChatForm = document.querySelector('.new-chat')

// app.js
const chatUI = new ChatUI(chatList);
const chatroom = new Chatroom('general', 'Bruno');

// add a new chat
newChatForm.addEventListener('submit', e => {
  e.preventDefault()

  const message = newChatForm.message.value.trim()
  chatroom.addChat(message)
  newChatForm.reset()
})

chatroom.getChats(data => chatUI.render(data));

/*setTimeout(() => {
  const newRoom = 'gaming'
  chatroom.updateRoom(newRoom)
  chatroom.updateName('Juju')
  chatroom.updateQuery(newRoom)
  chatroom.getChats(data => console.log(data))
  chatroom.addChat('Sou um gatinha muito carinhosa') 
}, 3000);*/

