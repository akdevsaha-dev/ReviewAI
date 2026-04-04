export function getRiskColor(score: number) {
  if (score >= 70) return "bg-red-500/20 text-red-400 border-red-500/40";
  if (score >= 40)
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
  return "bg-green-500/20 text-green-400 border-green-500/40";
}

export function getStatusColor(status: string) {
  if (status === "Open") return "bg-green-500/20 text-green-400";
  if (status === "Merged") return "bg-purple-500/20 text-purple-400";
  return "bg-gray-500/20 text-gray-400";
}
