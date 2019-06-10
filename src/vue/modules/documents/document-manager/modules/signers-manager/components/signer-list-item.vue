<template>
  <div class="signer-list-item">
    <div class="signer-list-item__inner">
      <div class="signer-list-item__content">
        <div class="signer-list-item__avatar-wrp">
          <span class="signer-list-item__avatar-text">
            {{ email.slice(0, 1) }}
          </span>
        </div>
        <div class="signer-list-item__attributes">
          <p class="signer-list-item__email">
            {{ email }}
            <span
              class="signer-list-item__you-lbl"
              v-if="signerToManage.publicKey === signerWhoManages.publicKey">
              {{ 'document-signers-manager.you-lbl' | globalize }}
            </span>
          </p>

          <p class="signer-list-item__rule">
            <template v-if="signerToManage.isAllowedToUpdateMetadata">
              {{ 'document-signers-manager.can-update-meta-msg' | globalize }}
              <i
                class="
                  signer-list-item__rule-icon
                  signer-list-item__rule-icon--allowed
                  mdi
                  mdi-check"
              />
            </template>
            <template v-else>
              {{ 'document-signers-manager.cant-update-meta-msg' | globalize }}
              <i
                class="
                  signer-list-item__rule-icon
                  signer-list-item__rule-icon--restricted
                  mdi
                  mdi-close"
              />
            </template>
          </p>
          <p class="signer-list-item__rule">
            <template v-if="signerToManage.isAllowedToManageSigners">
              <!--eslint-disable-next-line-->
              {{ 'document-signers-manager.can-manage-signers-msg' | globalize }}
              <i
                class="
                  signer-list-item__rule-icon
                  signer-list-item__rule-icon--allowed
                  mdi
                  mdi-check"
              />
            </template>
            <template v-else>
              <!--eslint-disable-next-line-->
              {{ 'document-signers-manager.cant-manage-signers-msg' | globalize }}
              <i
                class="
                  signer-list-item__rule-icon
                  signer-list-item__rule-icon--restricted
                  mdi
                  mdi-close"
              />
            </template>
          </p>
        </div>
      </div>
      <div class="signer-list-item__actions" v-if="showActions">
        <button
          class="app__button-icon"
          @click="$emit('edit-click', signerToManage)"
        >
          <i class="signer-list-item__action-icon mdi mdi-account-edit" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import IdentityGetterMixin from '@/vue/mixins/identity-getter'

import { Signer } from '../wrappers/signer'

export default {
  name: 'signer-list-item',
  mixins: [IdentityGetterMixin],
  props: {
    signerToManage: {
      type: Signer,
      required: true,
    },
    signerWhoManages: {
      type: Signer,
      required: true,
    },
  },
  data: _ => ({
    email: '',
  }),
  computed: {
    showActions () {
      return (
        this.signerToManage.publicKey !== this.signerWhoManages.publicKey
      ) &&
      this.signerWhoManages.isAllowedToManageSigners
    },
  },
  async created () {
    this.email = await this.getEmailByAccountId(this.signerToManage.publicKey)
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

$avatar-size: 5rem;
$avatar-margin-right: 1.8rem;

.signer-list-item {
  border-radius: 0.4rem;
  padding: 1.5rem 0;
}

.signer-list-item__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.signer-list-item__content {
  display: flex;
  align-items: center;
  padding-left: $avatar-size + $avatar-margin-right;
  position: relative;
}

.signer-list-item__avatar-wrp {
  border-radius: 50%;
  background: $col-signer-list-item-avatar-bg;
  height: 5rem;
  width: 5rem;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.signer-list-item__avatar-text {
  color: $col-signer-list-item-avatar-text;
  font-size: 1.8rem;
  position: absolute;
  top: 50%;
  left: 50%;
  text-transform: uppercase;
  transform: translate(-48%, -51%);
}

.signer-list-item__email {
  font-weight: 500;
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}

.signer-list-item__you-lbl {
  color: $col-signer-list-item-rule-text;
}

.signer-list-item__rule {
  color: $col-signer-list-item-rule-text;
  font-weight: 100;
  font-size: 1.2rem;
}

.signer-list-item__action-icon {
  font-size: 2.5rem;
}

.signer-list-item__rule-icon {
  font-size: 1.4rem;
  position: relative;
  top: 0.1rem;

  &--allowed { color: $text-success-light; }
  &--restricted { color: $text-warning; }
}
</style>
