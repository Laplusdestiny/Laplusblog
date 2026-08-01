# Git Commit Message Guidelines

When generating or writing git commit messages in this repository, follow these instructions strictly:

## 1. Commit Message Format
All commit messages must follow the **Conventional Commits** specification:
```
<type>(<optional scope>): <description> [optional ticket/issue]

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Scope
- The scope is optional. If used, it should be a noun describing the section of the codebase affected (e.g., `auth`, `api`, `deps`, `ui`).

### Subject (First Line)
- **Language**: Must be written in **English**.
- **Imperative Mood**: Use the imperative, present tense (e.g., "add", "fix", "change" instead of "added", "fixes", "changed").
- **Case & Punctuation**: Do not capitalize the first letter of the description. Do not put a period (`.`) at the end of the subject.
- **Length**: Keep the subject line under 72 characters (ideally 50 or less).

### Ticket / Issue Association
- If there is an associated issue or ticket number (e.g., `#123`), append it to the subject or reference it in the body/footer.
  - Suffix to subject: `feat(auth): add google provider (#123)`
  - Suffix to footer: `Refs: #123` or `Closes #123`

### Body (Optional)
- Use the body to explain **what** changed and **why** (the motivation for the change), rather than *how* (the code itself shows how).
- Separate the subject from the body with a single blank line.
- Wrap the body lines at 72 characters.

### Breaking Changes
- Indicate a breaking change by placing a `!` after the type/scope (e.g., `feat(api)!: remove deprecated endpoints`) and/or by adding a `BREAKING CHANGE:` footer.

## 2. Agent / AI Instructions
When generating a commit message:
1. Examine the staged changes via `git diff --cached` (or the equivalent API/tool output).
2. Write a precise subject line representing the core change.
3. Write a body only if the changes are complex or require explanation of the context/motivation.
4. Ensure the output commit message is clean, containing only the message text itself (without markdown code block fences unless specifically requested, or output exactly the text to be committed).
