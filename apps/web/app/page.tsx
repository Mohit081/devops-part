
import { client } from "@repo/db/client";

export default async function Home() {
  try {
    const user = await client.user.findFirst();

    return (
      <div>
        First name haha:
        {user?.username}
        password:
        {user?.password}
      </div>
    );
  } catch (err) {
    console.error("Prisma query failed in Home:", err);
    return <div>Error loading user from database.</div>;
  }
}
