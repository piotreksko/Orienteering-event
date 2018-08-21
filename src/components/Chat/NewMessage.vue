<template>
  <div class="new-message">
    <v-form class="mx-3" full-width @keyup.enter.native="addMessage">
      <v-text-field class="my-3" v-model="newMessage" single-line label="New message" prepend-icon="send" :prepend-icon-cb="addMessage">
      </v-text-field>
    </v-form>
  </div>
</template>

<script>
import db from "@/firebase/init";

export default {
  name: "NewMessage",
  props: ["name"],
  data() {
    return {
      newMessage: null,
      feedback: null
    };
  },
  methods: {
    addMessage() {
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      if (this.newMessage) {
        db
          .collection("messages")
          .add({
            content: this.newMessage,
            name: this.name,
            timestamp: Date.now()
          })
          .catch(err => console.log(err));
        this.newMessage = null;
        this.feedback = null;
      } 
    }
  }
};
</script>

<style>
.new-message {
  width: 100%;
}
</style>
