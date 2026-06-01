``` Bash
my-player-app/
├── public/
│   ├── favicon.svg
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── router/
│   │   │   ├── index.tsx
│   │   │   ├── routes.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx
│   │   │   ├── StoreProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   ├── reset.scss
│   │   │   ├── variables.scss
│   │   │   ├── globals.scss
│   │   │   └── animations.scss
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── MainLayout.module.scss
│   │   │   ├── AuthLayout.tsx
│   │   │   └── AuthLayout.module.scss
│   │   └── config/
│   │       ├── env.ts
│   │       ├── paths.ts
│   │       └── constants.ts
│   │
│   ├── pages/
│   │   ├── tracks/
│   │   │   ├── ui/
│   │   │   │   └── TracksPage.tsx
│   │   │   └── index.ts
│   │   ├── favorites/
│   │   │   ├── ui/
│   │   │   │   └── FavoritesPage.tsx
│   │   │   └── index.ts
│   │   ├── auth/
│   │   │   ├── ui/
│   │   │   │   └── AuthPage.tsx
│   │   │   └── index.ts
│   │   ├── profile/
│   │   │   ├── ui/
│   │   │   │   └── ProfilePage.tsx
│   │   │   └── index.ts
│   │   └── not-found/
│   │       ├── ui/
│   │       │   └── NotFoundPage.tsx
│   │       └── index.ts
│   │
│   ├── widgets/
│   │   ├── sidebar/
│   │   │   ├── ui/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── SidebarNav.tsx
│   │   │   │   └── Sidebar.module.scss
│   │   │   ├── model/
│   │   │   │   └── sidebar-items.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── header/
│   │   │   ├── ui/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── HeaderSearch.tsx
│   │   │   │   ├── UserMenu.tsx
│   │   │   │   └── Header.module.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── track-table/
│   │   │   ├── ui/
│   │   │   │   ├── TrackTable.tsx
│   │   │   │   ├── TrackRow.tsx
│   │   │   │   ├── TrackTableHead.tsx
│   │   │   │   ├── TrackTableEmpty.tsx
│   │   │   │   └── TrackTable.module.scss
│   │   │   ├── model/
│   │   │   │   ├── columns.ts
│   │   │   │   └── get-row-actions.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── player-bar/
│   │   │   ├── ui/
│   │   │   │   ├── PlayerBar.tsx
│   │   │   │   ├── PlayerTrackInfo.tsx
│   │   │   │   ├── PlayerMainControls.tsx
│   │   │   │   ├── PlayerTimeline.tsx
│   │   │   │   ├── PlayerVolume.tsx
│   │   │   │   └── PlayerBar.module.scss
│   │   │   └── index.ts
│   │   │
│   │   └── tracks-toolbar/
│   │       ├── ui/
│   │       │   ├── TracksToolbar.tsx
│   │       │   ├── SortSelect.tsx
│   │       │   ├── FilterButton.tsx
│   │       │   └── TracksToolbar.module.scss
│   │       └── index.ts
│   │
│   ├── features/
│   │   ├── auth-by-token/
│   │   │   ├── ui/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── model/
│   │   │   │   ├── useLoginForm.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── types.ts
│   │   │   ├── api/
│   │   │   │   └── login.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── search-tracks/
│   │   │   ├── ui/
│   │   │   │   └── SearchTracksInput.tsx
│   │   │   ├── model/
│   │   │   │   ├── useTrackSearch.ts
│   │   │   │   └── search-store.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── filter-tracks/
│   │   │   ├── ui/
│   │   │   │   ├── FilterTracksModal.tsx
│   │   │   │   └── FilterChip.tsx
│   │   │   ├── model/
│   │   │   │   ├── filter-store.ts
│   │   │   │   └── selectors.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── sort-tracks/
│   │   │   ├── ui/
│   │   │   │   └── SortTracksSelect.tsx
│   │   │   ├── model/
│   │   │   │   └── sort-store.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── toggle-favorite/
│   │   │   ├── ui/
│   │   │   │   └── FavoriteButton.tsx
│   │   │   ├── model/
│   │   │   │   └── useToggleFavorite.ts
│   │   │   ├── api/
│   │   │   │   └── toggle-favorite.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── play-track/
│   │   │   ├── ui/
│   │   │   │   └── PlayTrackButton.tsx
│   │   │   ├── model/
│   │   │   │   └── usePlayTrack.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── player-controls/
│   │   │   ├── ui/
│   │   │   │   ├── PlayPauseButton.tsx
│   │   │   │   ├── NextTrackButton.tsx
│   │   │   │   ├── PrevTrackButton.tsx
│   │   │   │   ├── ShuffleButton.tsx
│   │   │   │   └── RepeatButton.tsx
│   │   │   ├── model/
│   │   │   │   └── usePlayerControls.ts
│   │   │   └── index.ts
│   │   │
│   │   └── change-volume/
│   │       ├── ui/
│   │       │   └── VolumeSlider.tsx
│   │       ├── model/
│   │       │   └── useVolume.ts
│   │       └── index.ts
│   │
│   ├── entities/
│   │   ├── track/
│   │   │   ├── ui/
│   │   │   │   ├── TrackCover.tsx
│   │   │   │   ├── TrackTitle.tsx
│   │   │   │   ├── TrackMeta.tsx
│   │   │   │   ├── TrackDuration.tsx
│   │   │   │   └── TrackDate.tsx
│   │   │   ├── model/
│   │   │   │   ├── types.ts
│   │   │   │   ├── track.store.ts
│   │   │   │   ├── selectors.ts
│   │   │   │   └── mappers.ts
│   │   │   ├── api/
│   │   │   │   ├── get-tracks.ts
│   │   │   │   └── get-track-by-id.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── player/
│   │   │   ├── model/
│   │   │   │   ├── types.ts
│   │   │   │   ├── player.store.ts
│   │   │   │   ├── selectors.ts
│   │   │   │   └── useAudioEngine.ts
│   │   │   ├── lib/
│   │   │   │   ├── audio.ts
│   │   │   │   └── queue.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   │   ├── ui/
│   │   │   │   ├── UserAvatar.tsx
│   │   │   │   └── UserBadge.tsx
│   │   │   ├── model/
│   │   │   │   ├── types.ts
│   │   │   │   └── user.store.ts
│   │   │   ├── api/
│   │   │   │   └── get-me.ts
│   │   │   └── index.ts
│   │   │
│   │   └── playlist/
│   │       ├── model/
│   │       │   ├── types.ts
│   │       │   └── playlist.store.ts
│   │       ├── api/
│   │       │   └── get-playlists.ts
│   │       └── index.ts
│   │
│   ├── shared/
│   │   ├── ui/
│   │   │   ├── button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.scss
│   │   │   │   └── index.ts
│   │   │   ├── icon-button/
│   │   │   ├── input/
│   │   │   ├── modal/
│   │   │   ├── dropdown/
│   │   │   ├── avatar/
│   │   │   ├── loader/
│   │   │   ├── empty-state/
│   │   │   └── tooltip/
│   │   ├── api/
│   │   │   ├── base.ts
│   │   │   ├── client.ts
│   │   │   ├── interceptors.ts
│   │   │   └── types.ts
│   │   ├── lib/
│   │   │   ├── classnames.ts
│   │   │   ├── format-time.ts
│   │   │   ├── format-date.ts
│   │   │   ├── debounce.ts
│   │   │   ├── storage.ts
│   │   │   └── guards.ts
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useClickOutside.ts
│   │   │   ├── useEscape.ts
│   │   │   └── useBoolean.ts
│   │   ├── assets/
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   └── fonts/
│   │   ├── config/
│   │   │   └── query-keys.ts
│   │   ├── types/
│   │   │   ├── api.ts
│   │   │   └── common.ts
│   │   └── constants/
│   │       ├── routes.ts
│   │       └── ui.ts
│   │
│   ├── test/
│   │   ├── setup.ts
│   │   ├── mocks/
│   │   │   ├── handlers.ts
│   │   │   └── server.ts
│   │   └── utils/
│   │       └── render-with-providers.tsx
│   │
│   ├── types/
│   │   └── env.d.ts
│   │
│   └── vite-env.d.ts
│
├── .env
├── .env.example
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```