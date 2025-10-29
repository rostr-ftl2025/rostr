export function getUserFromJWT(token: string): { username?: string; userID?: string } | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      username: decoded.username,
      userID: decoded.userID
    };
  } catch {
    return null;
  }
}