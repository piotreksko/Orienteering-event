<template>
  <div>
    <SubHeading :subHeading="'Chat'" />
    <div class="chat-container">
      <v-layout>
        <v-flex xs12 sm8 offset-sm2 py-4>
          <v-card>
            <v-card-title>
              <div>
                <span class="title grey--text">Chat about the event with other competitors</span><br>
              </div>
            </v-card-title>
            <v-container fluid class="chat-content">
              <div class="text-xs-center">
                <v-progress-circular indeterminate v-if="isLoading" color="light-green darken-1"></v-progress-circular>
              </div>
              <ul class="messages" v-chat-scroll>
                <li v-for="message in messages" :key="message.id">
                  <span class="name amber--text text--darken-3">{{ message.name }}</span>
                  <span class="mx-2 grey-text text-darken-3">{{ message.content }}</span>
                  <span class="time grey-text time">{{ message.timestamp }}</span>
                </li>
              </ul>
            </v-container>
            <v-card-actions>
              <NewMessage :name="name" />
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import NewMessage from "./NewMessage";
import moment from "moment";
import SubHeading from "@/components/Layout/SubHeading";

export default {
  name: "Chat",
  props: ["name"],
  components: {
    NewMessage,
    SubHeading
  },
  data: () => ({
    messages: [],
    isLoading: true
  }),
  created() {
    let ref = db.collection("messages").orderBy("timestamp");

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == "added") {
          let doc = change.doc;
          this.messages.push({
            id: doc.id,
            name: doc.data().name,
            content: doc.data().content,
            timestamp: moment(doc.data().timestamp).format("lll")
          });
        }
      });
      this.isLoading = false;
    });
  }
};
</script>

<style>
.chat-content ul li span {
  font-size: 1.4rem;
}

.chat-content .time {
  display: block;
  font-size: 0.8em;
}

.messages {
  max-height: 400px;
  overflow: auto;
}

.messages::-webkit-scrollbar {
  width: 8px;
}
.messages::-webkit-scrollbar-track {
  background: #ddd;
}
.messages::-webkit-scrollbar-thumb {
  background: #aaa;
}
</style>
