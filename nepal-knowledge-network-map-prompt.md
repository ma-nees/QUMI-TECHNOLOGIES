# Implementation Prompt: Interactive Nepal District Knowledge Network Map

## Objective

Implement a polished, responsive, interactive map of Nepal in the existing project, using the supplied Nepal SVG as the geographic source. The map represents **all 7 provinces and 77 districts** as a distributed community of IT professionals connected through the SDOC government IT knowledge centre.

Treat the supplied SVG as a starting asset, not as a complete working component. It contains district boundary paths, district/province metadata, network-route examples, and node coordinates, but it does **not** include the full styling, interaction logic, responsive behavior, or application integration.

## First: inspect the existing project

Before changing code:

1. Inspect the repository structure, framework, current page/component architecture, styling system, and existing design tokens.
2. Identify the correct page or section where this map belongs and how the project handles assets, routing, and responsive layouts.
3. Reuse the existing stack and conventions. Do not introduce a new framework or unnecessary dependencies.
4. Check whether the project already has the supplied SVG or a similar Nepal map. Reuse the available source rather than creating a duplicate.
5. Make a short implementation plan, then implement the feature in the appropriate files. Do not stop after giving recommendations or a mockup.

## Map concept and information architecture

The map should communicate a **two-way knowledge network**, not a centralized hierarchy:

- IT professionals across all 77 districts can connect and share expertise with one another.
- Professionals from districts and the Nepali diaspora can contribute knowledge, guidance, tools, and learning resources to SDOC.
- SDOC helps government teams access and apply that knowledge.
- Knowledge and learning should be shown flowing back to government teams.
- No single district should look like the permanent centre of the entire network.

The original SVG description explicitly says this is a **planned knowledge network, not live participation**. Do not imply that the map displays live users, real-time activity, verified membership, or actual connection counts unless the project has real data to support those claims.

## Geographic source and data integrity

Use the supplied SVG paths as the base geometry wherever possible.

- Preserve the district shapes and their geographic relationships.
- Preserve and use the existing `data-district`, `data-province`, `aria-label`, and `<title>` metadata where present.
- Ensure every district is identifiable and associated with the correct province.
- Provide a clear province-level grouping for all 7 provinces and support all 77 districts.
- Keep the map's geographic details intact. Do not replace it with a generic Nepal silhouette, a decorative approximation, or a set of unrelated dots.
- Do not invent district-level statistics, active-member counts, connections, or participation data.
- Validate district/province labels and completeness against the source data. If any source metadata is missing or inconsistent, flag it rather than silently guessing.
- Avoid manually rewriting the long SVG path data unless there is a specific technical reason.

The supplied SVG has a `viewBox` of `0 25 1240 780`, district `<path>` elements, network route paths, district-node circles, and province-node circles. Retain a suitable `viewBox` and preserve aspect ratio so the map is not distorted.

## Visual direction

Create a premium, clear, government-appropriate technology visual. It should feel deliberately designed and trustworthy, not like a generic AI-generated dashboard.

- Use the project's existing design system first.
- Favor a restrained light canvas, legible typography, subtle borders, and carefully controlled contrast.
- Render district boundaries with thin, consistent strokes. Adjacent districts must remain distinguishable.
- Use a restrained province palette or a mostly neutral map with a clear selected/hover state. Do not make every district overly saturated.
- Keep map labels and surrounding explanatory text readable.
- Use subtle depth only where it helps hierarchy. Avoid heavy shadows, excessive gradients, neon effects, decorative clutter, and gratuitous animation.
- Make the map the main visual focus without allowing it to overwhelm the surrounding content.
- Include a concise heading and supporting description that explain the network and its intended purpose.
- Add a small, accessible legend explaining district boundaries, province/grouping colors if used, peer-to-peer connections, and the SDOC knowledge-centre relationship.
- Ensure the map works in both wide desktop layouts and narrow mobile layouts.

## Interactions

### District selection

- Make each district selectable by pointer and keyboard.
- On hover, apply a subtle highlight to the district and reveal its name and province through a tooltip or equivalent accessible label.
- On click or keyboard activation, select the district and show a nearby detail panel, side panel, or compact information card.
- The district detail should include only grounded information: district name, province, and a short explanation of how the map represents participation in the network.
- If the application has a real district profile or district-specific data source, link to it using the existing routing/data conventions. Otherwise, do not fabricate a profile.
- Make the selected district visually distinct, and ensure selection can be changed or cleared.
- On mobile, do not rely on hover. Tapping a district must expose the same essential information.

### Province interaction

- Provide a usable way to understand the 7 provinces, such as a province filter, legend selection, or province-level emphasis.
- Selecting a province should highlight its districts and de-emphasize other provinces without making the rest of the map disappear.
- Keep district selection and province selection states consistent.
- If the supplied map already includes `data-province` groups, use those groups rather than building a second geometry representation.

### Knowledge-network routes

- Use the supplied route examples as **illustrative connections**, not as evidence of real activity.
- Render peer-to-peer routes as subtle curved lines between representative network nodes.
- Show the relationship between district professionals, SDOC, and government teams using a clear visual hierarchy and explanatory labels or a companion diagram.
- If animated particles are used, keep them slow, low-distraction, and limited. Respect `prefers-reduced-motion`.
- Avoid animating every district at once or creating a visually tangled web.
- Make route meaning understandable without animation, color alone, or hover.
- Do not claim that a route is active, live, or represents a real person unless supported by application data.
- The existing SVG has nine example `knowledge-route` paths and route particles. Reuse or adapt them only if they fit the intended layout and remain understandable.

## Accessibility requirements

- Provide an accessible name and description for the overall map.
- Ensure district paths are keyboard-operable, with visible focus indicators.
- Use meaningful accessible names that include the district and province.
- Use appropriate SVG semantics and avoid invalid or conflicting ARIA attributes.
- Ensure tooltip/detail information is available to keyboard and touch users, not just pointer hover.
- Do not rely on color alone to indicate selection or province membership.
- Maintain sufficient text and boundary contrast.
- Respect reduced-motion preferences.
- If the map is too complex for screen-reader users to explore efficiently, provide an accessible district list or province selector as an alternative interaction.

## Responsive behavior

- Preserve the map's aspect ratio and keep all of Nepal visible.
- Use a fluid width and an appropriate maximum width.
- On small screens, avoid shrinking the map until districts become impossible to select. Provide a controlled zoom/pan experience or a province/district list if needed.
- Keep the selected district information reachable without covering most of the map.
- Prevent horizontal page overflow and ensure touch targets and controls remain usable.
- Test at mobile, tablet, laptop, and wide-desktop sizes.

## Engineering requirements

- Build the map as a reusable component that fits the project's current architecture.
- Separate the geographic SVG/data, presentation styles, and interaction state where practical.
- Avoid duplicating the full SVG path data in multiple components.
- Prefer event delegation or a maintainable mapping strategy over 77 separate, repetitive handlers if appropriate for the framework.
- Use stable district identifiers based on the supplied metadata.
- Keep interactions efficient and avoid unnecessary component re-renders.
- Clean up any event listeners, animation frames, observers, and other resources on unmount.
- Pause or reduce animation when the map is off-screen or the document is hidden, if animation is implemented.
- Avoid adding dependencies for functionality that can be implemented cleanly with the existing stack.
- Do not break existing pages, routes, styles, or application behavior.
- Do not hard-code mock participation statistics. If a demo state is necessary, label it clearly as illustrative.
- Keep all test/demo data separate from production data and make sure it cannot be mistaken for live information.

## Suggested content

Use project-appropriate copy similar in meaning to:

**Heading:** A Nationwide Network of IT Expertise

**Description:** Professionals across Nepal's 7 provinces and 77 districts can share expertise, contribute practical knowledge, and help strengthen digital capability across government. SDOC serves as a knowledge centre connecting contributions with the needs of government teams.

**Map note:** Illustrative representation of the planned knowledge network. Connections do not indicate live users or confirmed participation.

Adjust wording to match the project's established voice. Do not add unsupported claims about membership, adoption, activity, or outcomes.

## Quality checks before completion

Verify all of the following:

- [ ] All 7 provinces and 77 districts are present and identifiable.
- [ ] District names and province assignments are sourced from the SVG/data, not invented.
- [ ] The map preserves its geometry and aspect ratio.
- [ ] District hover, click/tap, keyboard focus, selection, and deselection work.
- [ ] Province selection or filtering works and remains consistent with district selection.
- [ ] The map remains usable on mobile and does not cause horizontal overflow.
- [ ] The detail view is accessible without hover.
- [ ] Reduced-motion settings are respected.
- [ ] No fake live activity, user counts, or unverified connections are presented as facts.
- [ ] The legend and explanatory copy make the network relationships understandable.
- [ ] Existing project styles and routes remain intact.
- [ ] No console errors, broken interactions, or unnecessary dependencies are introduced.
- [ ] The project’s available lint, type-check, and build commands pass.

## Deliverables

Implement the finished map in the existing project and report:

1. Which files were created or changed.
2. How the SVG source and district/province metadata were used.
3. Which interactions are implemented.
4. Any missing source data or assumptions that still need confirmation.
5. The checks/build commands run and their results.

**Important:** Do not merely output a new SVG, a screenshot, or a visual concept. Integrate a functional, accessible, responsive map into the actual project using the existing codebase and design system.
