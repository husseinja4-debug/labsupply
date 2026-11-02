# Screenshot loop (visual check)

Code that *works* can still *look* wrong. After building or changing anything visual,
**look at it**. Don't guess.

## Every visual task, in order

1. Check `plan.md` and `.claude/rules/11-design-method.md` — reference first, layout in
   grayscale, then type, then color, then polish.
2. Use only the spacing scale, the type scale and the colors the brand guide defines.
3. Build it.
4. Run the loop below.
5. Check the console for errors, and check hover and focus states.
6. Show me the final screenshots, explain in simple words what you did, and update
   `progress.md`.

## The loop

1. **Build** the section.
2. **Screenshot** it in the browser at two sizes:
   - Phone: **375px** wide
   - Desktop: **1440px** wide
3. **Compare** the screenshot to the reference or design goal. Write down every difference
   as a specific list. Say "the button is 20px too close to the edge", not "it looks off".
4. **Fix** the differences.
5. **Repeat** steps 2–4 until nothing important is left (usually 2–3 rounds; stop after 5
   and ask me).
6. **Show me** the final screenshots before calling the step done.

## Rules

- Do the screenshot loop **before** saying a visual task is done.
- Check hover and focus states too, not just the default view.
- Check the console for errors at the same time.
- If a fix breaks something else, compare the old and new screenshots to find what
  changed.
- Screenshots are temporary. Don't save them in the project folder.

## Tools

- **Claude Code:** use the browser tool (Claude in Chrome, the built-in browser, or
  Playwright MCP) to open the page, resize it, and take screenshots.
- **By hand:** open the page in Chrome, press F12, then Ctrl+Shift+M to switch to a
  phone-size view.
