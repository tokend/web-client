<template>
  <div class="campaigns-details">
    <div class="campaigns-details__wrapper">
      <div class="app__card">
        <div class="app__card-content campaigns-details__logo">
          <img
            class="campaigns-details__logo-img"
            src="@static/images/buildings.jpg"
          >
        </div>
      </div>
      <div class="campaigns-details__info">
        <div class="campaigns-details__form app__card">
          <div class="app__card-header">
            <div class="campaigns-details__name">
              {{ campaign.name }}
            </div>
          </div>
          <div class="app__card-content campaigns-details__form-card-content">
            <div class="campaigns-details__progress_lbls">
              <div class="campaigns-details__progress_lbls-left">
                {{ 'campaigns-details.progress-text-left' | globalize }}
              </div>
              <div class="campaigns-details__progress_lbls-right">
                {{ 'campaigns-details.progress-text-right' | globalize }}
              </div>
            </div>
            <div class="campaigns-details__progress">
              <div class="campaigns-details__progress-wrapper">
                <div class="campaigns-details__progress-left-value">
                  €{{ campaign.invested | formatMoney }}
                </div>
                <div
                  class="campaigns-details__progress-thumb"
                  :style="{
                    'width': `${percentage}%`,
                  }"
                />
                <div class="campaigns-details__progress-right-value">
                  €{{ campaign.raisingAmount | formatMoney }}
                </div>
              </div>
            </div>
          </div>
          <div class="app__card-actions">
            <template v-if="isPending">
              <loader />
            </template>
            <template v-else-if="isFinished">
              <div class="campaigns-details__finish">
                <div class="campaigns-details__finish-txt">
                  {{ 'campaigns-details.finish-msg' | globalize }}
                </div>
                <div class="campaigns-details__finish-date">
                  {{ Date.now() | formatDateDMYT }}
                </div>
              </div>
            </template>
            <template v-else>
              <button
                class="
              app__button-raised
              campaigns-details__end-btn
            "
                @click="endCampaign"
              >
                {{ 'campaigns-details.end-btn' | globalize }}
              </button>
            </template>
          </div>
        </div>
        <div class="campaigns-details__description app__card">
          <div class="app__card-content">
            {{ campaign.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CampaignRecord } from '@/js/records/entities/campaign.record'
import { Document } from '@tokend/js-sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { sleep } from '@/js/helpers/sleep-helper'
import Loader from '@/vue/common/Loader'

export default {
  name: 'campaigns-details',
  components: { Loader },
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      isPending: false,
      isFinished: false,
      campaign: new CampaignRecord(),
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    percentage () {
      return this.campaign.invested / this.campaign.raisingAmount * 100
    },
  },
  async created () {
    await this.loadCampaign()
  },
  methods: {
    async loadCampaign () {
      this.isLoaded = false
      this.isLoadFailed = false
      try {
        this.campaign = new CampaignRecord({
          name: 'Opus by Zaha Hadid Architects',
          description: 'Home to the new ME Dubai hotel, the Opus is located in the Burj Khalifa district adjacent to Downtown Dubai and Business Bay on the Dubai Water Canal. Exploring the balance between solid and void, opaque and transparent, interior and exterior, the design was presented by Zaha Hadid in 2007 and is the only hotel in which she created both its architecture and interiors.',
          raisingAmount: 1000000,
          amountOfShapes: '123',
          logo: new Document(),
        })
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.process(error)
      }
      this.isLoaded = true
    },
    async endCampaign () {
      this.isPending = true
      try {
        this.isFinished = true
        await sleep(3000)
        Bus.success('campaigns-details.end-campaign-success')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isPending = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.campaigns-details__wrapper {
  display: grid;
  grid-template-columns: 0.7fr 1fr;
  grid-gap: 3rem;
}

.campaigns-details__logo {
  display: flex;
  width: 100%;
  height: 100%;
}

.campaigns-details__logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.campaigns-details__info {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
}

.campaigns-details__form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.campaigns-details__name {
  font-size: 3.5rem;
  font-weight: 600;
}

.campaigns-details__description {
  font-size: 1.6rem;
  line-height: 140%;
  margin-top: 2rem;
  color: $col-campaigns-details-description;
}

.campaigns-details__form-card-content {
  width: 100%;
}

.campaigns-details__progress-wrapper {
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: 5rem;
  background: $col-campaigns-details-progressbar;
  box-shadow: $col-campaigns-details-progressbar-shadow;
  border-radius: 3rem;
}

.campaigns-details__progress-thumb {
  position: absolute;
  top: 50%;
  left: -1rem;
  transform: translateY(-50%) skew(-45deg);
  width: 70%;
  height: 100%;
  background: $col-campaigns-details-progressbar-thumb;
}

.campaigns-details__progress-left-value,
.campaigns-details__progress-right-value {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: $col-campaigns-details-progressbar-text-z-index;
  font-size: 1.6rem;
}

.campaigns-details__progress-left-value {
  left: 2rem;
  color: $col-campaigns-details-progressbar-text-left;
}

.campaigns-details__progress-right-value {
  right: 2rem;
  color: $col-campaigns-details-progressbar-text-right;
}

.campaigns-details__finish {
  display: flex;
  align-items: center;
  color: $col-campaigns-details-success;
  font-size: 1.6rem;
}

.campaigns-details__finish-txt {
  margin-right: 1rem;
}

.campaigns-details__progress_lbls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
</style>
