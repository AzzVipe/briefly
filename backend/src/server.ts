import dotenv from "dotenv";
import { env } from "./config/env";

dotenv.config();

import app from "./app";

const PORT = env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
