import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import StatusMessage from "@/components/StatusMessage";

const UploadForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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
      const { data } = await api.post("/posts/validate-image", formData);
      const result = { file: imageFile, isValid: true, data: data };
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
      setMessage("Upload successful.");
      setStatus("success");
      setProgress(100);
      toast.success("Navigating to Dashboard...");
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setMessage(e.response?.data?.msg || "Server error");
      }, 750);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  return (
    <div className="flex justify-center items-center mt-12">
      <form
        onSubmit={handleSubmit}
        className="m-4 flex flex-col md:flex-row gap-8 bg-white p-8 rounded-3xl shadow-md"
      >
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl h-[360px] overflow-hidden relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-full h-full rounded-2xl"
            />
          ) : (
            <div className="flex flex-col items-center text-center text-gray-500">
              <ImagePlus size={48} />
              <p className="mt-4 text-sm">Upload a fashion-related image</p>
            </div>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="absolute w-full h-full inset-0 opacity-0 cursor-pointer"
            required
          />
        </div>

        <div className="space-y-6">
          <FormField
            id="title"
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <FormField
            id="description"
            label="Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <FormField
            id="link"
            label="External Link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
          />

          <div>
            <UploadButton status={status} />
            <StatusMessage status={status} message={message} />
            {status === "success" && (
              <Progress
                value={progress}
                className="mt-3 h-2 rounded bg-muted"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
