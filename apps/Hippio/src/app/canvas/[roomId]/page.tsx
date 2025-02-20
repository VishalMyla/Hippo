// pages/index.tsx

import Hippio from "../../../components/Hippio"; // adjust the path as needed
export default async function HomePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const param = await params;

  return (
    <div>
      <Hippio roomId={parseInt(param.roomId)} />
    </div>
  );
}
