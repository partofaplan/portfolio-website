# portfolio-website

Personal portfolio for Zach Perkins — projects, professional experience, and writing.

Plain HTML, CSS, and one small JavaScript file. No framework, no build step, no
dependencies to keep current. Open `index.html` and it works.

## Layout

```
index.html              the whole page
assets/css/styles.css   all styling; theme tokens live at the top
assets/js/main.js       theme, dateline, ticker, scroll-spy nav, counters, project grid
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

The page is laid out like a newspaper. Everything is in `index.html`, in the
order it renders, with each section marked by a comment banner:

| Section | What lives there |
| --- | --- |
| `MASTHEAD` | Dateline, rotating "Latest" headlines, nameplate, ears, motto |
| `FRONT PAGE` | Lead story, "By the Numbers" stat box, "Inside" index |
| `PRINCIPLES` | Editorial: four one-line principles |
| `PROJECTS` | Six stories, then a collapsed grid of eight more |
| `SANDBOX` | The nine learning repos, each as the question it answered |
| `EXPERIENCE` | Career record, then education and certifications |
| `WRITING` | Opinion: talks, workshops, essays, and standards docs |
| `CONTACT` | Email, LinkedIn, GitHub |

To add a project, copy an existing `<article class="story">` block. Rows of
stories, principles, and posts sit in a `.cols` grid, which draws the hairline
column rules itself, so items need no borders of their own.

## Theming

Colors are CSS custom properties in two blocks at the top of `styles.css`:
`:root` for light newsprint, `:root[data-theme="dark"]` for dark. Change a token
in both places and the whole page follows. `--accent` is the single editorial
red used for kickers, labels, and the active nav link.

Light is the default. An inline script in `<head>` applies a saved preference or
the OS setting before first paint, and also adds a `js` class to `<html>`.

Type is all sans-serif: Libre Franklin (a Franklin Gothic revival, the classic
newspaper sans) for the nameplate, headlines, and small caps labels, and
Source Sans 3 for body copy.

## Motion

Animated pieces: the rotating "Latest" line in the masthead, the live dateline,
scroll-reveal on most blocks, counting stat figures, the nav picking up the name
once the masthead scrolls away, and the red scroll-progress rule under the nav.

All of it is gated. Reveal states only apply when the `js` class is present, so
the page is never blank without JavaScript, and everything is disabled under
`prefers-reduced-motion: reduce`, where content renders in its final state.
