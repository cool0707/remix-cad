/** @jest-environment jsdom */

import {
  acapAppendLinkedText,
  acapEscapeHtml,
  acapFormatMessageHtml,
  acapMarkdownLink
} from '../src/util/AcApMessageLink'

const LINK_URL = 'https://example.com/help.html'

describe('AcApMessageLink', () => {
  it('escapes HTML special characters', () => {
    expect(acapEscapeHtml(`a <b> & "c"`)).toBe('a &lt;b&gt; &amp; &quot;c&quot;')
  })

  it('builds a markdown link', () => {
    expect(acapMarkdownLink('this page', LINK_URL)).toBe(
      `[this page](${LINK_URL})`
    )
  })

  it('formats markdown links as safe HTML anchors', () => {
    const html = acapFormatMessageHtml(
      `Failed. Click [this page](${LINK_URL}) for help.`
    )
    expect(html).toBe(
      `Failed. Click <a href="${LINK_URL}" target="_blank" rel="noopener noreferrer">this page</a> for help.`
    )
  })

  it('escapes surrounding text when formatting HTML', () => {
    expect(acapFormatMessageHtml('a <b> & c')).toBe('a &lt;b&gt; &amp; c')
  })

  it('escapes quotes in href when formatting HTML', () => {
    const html = acapFormatMessageHtml(
      'Click [x](https://evil.example/"onclick="alert(1)) now.'
    )
    expect(html).toContain(
      'href="https://evil.example/&quot;onclick=&quot;alert(1"'
    )
    expect(html).not.toContain('href="https://evil.example/"onclick="')
  })

  it('appends linked text as DOM nodes', () => {
    const container = document.createElement('div')
    acapAppendLinkedText(
      container,
      `Click [this page](${LINK_URL}) now.`
    )
    expect(container.childNodes).toHaveLength(3)
    expect(container.childNodes[0].textContent).toBe('Click ')
    const anchor = container.childNodes[1] as HTMLAnchorElement
    expect(anchor.tagName).toBe('A')
    expect(anchor.href).toBe(LINK_URL)
    expect(anchor.target).toBe('_blank')
    expect(anchor.rel).toBe('noopener noreferrer')
    expect(anchor.textContent).toBe('this page')
    expect(container.childNodes[2].textContent).toBe(' now.')
  })
})
