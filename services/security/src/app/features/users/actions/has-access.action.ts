import { OK } from "http-status-codes";
import { BearerToken } from "../../../../tokens/bearer-token";
import { Request, Response, NextFunction } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "../../../../../../../shared/command-bus";
import { HasAccessCommand } from "../commands/has-access.command";

export interface HasAccessActionProps {
  commandBus: CommandBus;
}

export const hasAccessActionValidation = celebrate(
  {
    query: {
      resource: Joi.string().required(),
    },
  },
  { abortEarly: false },
);

/**
 * @swagger
 *
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *
 * /api/users/has-access:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     summary: Verifies whether user has access to a specific resource.
 *     parameters:
 *       - in: query
 *         name: resource
 *         schema:
 *            type: string
 *         required: true
 *         example: resource1
 *     responses:
 *       200:
 *         description: User has access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasAccess:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref:  "#/definitions/BadRequestError"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref:  "#/definitions/UnauthorizedError"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref:  "#/definitions/InternalServerError"
 */
export const hasAccessAction = ({ commandBus }: HasAccessActionProps) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  commandBus
    .execute(
      new HasAccessCommand({
        accessToken: BearerToken.fromHeader(req.headers.authorization),
        resource: req.query.resource as string,
      }),
    )
    .then((commandResult) => {
      res.status(OK).json(commandResult);
    })
    .catch(next);
};
