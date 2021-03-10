<template>
  <div
    class="form-stepper"
    :class="{ 'form-stepper--disabled': $attrs.disabled }"
  >
    <div class="form-stepper__tabs">
      <a
        v-for="step in steps"
        :key="step.number"
        class="form-stepper__tab"
        :class="{
          'form-stepper__tab--active': step.number === currentStep,
          'form-stepper__tab--disabled': step.number > currentStep
        }"
        @click="updateStep(step)"
      >
        <p
          v-if="step.number < currentStep"
          class="form-stepper__tab-icon mdi mdi-check"
        />
        <p class="form-stepper__tab-title">
          {{ step.number }}. {{ step.titleId | globalize }}
        </p>
      </a>
    </div>
    <div class="form-stepper__form">
      <slot />
    </div>
  </div>
</template>

<script>

/**
 * FormStepper component represents a wrapper for multi-step form.
 *
 * To use it you should insert your forms (steps) inside
 * form-stepper tag as a slot.
 *
 * Example of the form using form stepper:
 *
 * <form-stepper
 *   :steps="steps"
 *   :current-step.sync="currentStep"
 * >
 *   <form v-if="currentStep === steps.yourStep1.number">
 *     <input />
 *     ...
 *     <button @click="next('form.yourStep1')" />
 *   </form>
 *   ...
 *   <form v-if="currentStep === steps.yourStepN.number">
 *     ...
 *     <button @click="submit" />
 *   </form>
 * </form-stepper>
 *
 * Example of the steps prop structure:
 *
 * const steps: {
 *   yourStep1: {
 *     number: 1,
 *     titleId: 'Step 1 translation ID'
 *   },
 *   yourFinalStep: {
 *     number: 2,
 *     titleId: 'Final step translation ID'
 *   },
 * }
 *
 * Example of the function called when next button is clicked:
 *
 * function next (formPart) {
 *   if (this.isFormValid(formPart)) {
 *     this.currentStep++
 *   }
 * }
 */

const EVENTS = {
  update: 'update:currentStep',
}

export default {
  name: 'form-stepper',
  props: {
    steps: {
      type: Object,
      required: true,
    },
    currentStep: {
      type: Number,
      required: true,
    },
  },
  methods: {
    updateStep (step) {
      if (!this.$attrs.disabled && step.number < this.currentStep) {
        this.$emit(EVENTS.update, step.number)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.form-stepper__tabs {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
}

.form-stepper__tab {
  border-bottom: 0.2rem solid $col-form-stepper-tab-border;
  padding: 1rem;
  cursor: pointer;
  min-width: 12rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .form-stepper--disabled & {
    cursor: default;
    filter: grayscale(100%);
  }
}

.form-stepper__tab-title {
  font-size: 1.2rem;
  color: $col-form-stepper-text;
  text-align: center;

  .form-stepper__tab--active & {
    color: $col-form-stepper-tab-active;
    font-weight: 700;
  }
}

.form-stepper__tab-icon {
  font-size: 1rem;
  background-color: $col-form-stepper-icon-background;
  color: $col-form-stepper-icon;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  padding: 0.2rem;
  margin-right: 0.4rem;
}

.form-stepper__tab--active {
  border-color: $col-form-stepper-tab-active;
}

.form-stepper__tab--disabled {
  cursor: default;
  filter: grayscale(100%);
}

.form-stepper__form {
  margin-top: 3.2rem;
}
</style>
