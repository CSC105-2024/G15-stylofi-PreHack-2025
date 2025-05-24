import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const UploadButton = ({ status }) => (
  <Button
    type="submit"
    disabled={status === "checking" || status === "success"}
    className="w-80 text-white cursor-pointer"
  >
    {status === "checking" ? (
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin" size={18} /> Uploading...
      </div>
    ) : status === "success" ? (
      <div className="flex items-center gap-2">
        <CheckCircle2 size={18} />
      </div>
    ) : (
      "Upload"
    )}
  </Button>
);

export default UploadButton;
