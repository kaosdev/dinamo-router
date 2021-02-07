type ValuesToParams<Value extends string> = {
  [Key in Value]: string;
};

export function route<Value extends string>(
  template: TemplateStringsArray,
  ...values: Value[]
): Route<ValuesToParams<Value>> {
  return {
    match: template.join("([^/]*)"),
    values,
  };
}

interface Route<Params> {
  match: string;
  values: string[];
}

export type EmptyParams = Record<any, never>;
type NoInfer<T> = [T][T extends any ? 0 : never];

interface RouteWithCallback<Params, BaseParams> {
  route: Route<Params>;
  callback: RouteCallback<Params, BaseParams>;
}

export interface RouteCallback<Params, BaseParams> {
  (params: Params, baseParams: BaseParams): void;
}

export class Routing<BaseParams> {
  constructor(private readonly base: Route<BaseParams>) {}

  private readonly routes: RouteWithCallback<any, BaseParams>[] = [];

  on<Params>(
    route: Route<Params>,
    callback: RouteCallback<Params, BaseParams>
  ): this {
    this.routes.push({ route, callback });
    return this;
  }

  mount(): void {
    this.onChangePath();

    window.addEventListener("popstate", () => {
      this.onChangePath();
    });
  }

  onChangePath() {
    const path = getCurrentPath();
    const baseMatch = matchBase(this.base, path);
    if (!baseMatch) {
      throw Error("Base path cannot be matched");
    }

    const relativePath = removeSlash(path.replace(RegExp(this.base.match), ""));
    const baseParams = getParams(this.base, baseMatch);

    for (const { route, callback } of this.routes) {
      const match = matchPath(route, relativePath);
      if (match) {
        const params = getParams(route, match);
        callback(params, baseParams as any);
        return;
      }
    }
  }

  private getCurrentBase(): string {
    const path = getCurrentPath();
    const match = path.match(RegExp("^" + this.base.match));

    if (!match) {
      throw Error("Base path cannot be matched");
    }

    return match[0];
  }

  navigate(path: string) {
    const base = this.getCurrentBase();
    path = removeSlash(path);
    const completePath = `${base ? "/" + base : ""}/${path}`;
    window.history.pushState({}, "", completePath);
    this.onChangePath();
  }
}

/**
 * Remove initial and final / from a string
 */
function removeSlash(path: string): string {
  return path.replace(/(^\/)|(\/$)/g, "");
}

/**
 * Check if a route match a path,
 * and get interpolated parameters.
 */
function matchPath(route: Route<any>, path: string): string[] | null {
  const regex = RegExp("^" + route.match + "$");
  return path.match(regex)?.slice(1) || null;
}

/**
 * Check if a base route match a path,
 * and get interpolated parameters.
 */
function matchBase(route: Route<any>, path: string): string[] | null {
  const regex = RegExp("^" + route.match);
  return path.match(regex)?.slice(1) || null;
}

/**
 * Get named parameters from a route match
 */
function getParams<Params>(route: Route<Params>, match: string[]): Params {
  return match.reduce((acc, param, index) => {
    return {
      ...acc,
      [route.values[index]]: param,
    };
  }, {}) as Params;
}

/**
 * Get current path, by removing slash and query params
 */
function getCurrentPath(): string {
  let path = decodeURI(window.location.pathname);
  path = removeSlash(path);
  path = path.replace(/\?(.*)$/, "");
  return path;
}
