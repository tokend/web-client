<template>
  <span
    class="hint-wrapper"
    :class="{'hint-wrapper--decorated': decorated}">
    <span class="hint-wrapper__target">
      <slot />
    </span>

    <div class="hint-wrapper__hint-box">
      <p class="hint-wrapper__hint-text">
        {{ hint }}
      </p>
    </div>
  </span>
</template>

<script>
export default {
  props: {
    hint: { type: String, default: 'Hint me!' },
    decorated: { type: Boolean, default: true }
  }
}
</script>

<style lang="scss">
@import "@/scss/variables";

.hint-wrapper {
  position: relative;
  display: inline-block;
}

.hint-wrapper > .hint-wrapper__target {
  display: inline-block;
  cursor: help;
}

.hint-wrapper--decorated > .hint-wrapper__target {
  text-decoration: underline;
  text-decoration-style: dotted;
}

.hint-wrapper__hint-box {
  position: absolute;
  padding: 0.625rem;
  width: auto;
  background: rgba(0, 0, 0, 0.92);
  border-radius: .5 * $point;
  color: rgb(248, 248, 248);
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  transition: opacity 0.2s, bottom 0.2s;
  opacity: 1;
  bottom: calc(100% + (1.1 * #{$point}));

  &:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: .5 * $point rgba(0, 0, 0, 0.92) solid;
    border-top-color: transparent;
    border-left-color: transparent;
    position: absolute;
    left: calc(50% - (.25 * #{$point}));
    transform: translate(-50%, 50%) rotate(45deg);
  }
}

.hint-wrapper__hint-text {
  width: 22 * $point;
}

.hint-wrapper__target:not(:hover) ~ .hint-wrapper__hint-box {
  opacity: 0;
  visibility: 0;
  pointer-events: none;
  bottom: calc(100%);
}
</style>
