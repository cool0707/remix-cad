---
title: Drawing Aids
---

# Drawing Aids

Drawing aids help you more precisely locate points, directions, and objects.

## Object Snap (OSNAP)

Object snap automatically snaps to snappable positions when the cursor is near them, and displays a snap marker.

Supported snap modes:

| Mode | Marker | Description |
|---|---|---|
| EndPoint | Square | Line segment endpoint |
| MidPoint | Triangle | Line segment midpoint |
| Center | Circle | Center of a circle/arc/ellipse |
| Quadrant | Diamond | The four quadrant points of a circle |
| Nearest | Cross | The point nearest to the cursor |
| Intersection | × | Intersection of two lines |

OSNAP can be quickly toggled on the status bar; click it to open the detailed configuration panel and select which snap modes to enable.

## Orthogonal Mode (ORTHO)

When enabled, the next line is restricted to horizontal or vertical direction only. Useful for drawing axis-aligned rectangles, equilateral triangles, etc.

- Shortcut: `F8` (if supported)
- Toggle on the status bar

## Angle Snapping (POLAR)

When enabled, the direction from the previous point to the cursor snaps to multiples of the configured angle. Use the down arrow next to the status bar button to choose the snap angle: every 90°, 45°, 30°, 22.5°, 18°, 15°, 10°, or 5° (default: every 90°).

Even when angle snapping is off, holding `Shift` snaps to the same angles.

When Ortho is also on, horizontal and vertical directions are added to the snap directions.

This is what CAD software calls "polar tracking" (POLAR in AutoCAD); the angle is stored in the POLARANG system variable.

## Dynamic Input (DYN)

Displays a floating input box near the cursor. During command execution, you can type values (distances, angles, etc.) directly in the input box without operating the command line.

## Rubber Band Preview

Almost all drawing commands show a real-time temporary preview line segment ("rubber band") from "the previous point" to "the current cursor" as you move the cursor, helping you judge direction and length.
