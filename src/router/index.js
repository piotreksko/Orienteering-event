import Vue from "vue";
import Router from "vue-router";
import AddEntries from "@/components/AddEntry/AddEntries";
import Entries from "@/components/Entries/Entries";
import Home from "@/components/Home/Home";
import Chat from "@/components/Chat/Chat";
import ChatWelcome from "@/components/Chat/ChatWelcome";
import GettingHere from "@/components/GettingHere/GettingHere";
import Bulletin from "@/components/Bulletin/Bulletin";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/bulletin",
      name: "Bulletin",
      component: Bulletin
    },
    {
      path: "/entries",
      name: "Entries",
      component: Entries
    },
    {
      path: "/add-entries",
      name: "AddEntries",
      component: AddEntries
    },
    {
      path: "/getting-here",
      name: "GettingHere",
      component: GettingHere
    },
    {
      path: "/chat",
      name: "Chat",
      component: Chat,
      props: true,
      beforeEnter: (to, from, next) => {
        if (to.params.name) {
          next();
        } else {
          next({ name: "ChatWelcome" });
        }
      }
    },
    {
      path: "/chat-welcome",
      name: "ChatWelcome",
      component: ChatWelcome
    }
  ]
});
