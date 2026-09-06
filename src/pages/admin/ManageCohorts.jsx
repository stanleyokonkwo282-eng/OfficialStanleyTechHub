import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ManageCohorts() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", slug: "", description: "", courseId: "", whatsappGroupLink: "", whatsappGroupId: "", maxMembers: 500 });
  const [editingId, setEditingId] = useState(null);

  const { data: cohortsData, isLoading } = useQuery({
    queryKey: ["all-cohorts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/cohorts");
      return res.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/cohorts", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cohort created");
      setForm({ name: "", slug: "", description: "", courseId: "", whatsappGroupLink: "", whatsappGroupId: "", maxMembers: 500 });
      queryClient.invalidateQueries(["all-cohorts"]);
    },
    onError: () => toast.error("Failed to create cohort"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(`/cohorts/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cohort updated");
      setEditingId(null);
      setForm({ name: "", slug: "", description: "", courseId: "", whatsappGroupLink: "", whatsappGroupId: "", maxMembers: 500 });
      queryClient.invalidateQueries(["all-cohorts"]);
    },
    onError: () => toast.error("Failed to update cohort"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/cohorts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cohort deleted");
      queryClient.invalidateQueries(["all-cohorts"]);
    },
    onError: () => toast.error("Failed to delete cohort"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const startEdit = (cohort) => {
    setEditingId(cohort._id);
    setForm({
      name: cohort.name,
      slug: cohort.slug,
      description: cohort.description || "",
      courseId: cohort.courseId,
      whatsappGroupLink: cohort.whatsappGroupLink,
      whatsappGroupId: cohort.whatsappGroupId || "",
      maxMembers: cohort.maxMembers || 500,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", courseId: "", whatsappGroupLink: "", whatsappGroupId: "", maxMembers: 500 });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">🎓 Manage Cohorts</h1>

        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">{editingId ? "Edit Cohort" : "Create Cohort"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Cohort Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Slug (unique)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Course ID"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="WhatsApp Group Link"
              value={form.whatsappGroupLink}
              onChange={(e) => setForm({ ...form, whatsappGroupLink: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="WhatsApp Group ID (optional)"
              value={form.whatsappGroupId}
              onChange={(e) => setForm({ ...form, whatsappGroupId: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max Members"
              value={form.maxMembers}
              onChange={(e) => setForm({ ...form, maxMembers: parseInt(e.target.value) || 500 })}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm md:col-span-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-lg font-bold text-white">All Cohorts</h2>
          </div>
          {isLoading && <div className="p-8 text-center text-gray-400">Loading...</div>}
          {!isLoading && cohortsData?.length === 0 && <div className="p-8 text-center text-gray-400">No cohorts yet.</div>}
          <div className="divide-y divide-zinc-800">
            {cohortsData?.map((cohort) => (
              <div key={cohort._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-white font-medium">{cohort.name}</p>
                  <p className="text-xs text-gray-400">{cohort.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {cohort.memberCount || 0} / {cohort.maxMembers || 500} members • {cohort.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(cohort)} className="px-3 py-1 bg-zinc-800 text-white rounded-lg text-sm hover:bg-zinc-700">
                    Edit
                  </button>
                  <button onClick={() => deleteMutation.mutate(cohort._id)} className="px-3 py-1 bg-red-900 text-red-300 rounded-lg text-sm hover:bg-red-800">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
