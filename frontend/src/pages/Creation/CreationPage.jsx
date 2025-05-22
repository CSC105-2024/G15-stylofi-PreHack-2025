import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";

const UploadForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);

  const [validated, setValidated] = useState(null);

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const simulateUploadSteps = () => {
    setMessage("The image is fashion-related!");
    setProgress(20);

    setTimeout(() => {
      setMessage("📤 Uploading to server...");
      setProgress(60);
    }, 800);

    setTimeout(() => {
      setMessage("💾 Saving to database...");
      setProgress(85);
    }, 2500);

    setTimeout(() => {
      setMessage("✨ Finalizing upload...");
      setProgress(95);
    }, 3200);
  };

  const handleImage = async (imageFile) => {
    if (validated?.file === imageFile) {
      return validated.isValid;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    setStatus("checking");
    setMessage("Initializing AI Analysis Engine...");

    try {
      const res = await api.post("/posts/validate-image", formData);
      const result = { file: imageFile, isValid: true, data: res.data };

      setStatus("success");
      setValidated(result);
      return true;
    } catch (e) {
      setValidated({ file: imageFile, isValid: false });
      setStatus("error");
      setMessage(e.response?.data?.msg || "Server error");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid =
      validated?.file === image ? validated.isValid : await handleImage(image);

    if (!isValid) return;

    setProgress(0);

    simulateUploadSteps();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
    formData.append("image", image);

    try {
      await api.post("/posts/create", formData);
      setMessage("Upload sucessful.");
      setStatus("success");
      setProgress(100);
      toast.success("Navigating to Dashboard...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setMessage(e.response?.data?.msg || "Server error");
        // toast.error(e.response?.data?.msg || "Server error");
      }, 750);
    }
  };

  return (
    // TODO: update UI (well, maybe UX also)
    <div className="max-w-xl mx-auto mt-10 p-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-2xl font-semibold">Upload Fashion Image</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input-background/80 w-80 h-12 border-0 rounded-xl ring-primary"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input-background/80 w-80 h-12 border-0 rounded-xl ring-primary"
                required
              />
            </div>

            <div>
              <Label htmlFor="link">External Link</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-input-background/80 w-80 h-12 border-0 rounded-xl ring-primary"
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={status === "checking" || status === "success"}
              className="w-full text-white"
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

            {message && (
              <div
                className={`flex items-center gap-2 text-sm font-medium mt-2 ${
                  status === "success"
                    ? "text-green-600"
                    : status === "error"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {status === "success" ? <CheckCircle2 size={18} /> : null}
                {status === "error" ? <XCircle size={18} /> : null}
                <span>{message}</span>
              </div>
            )}
            {status === "success" && (
              <Progress value={progress} className="h-2 rounded bg-muted" />
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadForm;
