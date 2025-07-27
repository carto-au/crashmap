import { goto } from "$app/navigation";

const newUrl = new URL(window.location.href);
newUrl.pathname = "/nsw";

goto(newUrl, { replaceState: true });
