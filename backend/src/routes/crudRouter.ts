import { Router } from "express";
import { z, type ZodType } from "zod";
import { allowRoles } from "../middleware/roleMiddleware";

interface CrudConfig<Create extends ZodType, Update extends ZodType> {
  createSchema: Create;
  updateSchema: Update;
  list: () => Promise<unknown[]>;
  create: (data: z.infer<Create>) => Promise<unknown>;
  update: (id: string, data: z.infer<Update>) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
}

export function createCrudRouter<Create extends ZodType, Update extends ZodType>(
  config: CrudConfig<Create, Update>,
) {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      res.json({ data: await config.list() });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = config.createSchema.parse(req.body);
      res.status(201).json({ data: await config.create(data) });
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const data = config.updateSchema.parse(req.body);
      res.json({ data: await config.update(req.params.id, data) });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", allowRoles("ADMIN", "MANAGER"), async (req, res, next) => {
    try {
      await config.remove(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
