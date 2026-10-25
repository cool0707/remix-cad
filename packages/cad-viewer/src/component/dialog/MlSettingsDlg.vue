<template>
  <ml-base-dialog
    v-model:modelValue="visible"
    :title="t('dialog.settingsDlg.title')"
    :width="460"
    show-apply
    :apply-disabled="!isDirty"
    @open="handleOpen"
    @ok="handleOk"
    @apply="handleApply"
  >
    <div class="ml-settings-dlg">
      <ml-fieldset-group :title="t('dialog.settingsDlg.operationSection')">
        <el-form label-position="top" class="ml-settings-dlg__form">
          <el-form-item :label="t('dialog.settingsDlg.operationProfile')">
            <el-radio-group
              v-model="form.operationProfile"
              class="ml-settings-dlg__profiles"
              @change="handleProfileChange"
            >
              <el-radio value="simple">
                {{ t('dialog.settingsDlg.profileSimple') }}
              </el-radio>
              <el-radio value="cad">
                {{ t('dialog.settingsDlg.profileCad') }}
              </el-radio>
            </el-radio-group>
            <div class="ml-settings-dlg__hint">
              {{
                form.operationProfile === 'simple'
                  ? t('dialog.settingsDlg.profileSimpleHint')
                  : t('dialog.settingsDlg.profileCadHint')
              }}
            </div>
          </el-form-item>
        </el-form>
        <el-checkbox v-model="replaceOnClick" class="ml-settings-dlg__check">
          {{ t('main.statusBar.setting.replaceOnClick') }}
        </el-checkbox>
        <el-checkbox
          v-model="form.continuousDraw"
          class="ml-settings-dlg__check"
          :disabled="form.operationProfile !== 'simple'"
        >
          {{ t('main.statusBar.setting.continuousDraw') }}
        </el-checkbox>
      </ml-fieldset-group>

      <ml-fieldset-group :title="t('dialog.settingsDlg.snapSection')">
        <el-checkbox
          v-model="form.osnapEnabled"
          class="ml-settings-dlg__check"
          data-testid="settings-osnap-enabled"
        >
          {{ t('main.statusBar.osnap.enabled') }}
        </el-checkbox>
        <div class="ml-settings-dlg__hint">
          {{ t('dialog.settingsDlg.snapHint') }}
        </div>
        <div class="ml-settings-dlg__grid">
          <el-checkbox
            v-for="mode in ML_OSNAP_MODES"
            :key="mode.value"
            :model-value="acdbHasOsnapMode(form.osnapModes, mode.value)"
            :disabled="!form.osnapEnabled"
            class="ml-settings-dlg__check"
            @change="toggleOsnapMode(mode.value)"
          >
            {{ mode.label(t) }}
          </el-checkbox>
        </div>
      </ml-fieldset-group>

      <ml-fieldset-group :title="t('dialog.settingsDlg.displaySection')">
        <el-form label-position="left" class="ml-settings-dlg__form">
          <el-form-item :label="t('dialog.settingsDlg.theme')">
            <el-radio-group v-model="theme" class="ml-settings-dlg__profiles">
              <el-radio value="dark">
                {{ t('dialog.settingsDlg.themeDark') }}
              </el-radio>
              <el-radio value="light">
                {{ t('dialog.settingsDlg.themeLight') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="ml-settings-dlg__grid">
          <el-checkbox
            v-for="item in displayItems"
            :key="item.key"
            v-model="form[item.key]"
            class="ml-settings-dlg__check"
          >
            {{ item.label }}
          </el-checkbox>
        </div>
        <div v-if="!form.isShowRibbon" class="ml-settings-dlg__hint">
          {{ t('dialog.settingsDlg.ribbonHiddenHint') }}
        </div>
      </ml-fieldset-group>
    </div>
  </ml-base-dialog>
</template>

<script setup lang="ts">
import {
  AcApSettingManager,
  type AcApSettings
} from '@mlightcad/cad-simple-viewer'
import {
  acdbHasOsnapMode,
  type AcDbOsnapMode,
  acdbToggleOsnapMode
} from '@mlightcad/data-model'
import {
  ElCheckbox,
  ElForm,
  ElFormItem,
  ElRadio,
  ElRadioGroup
} from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { isDark, setColorTheme, useIsMobile } from '../../composable'
import MlBaseDialog from '../common/MlBaseDialog.vue'
import MlFieldsetGroup from '../common/MlFieldsetGroup.vue'
import { ML_OSNAP_MODES } from '../statusBar/osnapModes'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const { t } = useI18n()
const { isSmallViewport } = useIsMobile()

const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

/** Settings edited here; written to {@link AcApSettingManager} on OK / Apply. */
type SettingsForm = Pick<
  AcApSettings,
  | 'operationProfile'
  | 'selectionStyle'
  | 'continuousDraw'
  | 'osnapEnabled'
  | 'osnapModes'
  | 'isShowRibbon'
  | 'isShowToolbar'
  | 'isShowCommandLine'
  | 'isShowCoordinate'
  | 'isShowLanguageSelector'
  | 'isShowEntityInfo'
  | 'isShowStats'
>

type DisplayKey = Exclude<
  keyof SettingsForm,
  | 'operationProfile'
  | 'selectionStyle'
  | 'continuousDraw'
  | 'osnapEnabled'
  | 'osnapModes'
>

const readSettings = (): SettingsForm => {
  const s = AcApSettingManager.instance.settings
  return {
    operationProfile: s.operationProfile,
    selectionStyle: s.selectionStyle,
    continuousDraw: s.continuousDraw,
    osnapEnabled: s.osnapEnabled,
    osnapModes: s.osnapModes,
    isShowRibbon: s.isShowRibbon,
    isShowToolbar: s.isShowToolbar,
    isShowCommandLine: s.isShowCommandLine,
    isShowCoordinate: s.isShowCoordinate,
    isShowLanguageSelector: s.isShowLanguageSelector,
    isShowEntityInfo: s.isShowEntityInfo,
    isShowStats: s.isShowStats
  }
}

const form = reactive<SettingsForm>(readSettings())
let saved: SettingsForm = readSettings()

/** Color theme of the drawing (COLORTHEME), not part of the settings above. */
const theme = ref<'dark' | 'light'>(isDark.value ? 'dark' : 'light')
const currentTheme = () => (isDark.value ? 'dark' : 'light')

const isDirty = computed(
  () =>
    theme.value !== currentTheme() ||
    (Object.keys(form) as (keyof SettingsForm)[]).some(
      key => form[key] !== saved[key]
    )
)

const replaceOnClick = computed({
  get: () => form.selectionStyle === 'simple',
  set: (v: boolean) => {
    form.selectionStyle = v ? 'simple' : 'cad'
  }
})

const toggleOsnapMode = (mode: AcDbOsnapMode) => {
  form.osnapModes = acdbToggleOsnapMode(form.osnapModes, mode)
}

/** The profile brings its selection style, as the status bar button does. */
const handleProfileChange = () => {
  form.selectionStyle = form.operationProfile
}

const displayItems = computed(() => {
  const items: { key: DisplayKey; label: string }[] = [
    { key: 'isShowRibbon', label: t('main.statusBar.setting.ribbon') },
    { key: 'isShowToolbar', label: t('main.statusBar.setting.toolbar') },
    { key: 'isShowCommandLine', label: t('main.statusBar.setting.commandLine') },
    { key: 'isShowCoordinate', label: t('main.statusBar.setting.coordinate') },
    {
      key: 'isShowLanguageSelector',
      label: t('main.statusBar.setting.languageSelector')
    },
    { key: 'isShowEntityInfo', label: t('main.statusBar.setting.entityInfo') },
    { key: 'isShowStats', label: t('main.statusBar.setting.stats') }
  ]
  // Phones have no desktop command line.
  return isSmallViewport.value
    ? items.filter(item => item.key !== 'isShowCommandLine')
    : items
})

const handleOpen = () => {
  saved = readSettings()
  Object.assign(form, saved)
  theme.value = currentTheme()
}

const apply = () => {
  const settings = AcApSettingManager.instance
  for (const key of Object.keys(form) as (keyof SettingsForm)[]) {
    if (form[key] !== settings.get(key)) {
      settings.set(key, form[key])
    }
  }
  if (theme.value !== currentTheme()) setColorTheme(theme.value)
  saved = readSettings()
  Object.assign(form, saved)
}

const handleApply = () => apply()
const handleOk = () => apply()
</script>

<style scoped>
.ml-settings-dlg {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ml-settings-dlg__form :deep(.el-form-item) {
  margin-bottom: 4px;
}

.ml-settings-dlg__profiles {
  display: flex;
  gap: 4px;
}

.ml-settings-dlg__hint {
  margin-top: 2px;
  font-size: var(--el-font-size-extra-small);
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}

.ml-settings-dlg__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 12px;
}

.ml-settings-dlg__check {
  display: flex;
  height: 28px;
  margin-right: 0;
}
</style>
