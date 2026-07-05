import { Spinner } from "@/components/spell-ui/spinner";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner size="lg" speed="normal" className="text-orange-500" />
    </div>
  );
}
