# Финальная структура проекта аудиоплеера

Основа проекта: `npm create vite@latest my-audio-player -- --template react-ts`.

Проект собирается на **React + TypeScript + Vite**, а стили пишутся на **SCSS**; Vite поддерживает Sass/SCSS после установки пакета `sass`: `npm install -D sass`

## Что фиксируем

- Используем **Vite + React + TypeScript** как базу проекта.
- Стили пишем на **SCSS**, включая обычные `.scss` файлы и `*.module.scss` для компонентных стилей.
- Делаем одну общую логику приложения, но для некоторых крупных блоков допускаем отдельные desktop/mobile представления.
- Не переусложняем структуру: без лишних провайдеров, тяжёлых state manager и лишних слоёв на старте.

## Почему такая структура

По макетам desktop и mobile отличаются не только шириной, но и самим представлением списка треков: на desktop это табличный вид, а на mobile карточки. Поэтому удобнее сразу разделить крупные визуальные блоки по UI-представлениям, но оставить общую страницу и общую бизнес-логику.

## Итоговая структура

```bash
my-audio-player/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  ├─ router.tsx
│  │  └─ styles/
│  │     ├─ container.scss
│  │     ├─ fonts.scss
│  │     ├─ mixins.scss
│  │     ├─ normalize.scss
│  │     ├─ reboot.scss
│  │     ├─ variables.scss
│  │     └─ visually-hidden.scss 
│  │
│  ├─ assets/
│  │  ├─ icons/
│  │  ├─ images/
│  │  └─ icons/
│  │     ├─ sprite.svg
│  │     └─ sprites/
│  │        ├─ calendar.svg
│  │        ├─ clock.svg
│  │        ├─ dots.svg
│  │        ├─ chevron-right.svg
│  │        ├─ logo.svg
│  │        ├─ music-notes.svg
│  │        ├─ play-mobile.svg
│  │        ├─ play.svg
│  │        ├─ search.svg
│  │        └─ volume.svg
│  │
│  ├─ pages/
│  │  ├─ TracksPage.tsx
│  │  ├─ FavoritesPage.tsx
│  │  ├─ LoginPage.tsx
│  │  └─ NotFoundPage.tsx
│  │
│  ├─ widgets/
│  │  ├─ Sidebar/
│  │  │  ├─ Sidebar.tsx
│  │  │  └─ Sidebar.module.scss
│  │  ├─ Header/
│  │  │  ├─ Header.tsx
│  │  │  ├─ HeaderDesktop.tsx
│  │  │  ├─ HeaderMobile.tsx
│  │  │  ├─ SearchInput.tsx
│  │  │  └─ Header.module.scss
│  │  ├─ TrackList/
│  │  │  ├─ TrackTable.tsx
│  │  │  ├─ TrackTableRow.tsx
│  │  │  ├─ TrackCardList.tsx
│  │  │  ├─ TrackCard.tsx
│  │  │  └─ TrackList.module.scss
│  │  └─ PlayerBar/
│  │     ├─ PlayerBar.tsx
│  │     ├─ PlayerBarDesktop.tsx
│  │     ├─ PlayerBarMobile.tsx
│  │     ├─ PlayerControls.tsx
│  │     ├─ PlayerProgress.tsx
│  │     ├─ VolumeControl.tsx
│  │     └─ PlayerBar.module.scss
│  │
│  ├─ features/
│  │  ├─ auth/
│  │  │  ├─ LoginForm.tsx
│  │  │  └─ model.ts
│  │  ├─ search-tracks/
│  │  │  └─ model.ts
│  │  ├─ toggle-favorite/
│  │  │  └─ model.ts
│  │  └─ player-controls/
│  │     └─ model.ts
│  │
│  ├─ fonts/
│  │  ├─ actor-regular-normal-400.woff
│  │  └─ actor-regular-normal-400.woff2
│  │
│  ├─ entities/
│  │  ├─ track/
│  │  │  ├─ types.ts
│  │  │  ├─ api.ts
│  │  │  └─ utils.ts
│  │  └─ user/
│  │     ├─ types.ts
│  │     └─ api.ts
│  │
│  ├─ shared/
│  │  ├─ ui/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Input.tsx
│  │  │  ├─ Loader.tsx
│  │  │  └─ EmptyState.tsx
│  │  ├─ lib/
│  │  │  ├─ classNames.ts
│  │  │  ├─ formatTime.ts
│  │  │  └─ formatDate.ts
│  │  └─ hooks/
│  │     └─ useMediaQuery.ts
│  │
│  ├─ api/
│  │  ├─ client.ts
│  │  └─ endpoints.ts
│  │
│  └─ vite-env.d.ts
│
├─ .env
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

## Коротко по SASS

### `container.scss`
Стили контейнера для приложения

### `fonts.scss`
Шрифты подключеные через @font-face

### `mixins.scss`
Миксины SASS

### `normalize.scss`
Файл нормальизации стилей для совместимости с разными браузерами

### `reboot.scss`
Файл базовых стилей приложения

### `variables.scss`
Переменные для SASS

### `visually-hidden.scss`
Файл содержащий технический стиль visually-hidden


## Коротко по папкам

### `src/app`
Точка входа приложения: `main.tsx`, `App.tsx`, роутинг и глобальные SCSS-стили.

### `src/pages`
Страницы уровня маршрутов: треки, избранное, логин, 404.

### `src/widgets`
Крупные части интерфейса, из которых собирается экран: сайдбар, хедер, список треков, нижний плеер.

### `src/features`
Пользовательские действия: вход, поиск, лайк трека, управление плеером.[1]

### `src/entities`
Базовые сущности проекта: `track` и `user`, их типы и простая работа с API.[1]

### `src/shared`
Переиспользуемые UI-компоненты, утилиты и простые хуки общего назначения.[1]

### `src/api`
Общий API-клиент и описание основных endpoint-ов.[1]

## Важные договорённости

- `TracksPage.tsx` остаётся одной страницей, но внутри может показывать `TrackTable` на desktop и `TrackCardList` на mobile.[1]
- `PlayerBar` и `Header` тоже могут иметь отдельные mobile/desktop представления, если это реально упрощает разметку и стили.[1]
- Глобальные стили держим в `app/styles`, а стили конкретных компонентов — рядом с компонентом в `*.module.scss`.[1][4]
- На старте не добавляем Redux, MobX и другие тяжёлые решения, если всё можно покрыть `useState`, `useEffect` и props.[1]

## Что не включаем сейчас

На текущем этапе специально не добавляются сложные провайдеры, лишние слои абстракции, несколько store-уровней, selectors/mappers/interceptors и прочая архитектура, которая пока не даёт пользы учебному проекту.[1]

## Статус

Эту структуру можно считать **финально утверждённой базой** для начала разработки проекта аудиоплеера на React + TypeScript + SCSS.[1]