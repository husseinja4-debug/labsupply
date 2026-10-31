@AGENTS.md
@../../Aboutme.md

<!-- Full rules, Website Building Best Practices, Design Method and Screenshot Loop live in AGENTS.md (loaded above). Edit them there. -->

# Claude: how to work on this project

## Execute, don't stall
- When given a plan or an instruction, **execute it. Start building right away.**
- Don't ask for permission to proceed. Make the sensible choice, say what you chose, keep going.
- Only stop to ask before deleting or replacing files, or when an instruction contradicts `plan.md`.

## Every visual task
1. Check `plan.md` and the **Design Method** in AGENTS.md: reference first, layout in grayscale, then type, then color, then polish.
2. Use only the spacing scale (4/8/12/16/24/32/48/64/96/128), the type scale, and the colors in `plan.md`.
3. Build it.
4. Run the **Screenshot Loop**: screenshot at 375px and 1440px → list specific differences → fix → repeat (stop after 5 rounds and ask).
5. Check the console for errors, and check hover and focus states.
6. Show me the final screenshots, explain what you did in simple words, and update `progress.md`.

## Never
- Call a visual task done without taking screenshots.
- Use frameworks or libraries.
- Delete or replace files without asking.
