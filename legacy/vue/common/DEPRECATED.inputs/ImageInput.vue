<template>
  <div
    class="image-input"
    :class="{ 'image-input--ready-to-drop': flags.isReadyToDrop }">
    <div
      class="image-input__image-preview"
      v-if="imageDataUrl">
      <img :src="imageDataUrl">
    </div>

    <div class="image-input__input-inner">
      <div class="image-input__text">
        <div class="title">{{ title }}</div>

        <div class="notes">
          <p
            class="image-input__note"
            v-for="(note, key) in notes"
            :key="key">
            {{ note }}
          </p>
        </div>
      </div>

      <input
        type="file"
        @change="handleImageUpload"
        accept="image/*">
    </div>
  </div>
</template>
<script>
import { FileHelper } from '../../../js/helpers/file.helper'

export default {
  name: 'image-input',

  props: {
    title: {
      type: String,
      default: 'Choose an image from your PC'
    },
    notes: {
      type: Array,
      default: () => [
        'JPEG, PNG or BMP',
        'no more than 5mb',
        'not less than 1024x576, 16:9'
      ]
    }
  },

  data () {
    return {
      imageDataUrl: null,
      flags: {
        isReadyToDrop: false
      }
    }
  },

  mounted () {
    this.attachHandlers()
  },

  methods: {
    async handleImageUpload (event) {
      const image = FileHelper.deriveFileFromChangeEvent(event)
      const dataURL = await FileHelper.readFileAsDataURL(image)
      this.imageDataUrl = dataURL
    },
    attachHandlers () {
      const holder = this.$el
      holder.ondragenter = () => { this.flags.isReadyToDrop = true }
      holder.ondrop = () => { this.flags.isReadyToDrop = false }
      holder.ondragleave = () => { this.flags.isReadyToDrop = false }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';

  .image-input {
    border: 1px dashed $col-unfocused;
    border-radius: 15px;
    transition: .2s;
    width: 100%;

    &:hover {
      border-color: $col-text-accented;
    }
  }

  .image-input__input-inner {
    height: 110px;
    position: relative;
    overflow: hidden;
    width: 100%;

    input[type="file"] {
      cursor: pointer;
      opacity: 0;
      height: 100%;
      width: 100%;
    }
  }

  .image-input__text {
    height: 100%;
    left: 0;
    position: absolute;
    text-align: center;
    top: 5px;
    width: 100%;

    .title {
      color: $col-text-accented;
      margin-bottom: 10px;
    }
  }

  .image-input__note {
    color: $col-unfocused;
    font-size: .8rem;
    line-height: 160%;
  }

  $ratio_16: 448px;
  $ratio_9: 153px;

  .image-input__image-preview {
    align-items: center;
    display: flex;
    justify-content: center;
    pointer-events: none;
    overflow: hidden;

    img {
      border-radius: 15px 15px 0 0;
      object-fit: cover;
      width: $ratio_16;
      height: $ratio_9;
      pointer-events: none;
    }
  }

  .image-input--ready-to-drop {
    cursor: copy;
    border-color: $col-text-accented;
    transform: scale(1.1);
  }

</style>
