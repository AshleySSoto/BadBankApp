import express from "express";
import controller from "../controls/Balance";

const router = express.Router();

router.route("/")
  .post(controller.create)
  .get(controller.read)
  .put(controller.update)
  .delete(controller.del)

router.route("/all")
  .get(controller.readAll)

export default router;