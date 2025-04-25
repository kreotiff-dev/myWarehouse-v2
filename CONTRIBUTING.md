# Contributing Guidelines

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for generating the CHANGELOG and determining semantic version bumps.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory, and the **scope** of the header is optional.

### Types

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries

### Version Bumping

* **MAJOR** version when you make incompatible API changes (BREAKING CHANGE in footer or `!` after type)
* **MINOR** version when you add functionality in a backwards compatible manner (`feat` type)
* **PATCH** version when you make backwards compatible bug fixes (`fix` type)

### Examples

```
feat(api): add new endpoint for user management

This adds a new RESTful endpoint for managing users.

Refs: #123
```

```
fix(auth): correct token validation logic

The token validation was incorrectly checking expiration dates.

Fixes: #456
```

```
feat!: redesign authentication system

BREAKING CHANGE: The authentication system has been completely redesigned. 
Old authentication tokens will no longer work.
```