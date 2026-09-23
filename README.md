# portfolio-website

Personal portfolio for Zach Perkins — projects, professional experience, and writing.

Plain HTML, CSS, and one small JavaScript file. No framework, no build step, no
dependencies to keep current. Open `index.html` and it works.

## Layout

```
index.html              the whole page
assets/css/styles.css   all styling; theme tokens live at the top
assets/js/main.js       theme toggle, scroll-spy nav, stat counters, expandable project grid
.github/workflows/      GitHub Pages deploy
```

## Run it locally

Any static server works. With Python:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes `main` to Pages on every
push. It needs Pages enabled once, by hand:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

The site then lands at `https://partofaplan.github.io/portfolio-website/`.

For a custom domain, add a `CNAME` file at the repo root containing the domain,
and point a DNS `CNAME` record at `partofaplan.github.io`.

## Editing content

Everything is in `index.html`, in the order the page renders, with each section
marked by a comment banner:

| Section | What lives there |
| --- | --- |
| `HERO` | Name, role, one-line pitch, four animated stat tiles |
| `PRINCIPLES` | Four one-line principles, each with its own accent |
| `PROJECTS` | Six featured cards, then a collapsed grid of eight more |
| `SANDBOX SHELF` | The nine learning repos, each as the question it answered |
| `EXPERIENCE` | Timeline entries, then education and certifications |
| `WRITING` | Talks, workshops, essays, and standards docs |
| `CONTACT` | Email, LinkedIn, GitHub |

To add a project, copy an existing `<article class="card card--feature">` block.
The `data-lang` attribute on `.card__lang` picks the badge color — `go`, `helm`,
`hcl`, `ts`, `js`, `py`, `k8s`, or `misc`.

To change a principle's accent, edit the inline `--p-accent` on that
`<article class="principle">`.

## Theming

Colors are CSS custom properties in two blocks at the top of `styles.css`:
`:root` for dark, `:root[data-theme="light"]` for light. The light block uses
deliberately darker accent values so text and borders stay legible on white —
change a token in both places and the whole page follows, including the
`--grad` gradient used by the name, kickers, stat numbers, and buttons.

Dark is the default. An inline script in `<head>` applies a saved preference or
the OS setting before first paint, and also adds a `js` class to `<html>`.

## Motion

Type is Space Grotesk for display and UI, Inter for body copy, JetBrains Mono
for code and labels.

Animated pieces: drifting aurora blobs in the hero, scroll-reveal on most
blocks, counting stat tiles, and the scroll-progress bar under the nav.

All of it is gated. Reveal states only apply when the `js` class is present, so
the page is never blank without JavaScript, and everything is disabled under
`prefers-reduced-motion: reduce` — the aurora stops entirely and content
renders in its final state.
