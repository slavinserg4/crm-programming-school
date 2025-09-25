import { removeOldTokensCron } from "./remove-old-tokens.cron";

export const cronRunner = async () => {
    removeOldTokensCron.start();
};
