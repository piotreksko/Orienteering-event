<template>
    <div>
        <SubHeading :subHeading="'Chat'" />
        <v-flex class="chat-welcome" xs12 sm6 offset-sm3 py-4>
            <v-card>
                <v-card-title class="justify-center">
                    <div text-xs-center>
                        <h1 class="amber--text text--darken-2">Welcome</h1>
                        <p text-xs-center>Choose a username to enter the chat</p>
                    </div>
                </v-card-title>
                <v-container fluid class="chat-content">
                    <v-form class="mx-3" full-width @keyup.enter.native="enterChat">
                        <v-text-field class="my-3" v-model="name" single-line label="Username">
                        </v-text-field>
                        <p class="red--text" v-if="feedback">{{ feedback }}</p>
                    </v-form>
                </v-container>
                <v-card-actions class="justify-center">
                    <v-btn color="primary" @click="enterChat" dark class="mb-2">Enter</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </div>
</template>

<script>
import SubHeading from "@/components/Layout/SubHeading";

export default {
  name: "ChatWelcome",
  components: {
    SubHeading
  },
  data() {
    return {
      name: null,
      feedback: null
    };
  },
  methods: {
    enterChat() {
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      console.log("2");
      if (this.name) {
        this.$router.push({ name: "Chat", params: { name: this.name } });
      } else {
        this.feedback = "You must enter a name to join";
      }
    }
  }
};
</script>

<style >
.chat-welcome h1 {
  font-size: 3em;
  text-align: center;
}
</style>
