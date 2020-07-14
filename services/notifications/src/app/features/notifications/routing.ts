import * as express from "express";
import { CommandBus } from "../../../../../../shared/command-bus";

import { sendAction, sendActionValidation } from "./actions/send.action";
// COMMAND_IMPORTS

export interface NotificationsRoutingProps {
  commandBus: CommandBus;
}

export const notificationsRouting = ({ commandBus }: NotificationsRoutingProps) => {
  const router = express.Router();

  router.post("/send", [sendActionValidation], sendAction({ commandBus }));
  // COMMANDS_SETUP

  return router;
};
