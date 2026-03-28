import WorkDetail from "@/components/WorkDetail";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <WorkDetail workId={id} />;
}
