<template>
  <div class="deposit-fiat-module">
    <tabs>
      <template v-if="getModule().canRenderSubmodule(DepositFiatCardModule)">
        <tab
          :name="'deposit-fiat-module.tab-card-lbl' | globalize"
          id="deposit-fiat-card-tab"
        >
          <submodule-importer
            :submodule="getModule().getSubmodule(DepositFiatCardModule)"
            :config="config"
            @deposited="deposited"
          />
        </tab>
      </template>

      <template v-if="getModule().canRenderSubmodule(DepositFiatBankModule)">
        <tab
          :name="'deposit-fiat-module.tab-bank-lbl' | globalize"
          id="deposit-fiat-bank-tab"
        >
          <submodule-importer
            :submodule="getModule().getSubmodule(DepositFiatBankModule)"
            @deposited="deposited"
          />
        </tab>
      </template>
    </tabs>
  </div>
</template>

<script>
import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'

import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { DepositFiatBankModule } from '@modules/deposit-fiat-bank/module'
import { DepositFiatCardModule } from '@modules/deposit-fiat-card/module'

const EVENTS = {
  deposited: 'deposited',
}

export default {
  name: 'deposit-fiat-module',
  components: {
    Tabs,
    Tab,
    SubmoduleImporter,
  },
  props: {
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     * @property config.decimalPoints - count of allowed decimal points
     * @property config.minAmount - minimal allowed amount
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      DepositFiatBankModule,
      DepositFiatCardModule,
    }
  },
  methods: {
    deposited () {
      this.$emit(EVENTS.deposited)
    },
  },
}
</script>

<style lang="scss">
</style>
