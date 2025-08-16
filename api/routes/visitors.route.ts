import { Elysia } from "elysia";
import { checkInVisitor, checkOutVisitor, deleteVisitor, getVisitorById, getVisitors, updateVisitor } from "api/repositories/visitors.repository";

export const visitorsRoute = new Elysia().get("/visitors", async () => {
    return await getVisitors();
})
    .get("/visitors/:id", async ({ params }) => {
        return await getVisitorById(params.id);
    })
    .put("/visitors/:id", async ({ params, body }) => {
        return await updateVisitor(params.id, body);
    })
    .delete("/visitors/:id", async ({ params }) => {
        return await deleteVisitor(params.id);
    })
    .post("/visitors/:id/check-in", async ({ params, body }) => {
        const { roomId } = JSON.parse(body) as { roomId: string };
        return await checkInVisitor(params.id, roomId);
    })
    .get("/visitors/:id/check-out", async ({ params }) => {
        return await checkOutVisitor(params.id);
    })




