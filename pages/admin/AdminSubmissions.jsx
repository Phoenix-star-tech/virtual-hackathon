import { useState, useEffect } from "react";
import { getSubmissions, reviewSubmission } from "../../api/admin";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [reviewData, setReviewData] = useState({ status: "approved", score: 0, feedback: "" });

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const params = { page, per_page: 20 };
      if (statusFilter) params.status = statusFilter;
      const data = await getSubmissions(params);
      setSubmissions(data.submissions);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSubmissions(); }, [page, statusFilter]);

  function resetReview() {
    setReviewing(null);
    setReviewData({ status: "approved", score: 0, feedback: "" });
  }

  async function handleReview(id) {
    try {
      await reviewSubmission(id, reviewData);
      resetReview();
      fetchSubmissions();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl text-white tracking-wider">Submissions</h1>
        <span className="text-gray-400 text-sm">{total} total</span>
      </div>

      <div className="mb-4">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {reviewing && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 space-y-4">
          <h3 className="text-white font-medium">Review Submission</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Status</label>
              <select value={reviewData.status} onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Score</label>
              <input type="number" value={reviewData.score} onChange={(e) => setReviewData({ ...reviewData, score: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Feedback</label>
              <input value={reviewData.feedback} onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleReview(reviewing)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm">Submit Review</button>
            <button onClick={resetReview} className="bg-white/5 border border-white/10 text-gray-300 px-6 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Task / Module</th>
              <th className="text-left px-4 py-3">Content</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Score</th>
              <th className="text-left px-4 py-3">Submitted</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center text-gray-500 py-8">Loading...</td></tr>
            ) : submissions.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-gray-500 py-8">No submissions</td></tr>
            ) : submissions.map((s) => (
              <tr key={s.id} className="border-b border-white/5 text-white hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium">{s.submitter_name || "—"}</div>
                  <div className="text-xs text-gray-400">{s.submitter_email || ""}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{s.task_title || "—"}</div>
                  <div className="text-xs text-gray-400">{s.module_name || ""}</div>
                </td>
                <td className="px-4 py-3">
                  {s.answer_type === "quiz" && (
                    <div className="text-xs">
                      <span className="text-gray-400">Answer:</span>
                      <span className="text-white font-medium ml-1">{s.notes || "—"}</span>
                      {s.quiz_options?.length === 4 && (
                        <div className="mt-1 text-gray-500 space-y-0.5">
                          {["A", "B", "C", "D"].map((l, i) => (
                            <div key={l} className={s.notes === l ? "text-brand-purple font-semibold" : ""}>
                              {l}. {s.quiz_options[i]}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {s.answer_type === "link" && s.notes && (
                    <a href={s.notes} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline block">{s.notes}</a>
                  )}
                  {s.answer_type === "description" && (
                    <div className="text-xs text-gray-300">{s.notes || "—"}</div>
                  )}
                  {s.answer_type === "image" && s.files?.length > 0 && s.files.map((f, i) => (
                    <a key={i} href={f} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline block">📎 View file</a>
                  ))}
                  {!s.notes && (!s.files || s.files.length === 0) && <span className="text-xs text-gray-500">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    s.status === "approved" ? "bg-green-500/20 text-green-400" :
                    s.status === "rejected" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>{s.status}</span>
                </td>
                <td className="px-4 py-3">{s.score ?? "—"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3 text-right">
                  {s.status === "pending" && <button onClick={() => setReviewing(s.id)} className="text-blue-400 hover:text-blue-300 text-xs">Review</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 hover:bg-white/10 text-sm">Prev</button>
          <span className="text-gray-400 text-sm">Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 hover:bg-white/10 text-sm">Next</button>
        </div>
      )}
    </div>
  );
}
