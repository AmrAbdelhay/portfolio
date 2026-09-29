import Home from "./home";
import { publishedContent } from "./cms/server";
export const dynamic = "force-dynamic";
export default async function Page() { return <Home content={await publishedContent()} />; }
