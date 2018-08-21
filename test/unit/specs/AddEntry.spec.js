// Import Vue and the component being tested
import Vue from 'vue'
import AddEntry from '../../../src/components/AddEntry/AddEntry.vue'
import Vuetify from 'vuetify';
import { mount } from 'vue-test-utils'

Vue.use(Vuetify);

describe('AddEntry', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(AddEntry)

  // it's also easy to check for the existence of elements
  it('has a button', () => {
    expect(wrapper.contains('btn')).toBe(true)
  })
})