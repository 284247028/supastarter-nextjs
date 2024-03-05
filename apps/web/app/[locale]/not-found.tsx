import { redirect } from "next/navigation";

export default function NotFoundPage() {
  return redirect("/404");
}
