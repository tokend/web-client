<template>
  <div class="chat">
    <div class="chat__users-wrp">
      <div class="chat__header">
        <h3>Users</h3>
      </div>
      <div class="chat__users">
        <div
          class="chat__user"
          :class="{'chat__user--active': isUserClicked }"
          @click="isUserClicked = true"
        >
          <img
            src="/static/images/guy.jpeg"
            class="chat__user-img"
          >
          <p class="chat__user-name">
            Roger Burns
          </p>
        </div>
      </div>
    </div>
    <div class="chat__messages-wrp">
      <div class="chat__header">
        <h3>Messages</h3>
      </div>
      <div class="chat__messages">
        <div
          ref="messageDisplay"
          class="chat__message-wrp"
        >
          <div
            v-for="(item, key) in messages"
            :key="key"
            class="chat__message"
            :class="{'chat__message--my': item.isMyMessage }"
          >
            <p class="chat__message-user">
              {{ item.isMyMessage ? 'Me' : 'Roger Burns' }}
            </p>
            <p class="chat__message-text">
              <template v-if="item.isConfirmTrade">
                <button
                  @click="isTradeDrawerShown = true"
                  class="app__button-raised"
                >
                  Confirm trade
                </button>
              </template>
              <template v-else>
                {{ item.message }}
              </template>
            </p>
          </div>
        </div>

        <div class="chat__message-input-wrp">
          <input-field
            v-model="message"
            class="chat__message-input"
            placeholder="Message"
            @keypress.enter="addMessage"
          />
          <button @click="addMessage">
            <i class="mdi mdi-send chat__message-input-icon" />
          </button>
        </div>
      </div>
    </div>

    <drawer :is-shown.sync="isTradeDrawerShown">
      <template slot="heading">
        Trade with Roger Burns
      </template>
      <form
        class="app__form"
        @submit.prevent="submit"
      >
        <div class="app__table app__table--last-td-to-right">
          <table>
            <tbody>
              <tr>
                <td>
                  I send:
                </td>
                <td>
                  5,000 Linde No. 1 coins
                </td>
              </tr>
              <tr>
                <td>
                  I receive:
                </td>
                <td>
                  6,000 Euro
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <loader
          v-if="formMixin.isDisabled"
          class="advanced-step__loader" />

        <button
          v-else
          type="submit"
          class="app__button-raised advanced-step__btn"
          :disabled="formMixin.isDisabled"
        >
          Confirm trade
        </button>
      </form>
    </drawer>
  </div>
</template>

<script>
import InputField from '@/vue/fields/InputField'
import Drawer from '@/vue/common/Drawer'
import { Bus } from '@/js/helpers/event-bus'
import Loader from '@/vue/common/Loader'
import FormMixin from '@/vue/mixins/form.mixin'

export default {
  name: 'chat',
  components: {
    InputField,
    Drawer,
    Loader,
  },

  mixins: [FormMixin],

  data () {
    return {
      message: '',
      isUserClicked: false,
      messages: [],
      isTradeDrawerShown: false,
    }
  },

  methods: {
    submit () {
      this.disableForm()

      setTimeout(() => {
        this.enableForm()
        this.isTradeDrawerShown = false
        Bus.success(`The trade was successful`)
      }, 1000)
    },
    addMessage () {
      if (!this.message) return
      this.messages.push({
        message: this.message,
        isMyMessage: true,
        isConfirmTrade: false,
      })
      this.message = ''

      setTimeout(() => {
        this.messages.push({
          message: 'It\'s a good deal, I agree',
          isMyMessage: false,
          isConfirmTrade: false,
        })
        this.scrollToNewMessage()
      }, 1000)

      setTimeout(() => {
        this.messages.push({
          isMyMessage: false,
          isConfirmTrade: true,
        })
        this.scrollToNewMessage()
      }, 2000)

      setTimeout(() => {
        this.scrollToNewMessage()
      }, 2100)
    },
    scrollToNewMessage () {
      let messageDisplay = this.$refs.messageDisplay
      messageDisplay.scrollTo({
        top: messageDisplay.scrollHeight,
        left: 0,
        behavior: 'smooth',
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.chat {
  background-color: $col-block-bg;
  border-radius: 0.4rem;
  display: flex;
  height: calc(100vh - 20rem);
}

.chat__users-wrp {
  flex-basis: 20%;
  border-radius: 0.4rem 0 0;
  display: flex;
  flex-direction: column;
  border-right: 0.2rem solid $col-asset-card-header-background;
}

.chat__messages-wrp {
  display: flex;
  flex-direction: column;
  flex-basis: 80%;
  border-radius: 0 0.4rem 0 0;
  overflow: hidden;
}

.chat__header {
  background-color: $col-primary;
  width: 100%;
  color: $col-text-on-dark-bg;
  padding: 1rem;
  border-radius: inherit;
  text-align: center;
}

.chat__messages {
  padding: 1rem 2rem;
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
}

.chat__user {
  display: flex;
  padding: 1rem;
  cursor: pointer;
  align-items: center;
  border-bottom: 0.2rem solid $col-asset-card-header-background;

  &:hover,
  &--active {
    background-color: $col-tabs-hover-bg;
  }
}

.chat__user-name {
  color: $col-text-black;
  margin-left: 1rem;
  font-size: 1.6rem;
}

.chat__user-img {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.chat__message-input-wrp {
  display: flex;
  align-items: center;
}

.chat__message-input {
  margin-right: 2rem;
}

.chat__message-input-icon {
  top: 0.5rem;
  position: relative;
  font-size: 2rem;
}

.chat__message {
  background-color: $col-asset-card-header-background;
  color: $col-text-black;
  max-width: 80%;
  border-radius: 0.4rem;
  padding: 1rem;
  width: fit-content;
  margin-bottom: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;

  &--my {
    margin-left: auto;
  }
}

.chat__message-user {
  color: $col-text-secondary;
}

.chat__message-text {
  overflow: hidden;
  text-overflow: ellipsis;
  color: $col-text-black;
  margin-top: 0.5rem;
}

.chat__message-wrp {
  height: calc(100% - 6.4rem);
  overflow: scroll;
}
</style>
