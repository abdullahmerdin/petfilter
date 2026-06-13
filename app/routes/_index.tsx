import { redirect, type LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const params = url.searchParams.toString();
  const target = params ? `/app?${params}` : "/app";
  return redirect(target);
};

export default function Root() {
  return null;
}
