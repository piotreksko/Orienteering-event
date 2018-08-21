import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        newEntryDialog: false,
        editedIndex: -1,
        totalFee: null,
        newEntries: []
    },
    getters: {
        isDialogOpened: state => state.newEntryDialog
    },
    mutations: {
        setNewEntryDialog(state, open){
            state.newEntryDialog = open;
        },
        addEntry(state, runner){
            state.newEntries.push(runner);
        },
        editEntry(state, runner){
            Object.assign(state.newEntries[state.editedIndex], runner);
        },
        deleteEntry(state, index){
            state.newEntries.splice(index, 1);
        },
        changeEditedIndex(state, index){
            state.editedIndex = index;
        },
        updateTotalFee(state){
            if (state.newEntries.length) {
                state.totalFee = state.newEntries.reduce((total, runner) => {
                return total + runner.fee;
              }, 0);
            }
            else {
                state.totalFee = null;
            }
        }

    },
})
