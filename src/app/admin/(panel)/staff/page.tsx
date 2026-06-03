import { prisma } from "@/lib/db";

export default async function AdminStaffPage() {
  const staff = await prisma.staff.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Staff</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Team members available for appointment assignment.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <p className="font-semibold text-zinc-900">{member.name}</p>
            {member.title && (
              <p className="mt-1 text-sm text-amber-700">{member.title}</p>
            )}
            {member.bio && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                {member.bio}
              </p>
            )}
            <p className="mt-4 text-xs text-zinc-400">
              {member.isActive ? "Active" : "Inactive"}
              {member.phone ? ` · ${member.phone}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
