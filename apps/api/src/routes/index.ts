import { Router } from "express";
import authRouter from "../modules/auth/index.js";
import jobsRouter from "../modules/jobs/index.js";
import schemesRouter from "../modules/schemes/index.js";
import coursesRouter from "../modules/courses/index.js";
import resumeRouter from "../modules/resume/index.js";
import dashboardRouter from "../modules/dashboard/index.js";
import aiRouter from "../modules/ai/index.js";
import notificationsRouter from "../modules/notifications/index.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/jobs", jobsRouter);
apiRouter.use("/schemes", schemesRouter);
apiRouter.use("/courses", coursesRouter);
apiRouter.use("/resume", resumeRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/ai", aiRouter);
apiRouter.use("/notifications", notificationsRouter);

export default apiRouter;
