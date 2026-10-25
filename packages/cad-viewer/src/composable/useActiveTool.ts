import {
  AcApDocManager,
  AcApI18n,
  AcApToolManager,
  type AcApToolState
} from '@mlightcad/cad-simple-viewer'
import { computed, onMounted, onUnmounted, ref } from 'vue'

/**
 * The tool in use on the current view (`選択`, `パン`, `線` ...) and the
 * prompt it shows, for the status bar.
 */
export function useActiveTool() {
  const label = ref('')
  const prompt = ref('')

  const apply = (state: AcApToolState) => {
    label.value = state.label
    prompt.value = state.prompt
  }

  const onChanged = (state: AcApToolState) => {
    if (state.view === AcApDocManager.instance.curView) apply(state)
  }

  // Tool names are localized when the state is read.
  const onLocaleChanged = () => {
    apply(AcApDocManager.instance.curView.toolManager.state)
  }

  onMounted(() => {
    AcApToolManager.events.changed.addEventListener(onChanged)
    AcApI18n.events.localeChanged.addEventListener(onLocaleChanged)
    onLocaleChanged()
  })
  onUnmounted(() => {
    AcApToolManager.events.changed.removeEventListener(onChanged)
    AcApI18n.events.localeChanged.removeEventListener(onLocaleChanged)
  })

  const text = computed(() =>
    prompt.value ? `${label.value}: ${prompt.value}` : label.value
  )

  return { label, prompt, text }
}
