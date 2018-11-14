import Detail from '../../../../common/Detail.Row'
import { i18n } from '../../../../../../js/i18n/index'

export default {
  components: { Detail },
  props: {
    tx: { type: Object, required: true }
  },
  data: _ => ({
    i18n
  })
}
