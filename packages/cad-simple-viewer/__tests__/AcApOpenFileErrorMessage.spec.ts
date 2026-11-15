jest.mock('../src/i18n/AcApI18n', () => ({
  AcApI18n: {
    t: (key: string) => key
  }
}))

import {
  acapResolveOpenFileErrorMessage,
  acapResolveOpenFileErrorTitle,
  acapResolveOpenFileErrorToastMessage
} from '../src/util/AcApOpenFileErrorMessage'

describe('AcApOpenFileErrorMessage', () => {
  const templates: Record<string, string> = {
    'main.message.failedToOpenFileWorkerOom':
      'Failed to open "{fileName}". There was not enough memory.',
    'main.message.failedToOpenFile': 'Failed to open file "{fileName}"!',
    'main.message.failedToOpenFileToast':
      'Failed to open "{fileName}". Check the notification center for details.',
    'main.notification.title.failedToOpenFileWorkerOom': 'Insufficient Memory',
    'main.notification.title.failedToOpenFile': 'Failed to Open File'
  }

  const t = (key: string, params?: Record<string, string>) => {
    let text = templates[key] ?? key
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.split(`{${name}}`).join(value)
      }
    }
    return text
  }

  it('maps license_expired to the license-expired message key', () => {
    expect(
      acapResolveOpenFileErrorMessage(t, {
        fileName: 'demo.dwg',
        errorCode: 'license_expired'
      })
    ).toBe('main.message.failedToOpenFileLicenseExpired')
  })

  it('maps license_invalid to the license-invalid message key', () => {
    expect(
      acapResolveOpenFileErrorMessage(t, {
        fileName: 'demo.dwg',
        errorCode: 'license_invalid'
      })
    ).toBe('main.message.failedToOpenFileLicenseInvalid')
  })

  it('maps license titles', () => {
    expect(acapResolveOpenFileErrorTitle(t, 'license_expired')).toBe(
      'main.notification.title.failedToOpenFileLicenseExpired'
    )
    expect(acapResolveOpenFileErrorTitle(t, 'license_invalid')).toBe(
      'main.notification.title.failedToOpenFileLicenseInvalid'
    )
  })

  it('falls back to the generic open-file message for unknown codes', () => {
    expect(
      acapResolveOpenFileErrorMessage(t, {
        fileName: 'demo.dwg',
        errorCode: 'parse_failed'
      })
    ).toBe('Failed to open file "demo.dwg"!')
  })

  it('maps worker_oom to the out-of-memory message', () => {
    expect(
      acapResolveOpenFileErrorMessage(t, {
        fileName: 'huge.dwg',
        errorCode: 'worker_oom'
      })
    ).toBe('Failed to open "huge.dwg". There was not enough memory.')
  })

  it('maps worker_oom to the insufficient-memory title', () => {
    expect(acapResolveOpenFileErrorTitle(t, 'worker_oom')).toBe(
      'Insufficient Memory'
    )
  })

  it('uses a short toast that points to the notification center', () => {
    expect(
      acapResolveOpenFileErrorToastMessage(t, {
        fileName: 'demo.dwg',
        errorCode: 'worker_oom'
      })
    ).toBe(
      'Failed to open "demo.dwg". Check the notification center for details.'
    )
  })
})
