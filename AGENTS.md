<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep appearance state in the shared ThemeProvider and expose useTheme and ThemeToggle for future pages; this avoids duplicating persistence and document theme handling when the main site is added.
- Persist the appearance preference in browser storage only; it is a per-browser display setting and does not require accounts or Lovable Cloud.
