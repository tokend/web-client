<template>
  <div class="app__card">
    <div class="app__card-content">
      <div class="app__no-data-msg">
        <md-icon class="md-size-4x">{{ icon }}</md-icon>
        <h2>{{ title }}</h2>
        <p>{{ descr }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'not-available',
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    descr: { type: String, required: true }
  }
}
</script>
