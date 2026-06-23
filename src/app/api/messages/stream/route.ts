import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import Hub from "../../../../models/Hub.model";
import Message from "../../../../models/Message.model";
import "../../../../models/User.model";
import {
  registerClient,
  unregisterClient,
} from "../../../../lib/hubStream";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const hubId = searchParams.get("hubId");
  if (!hubId) return new Response("hubId required", { status: 400 });

  await connectDB();

  const hub = await Hub.findById(hubId);
  if (!hub) return new Response("Hub not found", { status: 404 });

  const isMember = hub.members.some(
    (m: any) => m.toString() === session.user.id
  );
  if (!isMember) return new Response("Not allowed", { status: 403 });

  const recent = await Message.find({ hub: hubId })
    .populate("sender", "name githubUsername image")
    .sort({ createdAt: 1 })
    .limit(50);

  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      registerClient(hubId, controller);

      // Send existing messages immediately on connect
      const init = `data: ${JSON.stringify({
        type: "init",
        messages: JSON.parse(JSON.stringify(recent)),
      })}\n\n`;
      controller.enqueue(init);

      // Heartbeat every 25s to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(": ping\n\n");
        } catch {
          clearInterval(heartbeat);
        }
      }, 25000);

      // Cleanup when client disconnects
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unregisterClient(hubId, controller);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}