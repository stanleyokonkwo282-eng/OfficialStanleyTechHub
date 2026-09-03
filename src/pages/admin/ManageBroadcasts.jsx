import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, CheckCircle2, Trash2, Power, PowerOff } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoaderSpinner from "../../components/common/LoaderSpinner";

const BADGE_OPTIONS = [
  { value: "from-amber-400 to-amber-600", label: "Gold" },
  { value: "from-amber-300 to-amber-500", label: "Light Gold" },
  { value: "from-amber-400 to-orange-500", label: "Amber Orange" },
];

const emptyForm = {
  type: "ad",
  sponsorName: "",
  title: "",
  tagline: "",
  description: "",
  ctaText: "Learn More",
  ctaLink: "",
  badgeColor: "from-amber-400 to-amber-600",
};

export default function ManageBroadcasts() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(emptyForm);
  const [success, setSuccess] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["broadcasts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/broadcasts");
      return res.data?.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.post("/broadcasts", payload);
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setFormData(emptyForm);
      queryClient.invalidateQueries(["broadcasts"]);
      queryClient.invalidateQueries(["active-broadcasts"]);
      toast.success("Campaign published to home feed!");
      setTimeout(() => setSuccess(false), 4000);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to publish"
      );
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      const res = await axiosSecure.patch(`/broadcasts/${id}`, { isActive });
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries(["broadcasts"]);
      queryClient.invalidateQueries(["active-broadcasts"]);
      toast.success(
        vars.isActive ? "Campaign activated" : "Campaign deactivated"
      );
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/broadcasts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["broadcasts"]);
      queryClient.invalidateQueries(["active-broadcasts"]);
      toast.success("Campaign deleted");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const confirmDelete = (id, title) => {
    Swal.fire({
      title: "Delete this campaign?",
      text: `"${title}" will be removed permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto text-white">
      <h1 className="text-2xl font-black mb-2">Broadcast & Sponsored Hub</h1>
      <p className="text-sm text-neutral-400 mb-8">
        Publish sponsored campaigns, daily academy alerts, or discount drops to
        the home feed instantly.
      </p>

      <div className="bg-zinc-900/80 border border-amber-400/15 rounded-2xl p-6 md:p-8 mb-10">
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5" /> Campaign published directly to
            home feed!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                Campaign Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-sm"
              >
                <option value="ad">General Ad</option>
                <option value="sponsor">Sponsored Brand</option>
                <option value="update">Academy Update</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                Sponsor / Brand Name
              </label>
              <input
                type="text"
                placeholder="e.g. PixelCraft"
                value={formData.sponsorName}
                onChange={(e) =>
                  setFormData({ ...formData, sponsorName: e.target.value })
                }
                className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
              Campaign Title
            </label>
            <input
              required
              type="text"
              placeholder="e.g. 50% Off 3D Blender Assets Pack"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
              Tagline Subheading
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Level up your design workflow"
              value={formData.tagline}
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
              className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Details about the offer, discount codes, or update summary..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                Button Label
              </label>
              <input
                required
                type="text"
                value={formData.ctaText}
                onChange={(e) =>
                  setFormData({ ...formData, ctaText: e.target.value })
                }
                className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                Target Link (URL)
              </label>
              <input
                required
                type="text"
                placeholder="https://... or /courses"
                value={formData.ctaLink}
                onChange={(e) =>
                  setFormData({ ...formData, ctaLink: e.target.value })
                }
                className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
              Badge Color
            </label>
            <select
              value={formData.badgeColor}
              onChange={(e) =>
                setFormData({ ...formData, badgeColor: e.target.value })
              }
              className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-sm"
            >
              {BADGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full mt-4 py-3 bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {createMutation.isPending ? (
              "Publishing..."
            ) : (
              <>
                <Send className="w-4 h-4" /> Publish to Live Feed
              </>
            )}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Existing Campaigns</h2>
        {isLoading ? (
          <LoaderSpinner />
        ) : !data || data.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-sm">
            No campaigns yet. Publish your first one above.
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item) => (
              <div
                key={item._id}
                className={`p-4 rounded-xl border ${
                  item.isActive
                    ? "bg-zinc-900 border-amber-400/20"
                    : "bg-zinc-950 border-white/5 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-gradient-to-r ${item.badgeColor} text-black`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      {!item.isActive && (
                        <span className="text-[10px] text-rose-400 font-bold uppercase">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-sm truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {item.tagline}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        toggleMutation.mutate({
                          id: item._id,
                          isActive: !item.isActive,
                        })
                      }
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
                      title={item.isActive ? "Deactivate" : "Activate"}
                    >
                      {item.isActive ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                    <button
                      onClick={() => confirmDelete(item._id, item.title)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
