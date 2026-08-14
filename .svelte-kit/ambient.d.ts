
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const NODE_ENV: string;
	export const LC_NUMERIC: string;
	export const INIT_CWD: string;
	export const HOMEBREW_REPOSITORY: string;
	export const npm_config_global_prefix: string;
	export const npm_config_globalconfig: string;
	export const QT_IM_MODULE: string;
	export const LC_IDENTIFICATION: string;
	export const GJS_DEBUG_OUTPUT: string;
	export const GDMSESSION: string;
	export const npm_config_init_module: string;
	export const QT_ACCESSIBILITY: string;
	export const npm_package_version: string;
	export const GOPATH: string;
	export const npm_lifecycle_event: string;
	export const LC_NAME: string;
	export const npm_lifecycle_script: string;
	export const LS_COLORS: string;
	export const PI_MODEL: string;
	export const XDG_SESSION_DESKTOP: string;
	export const PI_REASONING_LEVEL: string;
	export const LC_PAPER: string;
	export const LC_TELEPHONE: string;
	export const DISPLAY: string;
	export const PYENV_ROOT: string;
	export const XDG_RUNTIME_DIR: string;
	export const LC_MEASUREMENT: string;
	export const XDG_MENU_PREFIX: string;
	export const npm_package_name: string;
	export const NODE: string;
	export const HOMEBREW_CELLAR: string;
	export const INVOCATION_ID: string;
	export const SESSION_MANAGER: string;
	export const PATH: string;
	export const SHELL: string;
	export const npm_config_node_gyp: string;
	export const XDG_DATA_DIRS: string;
	export const SONARSCANNER_PATH: string;
	export const LC_ADDRESS: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const XMODIFIERS: string;
	export const NVM_BIN: string;
	export const NVM_INC: string;
	export const npm_execpath: string;
	export const PYENV_SHELL: string;
	export const npm_command: string;
	export const GPG_AGENT_INFO: string;
	export const LOGNAME: string;
	export const LANG: string;
	export const PI_CODING_AGENT: string;
	export const ZSH: string;
	export const NVM_DIR: string;
	export const DESKTOP_SESSION: string;
	export const HOME: string;
	export const NVM_CD_FLAGS: string;
	export const TERMINATOR_UUID: string;
	export const LC_TIME: string;
	export const npm_config_user_agent: string;
	export const COLORTERM: string;
	export const SHLVL: string;
	export const npm_node_execpath: string;
	export const USER: string;
	export const PI_SESSION_FILE: string;
	export const EDITOR: string;
	export const IM_CONFIG_PHASE: string;
	export const LESS: string;
	export const XAUTHORITY: string;
	export const npm_config_local_prefix: string;
	export const SSH_AGENT_PID: string;
	export const GOENV_ROOT: string;
	export const npm_config_noproxy: string;
	export const npm_config_npm_version: string;
	export const GIT_EDITOR: string;
	export const GIO_LAUNCHED_DESKTOP_FILE: string;
	export const PI_PROVIDER: string;
	export const TERMINATOR_DBUS_PATH: string;
	export const OLDPWD: string;
	export const npm_package_json: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const PWD: string;
	export const GJS_DEBUG_TOPICS: string;
	export const npm_config_userconfig: string;
	export const XDG_SESSION_TYPE: string;
	export const AI_AGENT: string;
	export const npm_config_cache: string;
	export const npm_config_engine_strict: string;
	export const WINDOWPATH: string;
	export const JOURNAL_STREAM: string;
	export const GTK_MODULES: string;
	export const PAGER: string;
	export const VTE_VERSION: string;
	export const SSH_AUTH_SOCK: string;
	export const LC_MONETARY: string;
	export const GOROOT: string;
	export const INFOPATH: string;
	export const XDG_SESSION_CLASS: string;
	export const HOMEBREW_PREFIX: string;
	export const GOENV_PATH_ORDER: string;
	export const SVELTEKIT_FORK: string;
	export const PI_SESSION_ID: string;
	export const BUN_INSTALL: string;
	export const TERMINATOR_DBUS_NAME: string;
	export const MANAGERPID: string;
	export const GIO_LAUNCHED_DESKTOP_FILE_PID: string;
	export const M2_HOME: string;
	export const COLOR: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const GOENV_SHELL: string;
	export const DEFAULTS_PATH: string;
	export const XDG_CONFIG_DIRS: string;
	export const TERM: string;
	export const USERNAME: string;
	export const LSCOLORS: string;
	export const MANDATORY_PATH: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		NODE_ENV: string;
		LC_NUMERIC: string;
		INIT_CWD: string;
		HOMEBREW_REPOSITORY: string;
		npm_config_global_prefix: string;
		npm_config_globalconfig: string;
		QT_IM_MODULE: string;
		LC_IDENTIFICATION: string;
		GJS_DEBUG_OUTPUT: string;
		GDMSESSION: string;
		npm_config_init_module: string;
		QT_ACCESSIBILITY: string;
		npm_package_version: string;
		GOPATH: string;
		npm_lifecycle_event: string;
		LC_NAME: string;
		npm_lifecycle_script: string;
		LS_COLORS: string;
		PI_MODEL: string;
		XDG_SESSION_DESKTOP: string;
		PI_REASONING_LEVEL: string;
		LC_PAPER: string;
		LC_TELEPHONE: string;
		DISPLAY: string;
		PYENV_ROOT: string;
		XDG_RUNTIME_DIR: string;
		LC_MEASUREMENT: string;
		XDG_MENU_PREFIX: string;
		npm_package_name: string;
		NODE: string;
		HOMEBREW_CELLAR: string;
		INVOCATION_ID: string;
		SESSION_MANAGER: string;
		PATH: string;
		SHELL: string;
		npm_config_node_gyp: string;
		XDG_DATA_DIRS: string;
		SONARSCANNER_PATH: string;
		LC_ADDRESS: string;
		GNOME_SHELL_SESSION_MODE: string;
		XMODIFIERS: string;
		NVM_BIN: string;
		NVM_INC: string;
		npm_execpath: string;
		PYENV_SHELL: string;
		npm_command: string;
		GPG_AGENT_INFO: string;
		LOGNAME: string;
		LANG: string;
		PI_CODING_AGENT: string;
		ZSH: string;
		NVM_DIR: string;
		DESKTOP_SESSION: string;
		HOME: string;
		NVM_CD_FLAGS: string;
		TERMINATOR_UUID: string;
		LC_TIME: string;
		npm_config_user_agent: string;
		COLORTERM: string;
		SHLVL: string;
		npm_node_execpath: string;
		USER: string;
		PI_SESSION_FILE: string;
		EDITOR: string;
		IM_CONFIG_PHASE: string;
		LESS: string;
		XAUTHORITY: string;
		npm_config_local_prefix: string;
		SSH_AGENT_PID: string;
		GOENV_ROOT: string;
		npm_config_noproxy: string;
		npm_config_npm_version: string;
		GIT_EDITOR: string;
		GIO_LAUNCHED_DESKTOP_FILE: string;
		PI_PROVIDER: string;
		TERMINATOR_DBUS_PATH: string;
		OLDPWD: string;
		npm_package_json: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		PWD: string;
		GJS_DEBUG_TOPICS: string;
		npm_config_userconfig: string;
		XDG_SESSION_TYPE: string;
		AI_AGENT: string;
		npm_config_cache: string;
		npm_config_engine_strict: string;
		WINDOWPATH: string;
		JOURNAL_STREAM: string;
		GTK_MODULES: string;
		PAGER: string;
		VTE_VERSION: string;
		SSH_AUTH_SOCK: string;
		LC_MONETARY: string;
		GOROOT: string;
		INFOPATH: string;
		XDG_SESSION_CLASS: string;
		HOMEBREW_PREFIX: string;
		GOENV_PATH_ORDER: string;
		SVELTEKIT_FORK: string;
		PI_SESSION_ID: string;
		BUN_INSTALL: string;
		TERMINATOR_DBUS_NAME: string;
		MANAGERPID: string;
		GIO_LAUNCHED_DESKTOP_FILE_PID: string;
		M2_HOME: string;
		COLOR: string;
		XDG_CURRENT_DESKTOP: string;
		_: string;
		npm_config_prefix: string;
		GOENV_SHELL: string;
		DEFAULTS_PATH: string;
		XDG_CONFIG_DIRS: string;
		TERM: string;
		USERNAME: string;
		LSCOLORS: string;
		MANDATORY_PATH: string;
		GNOME_DESKTOP_SESSION_ID: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
