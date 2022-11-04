import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../../database/prismaconnection";

export const loginController = async (req: Request, res: Response) => {
	try {
		const { email, password }: string | any = req.body;
		if (!email) {
			return res.send({ message: "insira um email" });
		}
		if (!password) {
			return res.send({ message: "insira um password" });
		}

		const result = await prisma.user.findFirst({ where: { email: email } });

		if (!result) {
			return res.status(500).send({ message: "Email does not exist" });
		}

		if (result && result.password === password) {
			const token = jwt.sign(
				{
					userId: result.id,
					email: result.email,
					username: result.username,
				},
				String(process.env.JWTKEY),
				{ expiresIn: "1d" },
			);

			return res.status(200).send({ token: token });
		}
		return res.status(403).send("Wrong password");
	} catch (err) {
		return res.status(500).send(err);
	}
};
