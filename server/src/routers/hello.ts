import { procedure } from "../lib/trpc";

export const helloRouter = procedure.query(() => "Hello, world!" );
