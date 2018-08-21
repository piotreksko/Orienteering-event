<template>
  <v-app>
    <v-navigation-drawer persistent :clipped="clipped" v-model="drawer" disable-resize-watcher fixed app>
      <v-list>
        <v-list-tile value="true" v-for="(item, i) in items" :key="i" :to="item.path">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="toolbar" dark color="light-green darken-1" app>
      <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/"><img src="./content/orienteering-icon.png"></router-link>
      <v-toolbar-title>Harold Cup</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="/">Home</v-btn>
        <v-btn flat to="/bulletin">Bulletin</v-btn>
        <v-btn flat to="/entries">Entries</v-btn>
        <v-btn flat to="/add-entries">Add entries</v-btn>
        <v-btn flat to="/direction">Getting here</v-btn>
        <v-btn flat to="/chat">Chat</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  <Footer />
  </v-app>
</template>

<script>
import Footer from '@/components/Layout/Footer'

export default {
  components: {
    Footer
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "home",
          title: "Home",
          path: "/home"
        },
        {
          icon: "bubble_chart",
          title: "Bulletin",
          path: "/bulletin"
        },
        {
          icon: "list",
          title: "Entries",
          path: "/entries"
        },
        {
          icon: "playlist_add",
          title: "Add Entry",
          path: "/add-entry"
        },
        {
          icon: "directions",
          title: "Getting Here",
          path: "/getting-here"
        },
        {
          icon: "chat",
          title: "Chat",
          path: "/chat"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Orienteering event"
    };
  },
  name: "App"
};
</script>
<style>
body {
  font-family: "open sans", arial, helvetica, sans-serif;
}

.theme--dark.application {
  background: eff0f1 !important;
}

.toolbar img {
  height: 32px;
  width: 32px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
