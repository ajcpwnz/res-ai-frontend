export const keify = <G extends {id: string}>(list: G[]) => {
  return list.reduce<Record<string, G>>((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {})
}
