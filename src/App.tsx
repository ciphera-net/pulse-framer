import { framer, useIsAllowedTo, type CustomCode } from "@framer/plugin"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import type React from "react"
import "./App.css"
import {
  DASHBOARD_URL,
  LOCATION,
  buildCustomCode,
  findPulseInstall,
  hostnameFromPublishUrl,
  isValidDomain,
  normalizeDomain,
  stripPulse,
  withPulse,
} from "./pulse"

// Framer sizes the window from showUI, not from the content, so the panel
// measures itself and asks for exactly what it renders — no per-state table to
// keep in step with the copy (the first build over-asked by ~35px).
function useFittedHeight<T extends HTMLElement>(): React.RefObject<T> {
  const ref = useRef<T>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let last = 0
    const fit = () => {
      const h = Math.ceil(el.getBoundingClientRect().height)
      if (h > 0 && h !== last) {
        last = h
        void framer.showUI({ position: "top right", width: 240, height: h, resizable: false })
      }
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return ref
}

function useCustomCode(): CustomCode | null {
  const [code, setCode] = useState<CustomCode | null>(null)
  useEffect(() => {
    let live = true
    framer.getCustomCode().then((c) => live && setCode(c))
    const unsubscribe = framer.subscribeToCustomCode((c) => live && setCode(c))
    return () => {
      live = false
      unsubscribe()
    }
  }, [])
  return code
}

function usePublishedHost(): string | null {
  const [host, setHost] = useState<string | null>(null)
  useEffect(() => {
    framer
      .getPublishInfo()
      .then((info) => setHost(hostnameFromPublishUrl(info.production?.url ?? info.staging?.url)))
      .catch(() => setHost(null))
  }, [])
  return host
}

export function App() {
  const code = useCustomCode()
  const publishedHost = usePublishedHost()
  const allowed = useIsAllowedTo("setCustomCode")
  const install = useMemo(() => findPulseInstall(code), [code])

  const [editing, setEditing] = useState(false)
  const [domain, setDomain] = useState("")
  const [companion, setCompanion] = useState(false)
  const [busy, setBusy] = useState(false)

  // Prefill the form once from what is installed, else from the published URL.
  useEffect(() => {
    if (install) {
      setDomain(install.domain)
      setCompanion(install.companion)
    } else if (publishedHost && !domain) {
      setDomain(publishedHost)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [install?.domain, install?.companion, publishedHost])

  const state: "loading" | "form" | "installed" | "disabled" =
    code === null ? "loading" : install && !editing ? (install.disabled ? "disabled" : "installed") : "form"

  // One <main> element for every state so the size observer never re-mounts.
  const mainRef = useFittedHeight<HTMLElement>()

  const write = useCallback(
    async (nextDomain: string | null, nextCompanion: boolean) => {
      if (!code) return
      setBusy(true)
      try {
        const location = install?.location ?? LOCATION
        const existing = code[location]?.html
        const html = nextDomain ? withPulse(existing, buildCustomCode(nextDomain, nextCompanion)) : stripPulse(existing)
        await framer.setCustomCode({ html, location })
        framer.notify(nextDomain ? `Pulse is tracking ${nextDomain}` : "Pulse removed from this site", {
          variant: "success",
        })
        setEditing(false)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        framer.notify(`Couldn't update custom code: ${message}`, { variant: "error" })
      } finally {
        setBusy(false)
      }
    },
    [code, install?.location],
  )

  // The window's ··· menu: actions that would clutter a 240px panel.
  useEffect(() => {
    const open = { label: "Open Pulse dashboard", onAction: () => window.open(DASHBOARD_URL, "_blank", "noopener") }
    if (!install) {
      void framer.setMenu([open])
      return
    }
    void framer.setMenu([
      open,
      { label: "Change domain", onAction: () => setEditing(true), enabled: allowed },
      { type: "separator" },
      { label: "Remove Pulse", onAction: () => void write(null, false), enabled: allowed },
    ])
  }, [install, allowed, write])

  if (state === "loading") {
    return (
      <main ref={mainRef} data-version={__PLUGIN_VERSION__}>
        <div className="framer-spinner" aria-label="Loading" />
      </main>
    )
  }

  if (state === "disabled" && install) {
    return (
      <main ref={mainRef} data-version={__PLUGIN_VERSION__}>
        <div className="card">
          <div className="status">
            <i className="dot warn" />
            <div>
              <b>Turned off in Framer</b>
              <small>Someone disabled the Pulse snippet in Site Settings → Custom Code. Re-enable it there; a plugin can't.</small>
            </div>
          </div>
        </div>
        <a className="link" href={DASHBOARD_URL} target="_blank" rel="noopener">
          Open dashboard ↗
        </a>
      </main>
    )
  }

  if (state === "installed" && install) {
    return (
      <main ref={mainRef} data-version={__PLUGIN_VERSION__}>
        <div className="card">
          <div className="status">
            <i className="dot ok" />
            <div>
              <b>Active on {install.domain}</b>
              <small>Tag added at {locationLabel(install.location)}</small>
            </div>
          </div>
          <hr />
          <label className="row">
            <span>Clicks, copies, forms</span>
            <input
              type="checkbox"
              checked={install.companion}
              disabled={!allowed || busy}
              onChange={(e) => void write(install.domain, e.target.checked)}
            />
          </label>
        </div>
        <a className="link" href={DASHBOARD_URL} target="_blank" rel="noopener">
          Open dashboard ↗
        </a>
      </main>
    )
  }

  const normalized = normalizeDomain(domain)
  const valid = isValidDomain(normalized)
  return (
    <main ref={mainRef} data-version={__PLUGIN_VERSION__}>
      <label className="field">
        Site domain
        <input
          type="text"
          value={domain}
          placeholder="example.com"
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => setDomain(e.target.value)}
        />
      </label>
      <label className="check">
        <input type="checkbox" checked={companion} onChange={(e) => setCompanion(e.target.checked)} />
        Also track clicks, copies and form submits
      </label>
      <button
        className="framer-button-primary"
        disabled={!allowed || !valid || busy}
        onClick={() => void write(normalized, companion)}
      >
        {install ? "Save" : "Install Pulse"}
      </button>
      {editing && install && (
        <button onClick={() => setEditing(false)} disabled={busy}>
          Cancel
        </button>
      )}
      {!allowed ? (
        <p className="error">
          Your Framer role or plan doesn't allow custom code. Ask a site editor, or paste the tag in Site Settings → Custom
          Code.
        </p>
      ) : (
        <p className="hint">No account details needed here. The domain must match a site in your Pulse dashboard.</p>
      )}
    </main>
  )
}

function locationLabel(location: string): string {
  switch (location) {
    case "headStart":
      return "start of head"
    case "headEnd":
      return "end of head"
    case "bodyStart":
      return "start of body"
    default:
      return "end of body"
  }
}
