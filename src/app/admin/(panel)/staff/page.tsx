import { prisma } from "@/lib/db";
import { StaffManager } from "@/components/admin/StaffManager";

export default async function AdminStaffPage() {
  const staff = await prisma.staff.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Staff</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Add, edit, or remove team members for appointments.
        </p>
      </div>

      <StaffManager initialStaff={staff} />
    </div>
  );
}
