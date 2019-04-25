export default {
  methods: {
    getter (type) {
      return this.$store.getters[`verification-general-form/${type}`]
    },
  },
}
