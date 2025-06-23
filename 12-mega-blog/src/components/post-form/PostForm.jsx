import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function PostForm({ post }) {
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(post?.featuredImage || null);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    control, 
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    try {
      setLoading(true);
      let fileId = post?.featuredImage;

      // Handle file upload for new or updated image
      if (data.image && data.image[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (!file) throw new Error("File upload failed");
        
        // Delete old file if updating
        if (post?.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage);
        }
        fileId = file.$id;
      }

      // Prepare post data
      const postData = {
        ...data,
        featuredImage: fileId,
        userId: userData.$id
      };

      // Create or update post
      const dbPost = post 
        ? await appwriteService.updatePost(post.$id, postData)
        : await appwriteService.createPost(postData);

      if (!dbPost) throw new Error(post ? "Update failed" : "Creation failed");

      toast.success(`Post ${post ? 'updated' : 'created'} successfully!`);
      navigate(`/post/${dbPost.$id}`);
    } catch (error) {
      toast.error(error.message);
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s-]+/g, "")
        .replace(/\s+/g, "-");
    }
    return "";
  }, []);

  // Handle file preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { 
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters"
            }
          })}
          error={errors.title?.message}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { 
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: "Slug can only contain lowercase letters, numbers and hyphens"
            }
          })}
          error={errors.slug?.message}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { 
            required: !post && "Image is required",
            validate: {
              lessThan10MB: files => 
                files[0]?.size < 10000000 || "Maximum 10MB",
              acceptedFormats: files =>
                ['image/jpeg', 'image/png', 'image/gif'].includes(files[0]?.type) || 
                "Only JPEG, PNG & GIF"
            }
          })}
          onChange={handleFileChange}
          error={errors.image?.message}
        />
        {(filePreview || post?.featuredImage) && (
          <div className="w-full mb-4">
            <img
              src={filePreview || appwriteService.getFilePreview(post.featuredImage)}
              alt={post?.title || "Preview"}
              className="rounded-lg max-h-60 object-contain"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: "Status is required" })}
          error={errors.status?.message}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : "bg-blue-500"}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : (post ? "Update" : "Submit")}
        </Button>
      </div>
    </form>
  );
}