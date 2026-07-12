export type User = {
  id: number;
  nickname: string;
  is_staff: boolean;
  is_superuser: boolean;
};
export type ResponseData = {
  name: string;
  v: number;
  is_login: boolean;
  user: User;
};

export async function getServerStatus(
  url: string,
): Promise<ResponseData | null> {
  try {
    const response = await fetch(`${url}/accounts/setup/`);

    if (response.ok) {
      const data = (await response.json()) as ResponseData;
      if (data.name === "視聴記録") {
        return data;
      }
    }
  } catch {}
  return null;
}

export async function checkServerStatus(url: string): Promise<boolean> {
  const data = await getServerStatus(url);
  if (!data) return false;

  if (data.name === "視聴記録" && data.v === 1) {
    return true;
  }
  return false;
}
