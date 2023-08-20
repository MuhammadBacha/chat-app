import Pusher from "pusher-js";

export const pusher = new Pusher(import.meta.env.VITE_APP_ID, {
  cluster: "ap2",
});
