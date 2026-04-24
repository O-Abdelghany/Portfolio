# Bugfix Requirements Document

## Introduction

When the user toggles light mode on the portfolio site, the Vanta NET animated background breaks — it renders scattered, disconnected dots instead of the connected neural network animation that works correctly in dark mode. This degrades the visual experience in light mode and makes the background look broken.

The bug is triggered by calling `el._vanta.setOptions({ color, backgroundColor })` to update Vanta colors on toggle. Vanta NET does not fully re-render the scene geometry when `backgroundColor` changes significantly via `setOptions`, leaving the connecting lines absent and only the node dots visible.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the user toggles to light mode THEN the system calls `setOptions` with only `color` and `backgroundColor`, and the Vanta NET animation shows scattered, disconnected dots with no connecting lines between them.

1.2 WHEN the page loads with `lightMode: 'on'` stored in `localStorage` THEN the system calls `updateVantaColors(true)` via `setOptions`, and the Vanta NET animation shows scattered, disconnected dots instead of the connected neural network.

### Expected Behavior (Correct)

2.1 WHEN the user toggles to light mode THEN the system SHALL display the Vanta NET animation as a fully connected neural network with visible lines between nodes, using the light mode color scheme (`color: 0x9333ea`, `backgroundColor: 0xf0eeff`).

2.2 WHEN the page loads with `lightMode: 'on'` stored in `localStorage` THEN the system SHALL display the Vanta NET animation as a fully connected neural network with visible lines between nodes in the light mode color scheme.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the user is in dark mode (default) THEN the system SHALL CONTINUE TO display the Vanta NET animation as a connected neural network with `color: 0x7c3aed` and `backgroundColor: 0x080810`.

3.2 WHEN the user toggles from light mode back to dark mode THEN the system SHALL CONTINUE TO restore the fully connected Vanta NET animation with the dark mode color scheme.

3.3 WHEN the user has `prefers-reduced-motion` enabled THEN the system SHALL CONTINUE TO skip Vanta NET initialization entirely, regardless of light/dark mode state.

3.4 WHEN the user interacts with the page (scrolling, mouse movement) THEN the system SHALL CONTINUE TO respond to mouse and touch controls on the Vanta NET background in both light and dark modes.

---

## Bug Condition

**Bug Condition Function:**
```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type ThemeToggleEvent
  OUTPUT: boolean

  RETURN X.targetMode = "light"
END FUNCTION
```

**Property: Fix Checking**
```pascal
FOR ALL X WHERE isBugCondition(X) DO
  result ← updateVantaColors'(X)
  ASSERT vantaNet.hasConnectedLines = true
    AND vantaNet.backgroundColor = 0xf0eeff
    AND vantaNet.color = 0x9333ea
END FOR
```

**Property: Preservation Checking**
```pascal
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT F(X) = F'(X)
  // Dark mode Vanta NET behavior is unchanged
END FOR
```
