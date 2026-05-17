# AGENTS.md

## Big picture
- Next.js 16 App Router project in `src/app`; authenticated pages live under `src/app/(protected)` and public auth flows live in route folders like `src/app/login`.
- This repo is in migration: `legacy/` contains old pages/hooks/components and is excluded from lint, tests, and TS (`eslint.config.mjs`, `jest.config.ts`, `tsconfig.json`). Prefer `src/` for new work.
- UI is built from local primitives (`src/components/primitives/*`) + Tailwind v4 tokens in `src/app/globals.css` (`@theme` custom colors).
- Naming/domain language is Portuguese (`contas`, `lancamentos`, `categorias`), including API fields and user-facing text.

## Auth + API boundary (important)
- Frontend should call internal Next routes, not the external backend directly.
- Auth/session token is stored in HTTP-only cookie `meudinherim.token` via `setSessionToken` in `src/helpers/session-server-helper.ts`.
- Login flow: `src/services/auth-service.ts` -> `POST /api/auth/login` -> upstream `/v1/auth/login`; route validates JWT and sets cookie (`src/app/api/auth/login/route.ts`).
- Upstream API base URL comes from `getApiBaseUrl()` (`src/helpers/route-helpers.ts`): `NEXT_PUBLIC_BASE_URL` with fallback `http://localhost:8080`.
- Protected API flow: services call `/api/proxy/...` (example `src/services/lancamento-conta-service.ts`), and `src/app/api/proxy/[...path]/route.ts` forwards to backend with `Authorization: Bearer <token>`.
- Proxy route has an allowlist (`ALLOWED_RESOURCES`); add new top-level backend resources there or requests will return `403`.
- Proxy route also validates token signature via `isValidToken`; invalid token requests return `401` and clear cookie state (`clearSessionToken`).

## Route protection
- Edge guard in `src/proxy.ts` redirects unauthenticated users to `/login` and redirects authenticated users away from public auth pages.
- Public auth paths are centralized in `AUTH_PUBLIC_ROUTES` (`src/helpers/route-helpers.ts`); update this list when adding/removing auth pages.
- Server guard in `src/app/(protected)/layout.tsx` checks cookie via `getSessionToken()` and calls `redirect("/login")`.
- Client-side fetch helpers also enforce auth: `validarAutenticacao` (`src/helpers/session-client-helper.ts`) sends browser to `/login` on `401`.

## Data flow conventions
- Prefer typed contracts from `src/types/*` and response envelope `ApiResponse<T>` / `ApiFormErrorResponse` (`src/types/api.ts`).
- For form/auth routes, normalize errors from axios and return backend payload shape (see `src/app/api/auth/cadastrar-usuario/route.ts`).
- Client services usually `fetch` internal routes and parse through `handleApiResponse` to throw `ApiError` (`src/helpers/response-helper.ts`, `src/types/application-error.ts`).
- React Query is configured in `src/providers/query-provider.tsx` (5 min stale, retry 1, no refetch-on-focus); query keys come from `src/helpers/query-keys-helper.ts`.
- Initial app data is preloaded with `InitialConfigDataProvider` (`src/providers/data-provider.tsx`) using `useConfiguracaoInicial()`.

## Forms and validation
- Forms use `react-hook-form` + `zodResolver`; schemas live in `src/schema-validation/*` (example `loginSchema` in `src/schema-validation/auth.ts`).
- API validation errors (`codigo -90`) are mapped back to field errors in forms (example `src/app/login/login-form.tsx`).
- Keep toast/error behavior aligned with existing pattern: `ApiError` message when known, fallback to `DEFAULT_ERROR_MESSAGE`.

## Dev workflows
- Install and run:
  - `pnpm dev`
  - `pnpm build && pnpm start`
- Lint:
  - `pnpm lint`
- Tests:
  - `pnpm test`
  - `pnpm test:watch`
  - `pnpm test:coverage`
- Debug server+client with inspector: `pnpm run dev:inspect` then use `.vscode/launch.json` configs documented in `README.md`.

## Testing specifics
- Jest + RTL with jsdom (`jest.config.ts`, `jest.setup.ts`); import `render` from `src/helpers/test/test-helper.tsx`.
- Path alias `@/` is mapped for tests and TS.
- Coverage/test ignores include `src/services/`, `src/hooks/`, `src/providers/`, `src/contexts/`, `src/components/primitives/`, `src/lib/`, and `legacy/` (tests); plus coverage collection ignores `src/helpers/**`, `src/app/**/route.ts`, `src/app/**/layout.tsx`, and `src/proxy.ts`.

