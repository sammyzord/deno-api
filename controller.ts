import { Context, helpers } from "https://deno.land/x/oak@v10.6.0/mod.ts";

const BASE_URL = "http://localhost:8080";

class ServiceError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

const getNextUrl = (header: string) => {
  const list = header.split(",");
  const item = list.find((item) => item.match(/.+rel="next"$/));
  if (!item) {
    return "";
  }

  const pattern = /.+since=(\d)/;
  const match = item.match(pattern);
  if (!match) {
    return "";
  }

  return match[1];
};

export const listUsers = async (ctx: Context) => {
  try {
    const { since } = helpers.getQuery(ctx, { mergeParams: true });

    const response = await fetch(
      `https://api.github.com/users?per_page=6&since=${since}`,
    );

    if (!response.ok) {
      throw new ServiceError("Fetch error", response.status);
    }

    const next = response.headers.get("link") || "";
    const next_url = `${BASE_URL}/users?since=${getNextUrl(next)}`;

    const json = await response.json();

    ctx.response.body = { next: next_url, data: json };
  } catch (error) {
    ctx.response.status = error.code || 500;
    ctx.response.body = { error: error.message };
  }
};

export const userDetails = async (ctx: Context) => {
  try {
    const { username } = await helpers.getQuery(ctx, { mergeParams: true });

    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new ServiceError("Fetch error", response.status);
    }

    const json = await response.json();

    ctx.response.body = { data: json };
  } catch (error) {
    ctx.response.status = error.code || 500;
    ctx.response.body = { error: error.message };
  }
};

export const userRepos = async (ctx: Context) => {
  try {
    const { username, page } = await helpers.getQuery(ctx, {
      mergeParams: true,
    });

    if (!username) {
      throw new ServiceError("Username is required", 400);
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=6&page=${page}`,
    );

    if (!response.ok) {
      throw new ServiceError("Fetch error", response.status);
    }

    const json = await response.json();

    const next_page: number = page ? Number(page) + 1 : 2;
    const next_url = `${BASE_URL}/users/${username}/repos?page=${next_page}`;

    ctx.response.body = {
      next: next_url,
      data: json,
    };
  } catch (error) {
    ctx.response.status = error.code || 500;
    ctx.response.body = { error: error.message };
  }
};
