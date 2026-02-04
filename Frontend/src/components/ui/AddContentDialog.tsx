import { Button } from "./Buttons";
import { BrainIcon } from "../icons/BrainIcon";
import { useState } from "react";
import { BackendURL } from "../../config/config";
import axios from "axios";

interface AddContentDialogProps {
  onClose: () => void;
  onContentAdded: () => void;
  showAlert?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function AddContentDialog({ onClose, onContentAdded, showAlert }: AddContentDialogProps) {
  const [isloading, setisLoading] = useState(false);
  const [Title, setTitle] = useState("");
  const [Link, setLink] = useState("");
  const [Category, setCategory] = useState("Twitter");
  const [Tags, setTags] = useState("Productive");

  async function handleAddContent() {
    setisLoading(true);
    try {
      const response = await axios.post(
        `${BackendURL}/content`,
        {
          types: Category,
          link: Link,
          title: Title,
          tags: Tags,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      onContentAdded();
      console.log(response.data.message);
      
      if (showAlert) {
        showAlert(response.data.message, 'success');
        // Close dialog after showing success message
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        alert(response.data.message);
        onClose();
      }
    } catch (error: any) {
      console.log("Full error:", error);
      
      let errorMessage = "Failed to add content. Please try again.";
      
      if (error.response) {
        console.log("Error response:", error.response.data);
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Error: ${JSON.stringify(error.response.data)}`;
      } else {
        console.log("Network error:", error.message);
        errorMessage = `Network error: ${error.message}`;
      }
      
      if (showAlert) {
        showAlert(errorMessage, 'error');
      } else {
        alert(errorMessage);
      }
    } finally {
      setisLoading(false);
    }
  }

  return (
    <div className="w-fit h-fit bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 m-6">
      <div className="mb-6">
        <div className="flex justify-center mb-3">
          <BrainIcon className="w-12 h-12 text-secondary" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-800 text-center mb-2">
          Feed Your Brain
        </h2>
        <p className="text-slate-600 text-center text-sm">
          Add new knowledge to your digital mind
        </p>
        <div className="w-16 h-1 bg-secondary mx-auto rounded-full mt-3"></div>
      </div>

      <div className="flex flex-col mb-2">
        <label className="text-lg font-serif text-slate-700 font-medium mb-1">
          Title:
        </label>
        <input
          type="text"
          className="border-2 border-slate-300 rounded-2xl px-5 py-3 text-lg focus:ring-1 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all duration-200 hover:border-slate-400"
          placeholder="Enter your content title..."
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label className="text-lg font-serif text-slate-700 font-medium mb-1">
          Link:
        </label>
        <input
          type="url"
          className="border-2 border-slate-300 rounded-2xl px-5 py-3 text-lg focus:ring-1 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all duration-200 hover:border-slate-400"
          placeholder="https://example.com"
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label className="text-lg font-serif text-slate-700 font-medium mb-1">
          Content Type:
        </label>
        <select
          name="Category"
          className="border-2 border-slate-300 rounded-2xl px-5 py-3 text-lg bg-white focus:ring-1 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all duration-200 hover:border-slate-400 cursor-pointer"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="Twitter">Twitter</option>
          <option value="youtube">YouTube</option>
          <option value="document">Document</option>
        </select>
      </div>

      <div className="flex flex-col mb-4">
        <label className="text-lg font-serif text-slate-700 font-medium mb-1">
          Tags:
        </label>
        <select
          name="Tags"
          className="border-2 border-slate-300 rounded-2xl px-5 py-3 text-lg bg-white focus:ring-1 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all duration-200 hover:border-slate-400 cursor-pointer"
          onChange={(e) => {
            setTags(e.target.value);
          }}
        >
          <option value="Productive">Productive</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Politics">Politics</option>
          <option value="Sports">Sports</option>
          <option value="Education">Education</option>
          <option value="Environment">Environment</option>
        </select>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <Button
          text="Cancel"
          variant="primary"
          size="lg"
          onClick={onClose}
          className="!rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 cursor-pointer"
        />
        <Button
          text={isloading ? "Adding..." : "Add Content"}
          variant="secondary"
          size="lg"
          onClick={handleAddContent}
          className="!rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 cursor-pointer"
        />
      </div>
    </div>
  );
}
