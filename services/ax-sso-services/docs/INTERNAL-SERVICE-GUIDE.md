# Building an Internal Service (using ax-sso-services as a template)

This guide captures the conventions baked into `ax-sso-services` so they can be re-used to build sibling internal services (e.g. `ax-cdn-services`, `ax-notify-services`, an ax-billing service). Read it once before cloning, then refer back to specific sections as you implement features.

---

## 1. What this service demonstrates

`ax-sso-services` is a NestJS 11 + Express + MongoDB internal service with:

- REST endpoints (signin / signout / token issue, plus health/index probes) under `/`
- GraphQL endpoint (profile + admin/manage) under `/graphql`
- Code-first GraphQL schema generation (`schema.gql`)
- Two-layer auth — `ApiKeyGuard` (service-to-service) + `SecurityCheckGuard` (per-route JWT bearer with role/status gates)
- A small in-DB cronjob system (scheduler → event → listener → handler) with idempotent one-shot seed jobs
- Mongoose schemas with TTL indexes, UUIDv7 external IDs, snapshot subdocuments
- Swagger UI at `/api-docs`; Apollo Sandbox embedded at `GET /graphql`
- Co-located Jest unit tests + a separate e2e suite backed by `mongodb-memory-server`

Re-use the structure for any internal service that needs the same combination of REST + GraphQL + DB-backed background work behind a shared API-key/JWT model.

---

## 2. Project layout

```
src/
  main.ts                          # bootstrap
  main.module.ts                   # root module
  acore/                           # framework-level, reusable across services
    config/                        # joi-validated env loading
    database/
      database.module.ts           # @Global Mongoose feature models
      schemas/                     # one file per collection
    security/
      api-key.guard.ts             # ax-api-key header check
      security-check.guard.ts      # JWT bearer + role/status gate
      security-check.decorator.ts  # @SecurityCheck({ roles, status })
      security-bypass-all.decorator.ts
      security.constants.ts
      security.module.ts           # registers both guards as APP_GUARDs
      index.ts                     # barrel
    cronjob/
      cronjob.module.ts            # @Global; exports CronjobManager
      cronjob.manager.ts           # CRUD over the cronjobs collection
      cronjob.scheduler.ts         # @Cron(EVERY_MINUTE) → emits CRONJOB events
      cronjob.events.ts            # CRONJOB event-name constant
      index.ts                     # barrel
  services/                        # REST endpoints; one folder per feature
    services.module.ts
    health-check/                  # public probe
    index/                         # service-identity probe
    signin/  signout/  token/      # auth flows; pattern shown below
  graphql/                         # GraphQL endpoint; one folder per domain
    graphql.module.ts              # Nest GraphQL + Apollo + Sandbox
    common/
      account.type.ts              # shared @ObjectType + AccountStatusEnum
      gql-header.decorator.ts      # @GqlHeader('account') param decorator
    profile/                       # self-service (any signed-in caller)
    manage/                        # admin (ADMIN role required)
  workers/                         # background work
    workers.module.ts
    cronjob.listener.ts            # @OnEvent(CRONJOB) dispatcher
    initialization/                # one job per folder
      initialization.handler.ts

test/
  global-setup.ts                  # boots mongodb-memory-server
  global-teardown.ts
  jest-e2e.json                    # e2e config (uses globalSetup/Teardown)
  acore/                           # tests mirror src/ structure
  services/
  graphql/
```

Rule of thumb: anything inside `acore/` is reusable infrastructure and should look the same across services. Anything inside `services/` / `graphql/` / `workers/` is the actual feature surface of _this_ service.

---

## 3. Bootstrap (`src/main.ts` + `src/main.module.ts`)

`main.module.ts` is the root. It only wires the high-level building blocks:

```ts
@Module({
  imports: [ScheduleModule.forRoot(), EventEmitterModule.forRoot(), ConfigModule, SecurityModule, DatabaseModule, GraphQLModule, WorkersModule, ServicesModule],
})
export class MainModule {}
```

`main.ts` is responsible for everything that runs _outside_ a module: global pipes, CORS, Swagger, port binding, and seeding the one-shot initialization cronjob:

- Global `ValidationPipe` with `{ whitelist: true, transform: true, validateCustomDecorators: true }` — strips unknown body keys and coerces types.
- CORS allowlists the auth headers used by callers: `ax-api-key`, `ax-app-key`, plus `authorization`, `cdn-owner-id`, `timezone`, `lang`. Add any new request headers here.
- Swagger document built with `DocumentBuilder().addApiKey(...)` → mounted at `/api-docs`.
- After the app starts listening, `cronjobManager.create('initialization', {}, true)` enqueues the one-shot init job. `checkDuplicated: true` makes it idempotent across restarts.

When you fork this for a new service, the only things you typically change here are:

- Service title in the Swagger `DocumentBuilder()`
- Default port (uses `PORT ?? 3001`)
- The list of bootstrap-time jobs to seed (the call to `cronjobManager.create`)

---

## 4. `acore/config` — environment

`src/acore/config/config.module.ts` is `@Global()` and wires `@nestjs/config` with `joi` validation. The schema is the contract for what the service expects in the environment — every required key must be declared here or the app fails to boot.

Current keys:

```
NODE_ENV          development | production | test     (default development)
PORT              number                              (default 3001)
MONGODB_URI       mongodb:// or mongodb+srv:// URI    (required)
API_KEYS          comma-separated list, non-empty     (required)
JWT_SECRET        string, min 16 chars                (required)
JWT_EXPIRES_IN    ms-format string or seconds         (default '24h')
```

Adding env input to a new service = add it to the joi schema, read it via `configService.getOrThrow<...>('KEY')` from the consumer, and add a sample to `.env.example` if you have one.

---

## 5. `acore/database` — Mongoose schemas

`DatabaseModule` is `@Global()` and registers every schema via `MongooseModule.forFeature([...])`. Consumers inject models with `@InjectModel(Account.name)`.

Schema conventions used here (apply them to new collections):

- One class per schema file, decorated with `@Schema({ collection, timestamps: true })`. Filename matches the collection in singular form: `account.schema.ts` → collection `accounts`.
- Every collection has a stable external `uuid` (UUIDv7 via `v7 as uuidv7` from `uuid`) with `{ required: true, unique: true, index: true, default: () => uuidv7() }`. Use this for cross-collection references, never the Mongo `_id`.
- Co-locate the enum + literal-union type for status-like fields next to the schema:
  ```ts
  export const ACCOUNT_STATUSES = ['ACTIVE', 'LOCKED', 'CLOSED'] as const
  export type AccountStatus = (typeof ACCOUNT_STATUSES)[number]
  @Prop({ type: String, required: true, enum: ACCOUNT_STATUSES, default: 'ACTIVE', index: true })
  status!: AccountStatus
  ```
- TTL: add `expires: 0` on a `Date` prop (`session.schema.ts` and `token.schema.ts` show this) — Mongo removes the doc once the value is in the past.
- Embedded subdocuments (e.g. `SessionAccount`, `SessionApp` inside `Session`) use a separate `@Schema({ _id: false })` class. Use these for _snapshots_ you want to denormalize at write time so reads don't need a join.
- `timestamps: true` populates `createdAt`/`updatedAt` automatically; redeclare them as `@Prop() createdAt?: Date` on the TS surface so consumers can read them with no extra cast.

Consumers always use `.lean()` for read queries (`findOne(...).lean().exec()`), so the resolved object is a plain JS structure, not a hydrated document. Don't return hydrated documents from services — convert with `.toObject()` (e.g. after `accountModel.create(...)`).

Known issue worth tidying when you copy schemas: `app-role.schema.ts` declares a compound index using a non-existent field name (`{ appUid: 1, key: 1 }`) — should be `{ app: 1, key: 1 }`. Fix on copy.

---

## 6. `acore/security` — guards, decorators, headers

Two guards are registered globally via `APP_GUARD` in `SecurityModule`:

```
ApiKeyGuard          → checks `ax-api-key` header against env API_KEYS
SecurityCheckGuard   → opt-in JWT bearer + role/status gate per route
```

### 6.1 API key (service-to-service)

`ApiKeyGuard` is always on. Decorate the open endpoints with `@SecurityBypassAll()` (health probes) to skip both guards. Note one carve-out built into the guard: a plain `GET /graphql` with no query string is allowed through so Apollo Sandbox's landing page renders in the browser; the actual GraphQL operations (POST) still need the API key.

### 6.2 JWT bearer (per-route, opt-in)

`SecurityCheckGuard` is also always on but acts as a no-op unless the route is decorated:

```ts
// route accepts any valid, non-expired bearer
@SecurityCheck()

// role gate (OR within the list)
@SecurityCheck({ roles: ['ADMIN'] })

// status gate
@SecurityCheck({ status: ['ACTIVE'] })

// both gates apply (AND between groups)
@SecurityCheck({ roles: ['ADMIN'], status: ['ACTIVE'] })
```

`@SecurityCheck()` is usable on both controller classes and individual handlers, and on `@Resolver()` classes — the guard reads the underlying request from `GqlExecutionContext` when the execution type is `graphql`.

### 6.3 Verified-identity headers

After `SecurityCheckGuard` verifies the bearer JWT, it strips four request headers up front (defense in depth), then writes the JWT's verified claims back onto them:

| Header    | JWT claim | Meaning                                  |
| --------- | --------- | ---------------------------------------- |
| `account` | `sub`     | Owning account uuid                      |
| `app`     | `app`     | App key the JWT was minted for           |
| `session` | `ses`     | Owning session uuid                      |
| `state`   | `sta`     | Account status at signin (e.g. `ACTIVE`) |

Read them in handlers:

- REST controller: `@Headers('account') account: string | undefined`
- GraphQL resolver: `@GqlHeader('account') account: string | undefined` (custom decorator in `graphql/common/`)

Always validate they're present (`if (!account) throw new InternalServerErrorException(...)`) — the guard guarantees them on the success path, but a missing value would indicate a malformed JWT and is worth surfacing as a 500.

A new service that introduces additional verified claims should: (a) add them to the JWT payload at signin, (b) add their header name to `AUTH_HEADERS` in `security-check.guard.ts` so client-spoofed values are stripped, and (c) write them onto `req.headers.<name>` at the bottom of `canActivate`.

---

## 7. `acore/cronjob` — background jobs

The cronjob system is a 4-piece pipeline:

```
CronjobManager   CRUD over the `cronjobs` collection (create / scan / start / complete / abort / interrupt)
CronjobScheduler @Cron(EVERY_MINUTE) → scan() → emit one CRONJOB event per job
CronjobListener  @OnEvent(CRONJOB) → claim with start() → run handler → complete()/interrupt()
Handler(s)       Per-job-name execution logic (e.g. InitializationHandler)
```

To add a recurring or one-shot background routine in a new service:

1. Pick a `name` (free-form string).
2. Implement a handler class (e.g. `src/workers/<name>/<name>.handler.ts`) with an `execute(parameters)` method. Anything thrown propagates and the listener will mark the job INTERRUPTED with the stack attached.
3. Register the handler as a provider in `WorkersModule`.
4. Add a dispatch branch in `CronjobListener.handle()`:
   ```ts
   if (job.name === 'your-job-name') {
     await this.yourHandler.execute(job.parameters)
   }
   ```
5. Enqueue the job either at boot (`cronjobManager.create('your-job-name', {}, true)` for idempotent one-shots) or on demand from anywhere with access to `CronjobManager`.

`Cronjob` rows carry a `retries` counter that doubles as attempt #. `scan()` excludes jobs whose `retries` exceeds the cap (default 5), so a permanently-broken job stops being retried after a few cycles.

---

## 8. `services/` — REST endpoints

One folder per endpoint. Each folder contains exactly:

```
<feature>/
  <feature>.controller.ts
  <feature>.service.ts
  dto/
    <feature>.req-dto.ts   # request body (only when there is one)
    <feature>.res-dto.ts   # response shape
```

Then list both classes in `services/services.module.ts` (`controllers` + `providers`).

### 8.1 Controller conventions

- Class-level Swagger: `@ApiTags(...)`, `@ApiSecurity('ax-api-key')`, plus `@ApiBearerAuth()` if the route uses `@SecurityCheck()`. Class-level `@SecurityCheck(...)` covers every handler beneath it.
- One handler verb per method. Be explicit about HTTP status — POST defaults to 201, GET to 200, but use `@HttpCode(HttpStatus.OK)` when you want 200 on a POST (e.g. signout).
- Decorate every handler with `@ApiOperation({ summary, description })` and the response-side decorators: `@ApiOkResponse({ type: …ResDto })`, `@ApiUnauthorizedResponse`, `@ApiNotFoundResponse`, etc. These drive both Swagger and OpenAPI clients.
- Pull verified identity via `@Headers('account'|'session'|'state')` (REST). Pull custom request headers (e.g. `APP_KEY_HEADER` for signin) with `@Headers(APP_KEY_HEADER)` and validate them inside the handler (throw `BadRequestException` when missing).

### 8.2 Service conventions

- Inject Mongoose models with `@InjectModel(Schema.name)`.
- `.lean()` every read; never return hydrated documents to controllers.
- Reuse-or-create pattern (visible in signin / token services): `findOne(filter, { uuid: 1 })` → if found, `updateOne($set)` → otherwise mint a new UUIDv7 and `create()`. Apply this whenever a logical key is supposed to be unique but you want idempotent writes.
- Throw HTTP exceptions from the service layer (`UnauthorizedException`, `NotFoundException`, `ConflictException`, etc.) — Nest maps them to the right status and error body automatically.
- Use **bcryptjs** for password hashing; `hash(plain, 12)` is the current cost. Centralize the constant per service.

### 8.3 DTOs

Two filename suffixes — request and response:

- `<feature>.req-dto.ts` exports `…ReqDto` and uses **class-validator** (`@IsString`, `@IsEmail`, `@MinLength`, etc.) plus **`@ApiProperty`** for Swagger. The global `ValidationPipe` enforces them.
- `<feature>.res-dto.ts` exports `…ResDto` with `@ApiProperty` only (no validators — it's the _output_ shape).

Property-under-decorator indentation: the project's ESLint config (`indent: ['error', 2, { SwitchCase: 1 }]`) interprets a `@Decorator()` + property as a multi-line expression, so the property gets one extra indent level (4 spaces) when it sits _under_ decorator lines:

```ts
@ApiProperty(...)
@IsString()
@MaxLength(256)
  field!: string
```

Use the existing files (e.g. `signin.req-dto.ts`) as the canonical reference. Run `pnpm exec eslint --fix` if you're unsure.

---

## 9. `graphql/` — GraphQL endpoint

`GraphQLModule` uses Apollo + code-first schema generation. The schema file (`schema.gql`) is regenerated from decorators on boot, so you don't edit it directly.

### 9.1 Folder shape

```
graphql/
  graphql.module.ts          # Apollo driver + ALL resolvers/services listed in providers
  common/
    account.type.ts          # shared @ObjectType + registerEnumType for AccountStatus
    gql-header.decorator.ts  # @GqlHeader(name) — reads req.headers[name.toLowerCase()]
  <domain>/
    <domain>.type.ts         # @ObjectType (GraphQL output shapes)
    <domain>.service.ts      # business logic
    <domain>.resolver.ts     # @Resolver, @Query, @Mutation
    <…>.input.ts             # @InputType for mutation args
```

Each new domain (e.g. `profile`, `manage`) gets its own folder. List the resolver + service in `graphql.module.ts` `providers`.

### 9.2 Resolver conventions

- Class-level `@SecurityCheck(...)` on the resolver covers every operation — this is the cleanest gate for "all admin operations require ADMIN role":
  ```ts
  @Resolver(() => AccountType)
  @SecurityCheck({ roles: ['ADMIN'] })
  export class ManageResolver { … }
  ```
- Read verified identity inside operations via `@GqlHeader('account')` (the helper in `common/gql-header.decorator.ts`). Same trust model as REST — the guard strips client-supplied values first.
- Use `@Args('uuid', { type: () => ID })` for ID parameters and `@Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })` for typed scalars. Inputs use `@Args('input') input: SomeInput`.
- The query/mutation `name` option overrides the resolver-method name in the schema:
  ```ts
  @Query(() => ProfileType, { name: 'getAccount', description: '…' })
  getProfile(...) { ... }
  ```

### 9.3 GraphQL error surfacing

Apollo serializes guard-thrown HTTP exceptions as GraphQL errors in `body.errors`, not as a top-level non-200 response. e2e tests assert on `body.errors[0].message` (matching against a substring), not status codes. The same applies to `BadRequest` / `NotFound` / `Conflict` from services.

---

## 10. `workers/` — background work

`WorkersModule` imports `CronjobModule` (from `acore/cronjob`) and registers the listener + every handler:

```ts
@Module({
  imports: [CronjobModule],
  providers: [CronjobListener, InitializationHandler],
})
export class WorkersModule {}
```

Each handler folder owns one job kind. Keep handlers small — they're just orchestration glue around services / models, with verbose `Logger.log()` calls so a failed job's transcript is useful.

The initialization handler is a good model for **idempotent seeding**: use `updateOne({ ... }, { $set / $setOnInsert }, { upsert: true })` for everything except password hashing, and skip bcrypt entirely when the account already exists.

---

## 11. Testing

Unit tests live under `test/<area>/<feature>/<name>.spec.ts` and are run via Jest (config inline in `package.json` → `"jest"`). The e2e suite lives under `test/<area>/<feature>/<name>.e2e-spec.ts` and runs via the separate config `test/jest-e2e.json`.

### 11.1 Unit tests

- Build the unit-under-test through Nest's `Test.createTestingModule({...})` — even when the service has no Nest dependencies, this matches the wiring of every other test.
- Mock Mongoose models with the chain pattern visible in existing specs:
  ```ts
  function mockSessionModel(existing) {
    return {
      findOne: jest.fn().mockReturnValue({
        lean: () => ({ exec: () => Promise.resolve(existing) }),
      }),
      …
    }
  }
  ```
  Then `{ provide: getModelToken(Session.name), useValue: sessionMocks }`.
- Mock `JwtService` with `{ signAsync: jest.fn().mockResolvedValue('header.payload.signature') }` and assert on the call args, not on the produced string.
- Assert on **what the service did** (the right `findOne`/`create`/`updateOne` call shape) AND **what it returned**. The service-spec files are the canonical references.

### 11.2 e2e tests

- `test/global-setup.ts` boots a `mongodb-memory-server` instance, writes its URI into `process.env.MONGODB_URI`, and seeds `API_KEYS` + `JWT_SECRET` + `JWT_EXPIRES_IN`. `jest-e2e.json` references it as `globalSetup` (with a matching `globalTeardown`).
- Each suite spins the full `MainModule` via `Test.createTestingModule({ imports: [MainModule] }).compile()` and then `moduleFixture.createNestApplication()`. Apply `ValidationPipe` to match the production wiring.
- `beforeEach` clears every collection the suite touches (don't rely on cross-suite cleanup — the memory DB is shared across all suites because `maxWorkers: 1`).
- Use `supertest` for HTTP. For GraphQL, build a small `gql(query, variables?, bearer?)` helper that wires `API_KEY_HEADER` and `Authorization` per call.
- e2e flake to avoid: never seed two accounts in the same suite that both default to the same `cdnOwnerId` (the schema has `unique: true` on it). Either let it default (`uuidv7()`) or use distinct literals.

---

## 12. Adding a new feature (recipe)

For a new REST endpoint in this service:

1. Create `src/services/<feature>/<feature>.controller.ts` + `.service.ts` + `dto/`.
2. Wire both classes in `src/services/services.module.ts`.
3. Decorate the controller with `@ApiTags`, `@ApiSecurity('ax-api-key')`, and (if auth-required) `@ApiBearerAuth() @SecurityCheck()`.
4. Validate the request DTO with class-validator decorators; document the response DTO with `@ApiProperty`.
5. Add a unit spec for the service and an e2e spec for the controller.
6. Run `pnpm exec jest test/services/<feature>/<feature>.service.spec.ts` and `pnpm exec jest --config ./test/jest-e2e.json test/services/<feature>/<feature>.controller.e2e-spec.ts`. Then `pnpm exec eslint src/ test/`.

For a new GraphQL operation:

1. Add (or extend) a domain folder under `src/graphql/<domain>/`.
2. Define output types in `<domain>.type.ts`, inputs in `<…>.input.ts`.
3. Implement the service; add operations to the resolver with `@SecurityCheck(...)` on the class.
4. Add the new service + resolver to `graphql.module.ts` `providers`.
5. Write a service unit spec and a `<domain>.e2e-spec.ts` covering both the auth gate and the happy path.

---

## 13. Cloning this into a new internal service

For a sibling like `ax-billing-services`:

1. Copy the package directory next to this one (`services/ax-billing-services/`).
2. Update `package.json`:
   - `name` → `ax-billing-services`
   - `description` → service-specific
3. Strip everything inside `src/services/` except `health-check/` and `index/`, then strip everything inside `src/graphql/` except `graphql.module.ts` (gut the resolvers; keep `common/` if you want the shared decorator).
4. Strip everything inside `src/workers/` except `workers.module.ts` and `cronjob.listener.ts` (and remove the `initialization` branch from the listener).
5. In `src/acore/database/schemas/`, keep only the schemas the new service needs. Re-validate any compound indexes (see the `app-role.schema.ts` typo above).
6. In `src/main.ts`, update the Swagger title/description and the default port. Remove the `cronjobManager.create('initialization', …)` call unless the new service has a one-shot init too.
7. In `src/acore/config/config.module.ts`, prune env keys the service doesn't need (e.g. drop `JWT_SECRET`/`JWT_EXPIRES_IN` if it doesn't sign tokens) and add any new ones the service requires.
8. Update `services/services.module.ts` and `graphql/graphql.module.ts` to remove references to the deleted features.
9. Update `pnpm-workspace.yaml` at the repo root if the path doesn't match an existing glob.
10. Add `services/ax-billing-services/**` patterns to the repo-root `.lintstagedrc.json`.
11. Update repo root `CLAUDE.md` so a future Claude session knows where to look.

The shared `@ax-cowork/shared` and `@ax-cowork/control-table` libraries don't ship anything backend-specific — only consume them via `workspace:*` if you actually need their utilities.

---

## 14. Tooling & commands

Run from the package directory (or via `pnpm --filter ax-sso-services <script>` from the repo root):

```
pnpm dev / pnpm start:dev         # nest start --watch
pnpm build                        # nest build
pnpm test                         # unit (jest)
pnpm test:watch                   # unit watch
pnpm test:cov                     # unit coverage
pnpm test:e2e                     # e2e (separate config; uses mongodb-memory-server)
pnpm lint                         # eslint --fix
```

Single-test patterns:

```
pnpm exec jest test/services/<feature>/<file>.spec.ts --no-coverage
pnpm exec jest --config ./test/jest-e2e.json test/services/<feature>/<file>.e2e-spec.ts --no-coverage
pnpm exec jest --config ./test/jest-e2e.json -t "specific test name"
```

A clean cycle before pushing is `pnpm test && pnpm exec jest --config ./test/jest-e2e.json && pnpm exec eslint src/ test/`.

---

## 15. Cheat-sheet: where to add what

| Need                                           | Where                                                                                                                 |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| New env variable                               | `src/acore/config/config.module.ts` joi schema                                                                        |
| New Mongoose collection                        | `src/acore/database/schemas/<name>.schema.ts` + `DatabaseModule` `forFeature` list                                    |
| New REST endpoint                              | `src/services/<feature>/` + `services.module.ts`                                                                      |
| New GraphQL operation                          | `src/graphql/<domain>/` + `graphql.module.ts` `providers`                                                             |
| New background job                             | `src/workers/<job-name>/` + branch in `cronjob.listener.ts` + `WorkersModule`                                         |
| New JWT claim that must be readable downstream | Mint it at signin; add header name to `AUTH_HEADERS` in `security-check.guard.ts`; write it onto `req.headers.<name>` |
| New service-to-service caller                  | Append the new key to the `API_KEYS` env value (comma-separated)                                                      |
| New role-gated route                           | `@SecurityCheck({ roles: ['ADMIN'] })` on controller/resolver class                                                   |
| Open (no-auth) endpoint                        | `@SecurityBypassAll()` on the controller                                                                              |
