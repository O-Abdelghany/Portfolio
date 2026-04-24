# Vanta Light Mode Fix — Bugfix Design

## Overview

When the user toggles light mode, `updateVantaColors()` in `src/main.js` calls
`el._vanta.setOptions({ color, backgroundColor })`. Vanta NET's `setOptions` updates
the stored color values but does **not** trigger a full Three.js scene re-render —
the geometry for connecting lines between nodes is never recalculated, leaving only
scattered dots visible.

The fix replaces `setOptions` with a **destroy-and-reinitialize** pattern: tear down
the existing Vanta instance, then recreate it with the full options object and the new
colors. This forces Three.js to rebuild the scene geometry from scratch, restoring the
connected neural-network appearance in both light and dark modes.

Only `updateVantaColors()` in `src/main.js` needs to change.

---

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — `updateVantaColors` is
  called with `isLight = true`, causing `setOptions` to be used instead of a full
  reinitialize.
- **Property (P)**: The desired behavior when the condition holds — the Vanta NET
  animation displays a fully connected neural network with visible lines between nodes.
- **Preservation**: Existing dark-mode Vanta behavior, reduced-motion handling, and
  mouse/touch interactivity that must remain unchanged by the fix.
- **`updateVantaColors(isLight)`**: The function in `src/main.js` responsible for
  switching Vanta colors when the theme toggles.
- **`el._vanta`**: The Vanta effect instance stored on the `#vanta-bg` DOM element by
  the inline script in `index.html`.
- **`setOptions`**: Vanta's method for updating config values at runtime — does **not**
  trigger a full Three.js scene re-render.
- **destroy-and-reinitialize**: The pattern of calling `el._vanta.destroy()` followed
  by `VANTA.NET({ ...allOptions })` to force a complete scene rebuild.

---

## Bug Details

### Bug Condition

The bug manifests when `updateVantaColors(true)` is called — either via the toggle
button click or the `localStorage` restore path on page load. The `setOptions` call
updates internal color state but does not cause Three.js to recalculate the line
geometry between nodes, so the connecting lines disappear.

**Formal Specification:**
```
FUNCTION isBugCondition(X)
  INPUT: X of type ThemeToggleEvent
  OUTPUT: boolean

  RETURN X.targetMode = "light"
         AND el._vanta exists
         AND el._vanta.setOptions is called (instead of destroy + reinitialize)
END FUNCTION
```

### Examples

- User clicks the dim-toggle button to switch to light mode → Vanta shows dots only,
  no connecting lines. Expected: fully connected neural network with `color: 0x9333ea`,
  `backgroundColor: 0xf0eeff`.
- Page loads with `localStorage.lightMode = 'on'` → `updateVantaColors(true)` is
  called immediately, same broken result. Expected: connected network on first render.
- User toggles back to dark mode after being in light mode → currently works (dark
  mode `setOptions` happens to render correctly), but must continue to work after the
  fix.
- `prefers-reduced-motion` is enabled → Vanta is never initialized; `el._vanta` is
  undefined; `updateVantaColors` returns early. Must remain unchanged.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Dark mode Vanta NET animation (`color: 0x7c3aed`, `backgroundColor: 0x080810`) must
  continue to display a fully connected neural network.
- Toggling from light mode back to dark mode must restore the connected dark-mode
  animation.
- When `prefers-reduced-motion` is enabled, Vanta is never initialized and
  `updateVantaColors` must continue to exit early without error.
- Mouse controls and touch controls on the Vanta background must remain functional in
  both themes after the fix.

**Scope:**
All code paths that do NOT involve calling `updateVantaColors(true)` are completely
unaffected by this fix. This includes:
- The initial Vanta initialization in `index.html`
- Scroll-reveal, divider animations, contact form, nav, projects, chat modules
- Any keyboard or touch interactions unrelated to the theme toggle

---

## Hypothesized Root Cause

The root cause is confirmed: `VANTA.NET.setOptions` is a shallow config update — it
patches the internal options object but does not signal Three.js to rebuild scene
geometry. The connecting lines in Vanta NET are computed during initialization based on
node positions and `maxDistance`. When only colors change via `setOptions`, that
geometry computation is skipped, leaving the previously rendered (or absent) line mesh
in place.

Supporting evidence:
1. **Dark mode works** — the initial `VANTA.NET(...)` call in `index.html` always
   produces a connected network, confirming the geometry is built correctly at init time.
2. **Light mode breaks** — only the `setOptions` path is broken, not the underlying
   Three.js scene.
3. **Destroy + reinit fixes it** — recreating the instance forces the full geometry
   pipeline to run again with the new background color, restoring the lines.

---

## Correctness Properties

Property 1: Bug Condition — Light Mode Reinitializes Vanta Scene

_For any_ theme toggle event where `isBugCondition` returns true (i.e., switching to
light mode), the fixed `updateVantaColors` function SHALL destroy the existing Vanta
instance and reinitialize `VANTA.NET` with the full options object and light-mode
colors (`color: 0x9333ea`, `backgroundColor: 0xf0eeff`), resulting in a fully
connected neural-network animation with visible lines between nodes.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation — Dark Mode and Non-Toggle Behavior Unchanged

_For any_ input where `isBugCondition` does NOT hold (dark mode toggle, page load in
dark mode, reduced-motion path, mouse/touch interactions), the fixed code SHALL produce
exactly the same observable behavior as the original code, preserving the connected
dark-mode Vanta animation, the early-return on missing `el._vanta`, and all
interactivity.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

---

## Fix Implementation

### Changes Required

**File:** `src/main.js`

**Function:** `updateVantaColors(isLight)`

**Specific Changes:**

1. **Remove `setOptions` calls**: Delete both `el._vanta.setOptions(...)` branches.

2. **Add destroy step**: Call `el._vanta.destroy()` before reinitializing, to tear
   down the existing Three.js renderer and scene.

3. **Reinitialize with full options**: Call `VANTA.NET({ ...fullOptions, color,
   backgroundColor })` using the complete options object from `index.html` so the
   scene is rebuilt identically except for the color values.

4. **Store new instance**: Assign the return value back to `el._vanta` so subsequent
   toggles continue to work.

5. **Guard against missing `VANTA` global**: The existing `if (!el || !el._vanta)`
   guard is sufficient; no additional guard needed since `el._vanta` existing implies
   `VANTA.NET` was available at init time.

**Resulting implementation:**
```js
function updateVantaColors(isLight) {
  const el = document.getElementById('vanta-bg');
  if (!el || !el._vanta) return;

  const color           = isLight ? 0x9333ea : 0x7c3aed;
  const backgroundColor = isLight ? 0xf0eeff : 0x080810;

  el._vanta.destroy();
  el._vanta = VANTA.NET({
    el: '#vanta-bg',
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200,
    minWidth: 200,
    scale: 1.0,
    scaleMobile: 1.0,
    points: 9,
    maxDistance: 22,
    spacing: 18,
    showDots: true,
    color,
    backgroundColor,
  });
}
```

---

## Testing Strategy

### Validation Approach

Two-phase approach: first surface counterexamples on the **unfixed** code to confirm
the root cause, then verify the fix satisfies Property 1 and Property 2.

### Exploratory Bug Condition Checking

**Goal:** Demonstrate the bug on unfixed code and confirm that `setOptions` is the
cause (not a missing event listener or DOM timing issue).

**Test Plan:** Simulate a `ThemeToggleEvent` with `targetMode = "light"` against the
unfixed `updateVantaColors`, then inspect the Vanta instance's Three.js scene to
assert that line geometry is absent.

**Test Cases:**
1. **Toggle to light mode**: Call `updateVantaColors(true)` on a live Vanta instance
   and assert `el._vanta` has line mesh objects in its scene — will fail on unfixed
   code.
2. **localStorage restore path**: Initialize Vanta, then call `updateVantaColors(true)`
   immediately (simulating page load with `lightMode: 'on'`) — will fail on unfixed
   code.
3. **Color values set correctly**: After `setOptions`, assert `backgroundColor` is
   `0xf0eeff` — this will pass, confirming the color is stored but geometry is not
   rebuilt.

**Expected Counterexamples:**
- Line mesh count in the Three.js scene is 0 after `setOptions` with a new
  `backgroundColor`.
- Possible cause confirmed: `setOptions` does not call the internal geometry rebuild
  method.

### Fix Checking

**Goal:** Verify that for all inputs where the bug condition holds, the fixed function
produces the expected behavior.

**Pseudocode:**
```
FOR ALL X WHERE isBugCondition(X) DO
  result ← updateVantaColors_fixed(X)
  ASSERT el._vanta.scene has line mesh objects
    AND el._vanta.options.backgroundColor = 0xf0eeff
    AND el._vanta.options.color = 0x9333ea
END FOR
```

### Preservation Checking

**Goal:** Verify that for all inputs where the bug condition does NOT hold, the fixed
function produces the same result as the original.

**Pseudocode:**
```
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT updateVantaColors_original(X) = updateVantaColors_fixed(X)
END FOR
```

**Testing Approach:** Property-based testing is recommended for preservation checking
because it generates many dark-mode toggle scenarios automatically and catches edge
cases (e.g., rapid toggling, toggling with no `el._vanta` present).

**Test Cases:**
1. **Dark mode toggle preservation**: Call `updateVantaColors(false)` on fixed code and
   assert the Vanta instance is reinitialized with `color: 0x7c3aed`,
   `backgroundColor: 0x080810`, and line geometry present.
2. **Missing instance guard**: Call `updateVantaColors(true)` when `el._vanta` is
   `undefined` — must return early without throwing.
3. **Rapid toggle preservation**: Toggle light → dark → light in quick succession;
   assert each resulting instance has correct colors and line geometry.
4. **Mouse/touch controls preserved**: After fix, assert `mouseControls: true` and
   `touchControls: true` are present on the reinitialized instance.

### Unit Tests

- Test `updateVantaColors(true)` destroys the old instance and creates a new one with
  light-mode colors.
- Test `updateVantaColors(false)` destroys the old instance and creates a new one with
  dark-mode colors.
- Test early return when `el` is null or `el._vanta` is undefined.
- Test that the new instance is stored back on `el._vanta`.

### Property-Based Tests

- Generate random sequences of `isLight` boolean values and verify that after each
  call, `el._vanta` is a fresh instance with the correct color for that call.
- Generate random initial Vanta states and verify that toggling does not leave a
  destroyed (stale) instance on `el._vanta`.
- Verify that for all `isLight = false` inputs, the resulting instance options match
  the dark-mode defaults exactly.

### Integration Tests

- Full page load with `lightMode: 'on'` in `localStorage` → Vanta renders connected
  network in light mode on first paint.
- Toggle light → dark → light in the browser → each transition shows a connected
  network with correct colors.
- Verify no console errors (e.g., calling methods on a destroyed instance) during
  rapid toggling.
