// Shared SSE client registry — imported by both stream and messages routes

const clients: Map<string, Set<ReadableStreamDefaultController>> = new Map();

export function notifyHub(hubId: string, data: object) {
  const hubClients = clients.get(hubId);
  if (!hubClients) return;
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  hubClients.forEach((ctrl) => {
    try {
      ctrl.enqueue(payload);
    } catch {
      // client disconnected
    }
  });
}

export function registerClient(
  hubId: string,
  controller: ReadableStreamDefaultController
) {
  if (!clients.has(hubId)) clients.set(hubId, new Set());
  clients.get(hubId)!.add(controller);
}

export function unregisterClient(
  hubId: string,
  controller: ReadableStreamDefaultController
) {
  clients.get(hubId)?.delete(controller);
  if (clients.get(hubId)?.size === 0) clients.delete(hubId);
}