# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Light Mode Vanta Loses Connected Lines
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **GOAL**: Surface counterexamples that demonstrate `setOptions` breaks line geometry
  - **Scoped PBT Approach**: Scope the property to the concrete failing case — call `updateVantaColors(true)` on a live Vanta instance and assert the Three.js scene contains line mesh objects
  - Mock `document.getElementById('vanta-bg')` to return an element with a fake `_vanta` instance that records `setOptions` calls and exposes a `scene.children` array
  - Assert that after `updateVantaColors(true)`, `el._vanta.scene` contains line mesh objects AND `el._vanta.options.backgroundColor === 0xf0eeff` AND `el._vanta.options.color === 0x9333ea`
  - Run test on UNFIXED code (the current `setOptions` implementation in `src/main.js`)
  - **EXPECTED OUTCOME**: Test FAILS — confirms `setOptions` does not rebuild line geometry
  - Document counterexample: e.g. "After `updateVantaColors(true)`, line mesh count is 0; `setOptions` patches color values but skips geometry rebuild"
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Dark Mode and Guard Behavior Unchanged
  - **IMPORTANT**: Follow observation-first methodology — observe unfixed code behavior for non-buggy inputs first
  - Observe: `updateVantaColors(false)` on unfixed code calls `setOptions` with `color: 0x7c3aed`, `backgroundColor: 0x080810` (dark mode path works today)
  - Observe: `updateVantaColors(true)` when `el._vanta` is `undefined` returns early without throwing
  - Write property-based tests:
    - For all `isLight = false` inputs, the Vanta instance receives the correct dark-mode color values (`color: 0x7c3aed`, `backgroundColor: 0x080810`)
    - For all calls where `el` is null or `el._vanta` is undefined, the function returns early without error
    - For random sequences of `isLight = false` toggles, each call produces consistent dark-mode options
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS — confirms baseline behavior to preserve
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 3. Fix `updateVantaColors()` in `src/main.js`

  - [ ] 3.1 Replace `setOptions` with destroy-and-reinitialize
    - Remove both `el._vanta.setOptions(...)` branches (light and dark)
    - Call `el._vanta.destroy()` to tear down the existing Three.js renderer and scene
    - Reinitialize with `VANTA.NET({ el: '#vanta-bg', mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0, points: 9, maxDistance: 22, spacing: 18, showDots: true, color, backgroundColor })`
    - Assign the return value back to `el._vanta` so subsequent toggles work
    - _Bug_Condition: `isBugCondition(X)` where `X.targetMode = "light"` AND `el._vanta.setOptions` is called instead of destroy + reinitialize_
    - _Expected_Behavior: `el._vanta` is a fresh instance with line geometry present, `backgroundColor: 0xf0eeff`, `color: 0x9333ea`_
    - _Preservation: Dark mode reinitializes with `color: 0x7c3aed`, `backgroundColor: 0x080810`; early return on missing `el._vanta` unchanged; `mouseControls` and `touchControls` remain true_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Light Mode Vanta Reinitializes Scene
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 encodes the expected behavior (destroy + reinit produces line geometry)
    - Run bug condition exploration test from step 1 against the fixed code
    - **EXPECTED OUTCOME**: Test PASSES — confirms the destroy-and-reinitialize pattern rebuilds line geometry correctly
    - _Requirements: 2.1, 2.2_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Dark Mode and Guard Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2 against the fixed code
    - **EXPECTED OUTCOME**: Tests PASS — confirms dark mode, early-return guard, and interactivity options are unaffected by the fix
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Checkpoint — Ensure all tests pass
  - Run the full test suite and confirm all tests pass
  - Manually verify in the browser: toggle to light mode and confirm the Vanta NET animation shows a fully connected neural network with visible lines
  - Verify toggling back to dark mode also shows a connected network
  - Ensure no console errors during rapid light ↔ dark toggling
  - Ask the user if any questions arise
