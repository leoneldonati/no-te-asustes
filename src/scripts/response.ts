export const res = (payload: any, config?: { status: number }) =>
  new Response(JSON.stringify(payload), {
    status: config?.status ?? 200,
    headers: { "Content-Type": "application/json" },
  });
