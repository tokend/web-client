export default {
  props: {
    isDisabled: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    callGetter (type) {
      return this.$store.getters[`verification-general-form/${type}`]
    },
  },
}
