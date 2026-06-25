import { Timestamp } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type {
  Appointment,
  AppointmentServiceLine,
  AppointmentStatus,
  ContactMessage,
  GalleryImage,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  Role,
  Service,
  ServiceCategory,
  ServiceWithCategory,
  Staff,
  User,
} from "@/lib/types/database";
import { COLLECTIONS, newId, timestampNow, toDate } from "@/lib/firestore/utils";

function db() {
  return getAdminFirestore();
}

// ——— Users ———

function mapUser(id: string, data: FirebaseFirestore.DocumentData): User {
  return {
    id,
    email: data.email,
    name: data.name ?? null,
    phone: data.phone ?? null,
    role: data.role as Role,
    image: data.image ?? null,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const snap = await db()
    .collection(COLLECTIONS.users)
    .where("email", "==", email.toLowerCase().trim())
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapUser(doc.id, doc.data()!);
}

export async function findUserById(id: string): Promise<User | null> {
  const doc = await db().collection(COLLECTIONS.users).doc(id).get();
  if (!doc.exists) return null;
  return mapUser(doc.id, doc.data()!);
}

export async function createUserProfile(
  id: string,
  data: Omit<User, "id" | "createdAt" | "updatedAt">,
): Promise<User> {
  const now = timestampNow();
  const payload = { ...data, createdAt: now, updatedAt: now };
  await db().collection(COLLECTIONS.users).doc(id).set(payload);
  return mapUser(id, payload);
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, "name" | "phone" | "role" | "image">>,
): Promise<User> {
  const ref = db().collection(COLLECTIONS.users).doc(id);
  await ref.update({ ...data, updatedAt: timestampNow() });
  const doc = await ref.get();
  return mapUser(doc.id, doc.data()!);
}

// ——— Service categories ———

function mapCategory(id: string, data: FirebaseFirestore.DocumentData): ServiceCategory {
  return {
    id,
    slug: data.slug,
    name: data.name,
    description: data.description ?? null,
    icon: data.icon ?? null,
    imageUrl: data.imageUrl ?? null,
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listActiveCategories(): Promise<ServiceCategory[]> {
  const snap = await db()
    .collection(COLLECTIONS.serviceCategories)
    .where("isActive", "==", true)
    .get();
  return snap.docs
    .map((d) => mapCategory(d.id, d.data()))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listAllCategories(): Promise<ServiceCategory[]> {
  const snap = await db().collection(COLLECTIONS.serviceCategories).get();
  return snap.docs
    .map((d) => mapCategory(d.id, d.data()))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function findCategoryById(id: string): Promise<ServiceCategory | null> {
  const doc = await db().collection(COLLECTIONS.serviceCategories).doc(id).get();
  if (!doc.exists) return null;
  return mapCategory(doc.id, doc.data()!);
}

export async function findCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
  const snap = await db()
    .collection(COLLECTIONS.serviceCategories)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapCategory(doc.id, doc.data()!);
}

export async function createCategory(
  data: Omit<ServiceCategory, "id" | "createdAt" | "updatedAt">,
): Promise<ServiceCategory> {
  const id = newId();
  const now = timestampNow();
  const payload = { ...data, createdAt: now, updatedAt: now };
  await db().collection(COLLECTIONS.serviceCategories).doc(id).set(payload);
  return mapCategory(id, payload);
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<ServiceCategory, "id" | "createdAt" | "updatedAt">>,
): Promise<ServiceCategory> {
  const ref = db().collection(COLLECTIONS.serviceCategories).doc(id);
  await ref.update({ ...data, updatedAt: timestampNow() });
  const doc = await ref.get();
  return mapCategory(doc.id, doc.data()!);
}

export async function deleteCategory(id: string): Promise<void> {
  await db().collection(COLLECTIONS.serviceCategories).doc(id).delete();
}

// ——— Services ———

function mapService(id: string, data: FirebaseFirestore.DocumentData): Service {
  return {
    id,
    slug: data.slug,
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    durationMin: data.durationMin ?? 30,
    imageUrl: data.imageUrl ?? null,
    driveFileId: data.driveFileId ?? null,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 0,
    categoryId: data.categoryId,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

async function attachCategory(service: Service): Promise<ServiceWithCategory> {
  const category = await findCategoryById(service.categoryId);
  return {
    ...service,
    category: {
      id: category?.id ?? service.categoryId,
      slug: category?.slug ?? "",
      name: category?.name ?? "",
      sortOrder: category?.sortOrder ?? 0,
    },
  };
}

export async function listActiveServices(): Promise<ServiceWithCategory[]> {
  const snap = await db()
    .collection(COLLECTIONS.services)
    .where("isActive", "==", true)
    .get();
  const services = snap.docs.map((d) => mapService(d.id, d.data()));
  const withCat = await Promise.all(services.map(attachCategory));
  return withCat.sort(
    (a, b) =>
      a.category.sortOrder - b.category.sortOrder ||
      a.sortOrder - b.sortOrder,
  );
}

export async function listAllServices(): Promise<ServiceWithCategory[]> {
  const snap = await db().collection(COLLECTIONS.services).get();
  const services = snap.docs.map((d) => mapService(d.id, d.data()));
  const withCat = await Promise.all(services.map(attachCategory));
  return withCat.sort((a, b) => a.category.name.localeCompare(b.category.name));
}

export async function findServiceBySlug(slug: string): Promise<Service | null> {
  const snap = await db()
    .collection(COLLECTIONS.services)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapService(doc.id, doc.data()!);
}

export async function findActiveServiceBySlug(slug: string): Promise<Service | null> {
  const snap = await db()
    .collection(COLLECTIONS.services)
    .where("slug", "==", slug)
    .where("isActive", "==", true)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapService(doc.id, doc.data()!);
}

export async function findServiceById(id: string): Promise<Service | null> {
  const doc = await db().collection(COLLECTIONS.services).doc(id).get();
  if (!doc.exists) return null;
  return mapService(doc.id, doc.data()!);
}

export async function serviceSlugExists(slug: string): Promise<boolean> {
  const s = await findServiceBySlug(slug);
  return !!s;
}

export async function createService(
  data: Omit<Service, "id" | "createdAt" | "updatedAt">,
): Promise<ServiceWithCategory> {
  const id = newId();
  const now = timestampNow();
  const payload = { ...data, createdAt: now, updatedAt: now };
  await db().collection(COLLECTIONS.services).doc(id).set(payload);
  return attachCategory(mapService(id, payload));
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>,
): Promise<ServiceWithCategory> {
  const ref = db().collection(COLLECTIONS.services).doc(id);
  await ref.update({ ...data, updatedAt: timestampNow() });
  const doc = await ref.get();
  return attachCategory(mapService(doc.id, doc.data()!));
}

export async function deleteService(id: string): Promise<void> {
  await db().collection(COLLECTIONS.services).doc(id).delete();
}

export async function countAppointmentsWithService(serviceId: string): Promise<number> {
  const snap = await db().collection(COLLECTIONS.appointments).get();
  return snap.docs.filter((d) =>
    (d.data().services as AppointmentServiceLine[] | undefined)?.some(
      (s) => s.serviceId === serviceId,
    ),
  ).length;
}

// ——— Staff ———

function mapStaff(id: string, data: FirebaseFirestore.DocumentData): Staff {
  return {
    id,
    name: data.name,
    title: data.title ?? null,
    bio: data.bio ?? null,
    imageUrl: data.imageUrl ?? null,
    driveFileId: data.driveFileId ?? null,
    phone: data.phone ?? null,
    isActive: data.isActive ?? true,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listActiveStaff(): Promise<Staff[]> {
  const snap = await db()
    .collection(COLLECTIONS.staff)
    .where("isActive", "==", true)
    .get();
  return snap.docs
    .map((d) => mapStaff(d.id, d.data()))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function listAllStaff(): Promise<Staff[]> {
  const snap = await db().collection(COLLECTIONS.staff).get();
  return snap.docs.map((d) => mapStaff(d.id, d.data()));
}

export async function findStaffById(id: string): Promise<Staff | null> {
  const doc = await db().collection(COLLECTIONS.staff).doc(id).get();
  if (!doc.exists) return null;
  return mapStaff(doc.id, doc.data()!);
}

export async function findActiveStaffById(id: string): Promise<Staff | null> {
  const staff = await findStaffById(id);
  if (!staff?.isActive) return null;
  return staff;
}

export async function findStaffByName(name: string): Promise<Staff | null> {
  const snap = await db()
    .collection(COLLECTIONS.staff)
    .where("name", "==", name)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapStaff(doc.id, doc.data()!);
}

export async function createStaff(
  data: Omit<Staff, "id" | "createdAt" | "updatedAt">,
): Promise<Staff> {
  const id = newId();
  const now = timestampNow();
  const payload = { ...data, createdAt: now, updatedAt: now };
  await db().collection(COLLECTIONS.staff).doc(id).set(payload);
  return mapStaff(id, payload);
}

export async function updateStaff(
  id: string,
  data: Partial<Omit<Staff, "id" | "createdAt" | "updatedAt">>,
): Promise<Staff> {
  const ref = db().collection(COLLECTIONS.staff).doc(id);
  await ref.update({ ...data, updatedAt: timestampNow() });
  const doc = await ref.get();
  return mapStaff(doc.id, doc.data()!);
}

export async function deleteStaff(id: string): Promise<void> {
  await db().collection(COLLECTIONS.staff).doc(id).delete();
}

export async function countAppointmentsForStaff(staffId: string): Promise<number> {
  const snap = await db()
    .collection(COLLECTIONS.appointments)
    .where("staffId", "==", staffId)
    .get();
  return snap.size;
}

// ——— Appointments ———

function mapAppointmentLine(raw: FirebaseFirestore.DocumentData): AppointmentServiceLine {
  return {
    id: raw.id ?? newId(),
    serviceId: raw.serviceId,
    price: raw.price,
    service: raw.serviceName
      ? { name: raw.serviceName, slug: raw.serviceSlug }
      : undefined,
  };
}

async function enrichAppointment(
  id: string,
  data: FirebaseFirestore.DocumentData,
  options?: { includeCustomer?: boolean; includeStaff?: boolean; includeServices?: boolean },
): Promise<Appointment> {
  const apt: Appointment = {
    id,
    customerId: data.customerId,
    staffId: data.staffId ?? null,
    scheduledAt: toDate(data.scheduledAt),
    status: data.status as AppointmentStatus,
    notes: data.notes ?? null,
    totalAmount: data.totalAmount ?? 0,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };

  if (options?.includeCustomer) {
    const customer = await findUserById(data.customerId);
    if (customer) {
      apt.customer = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      };
    }
  }

  if (options?.includeStaff && data.staffId) {
    const staff = await findStaffById(data.staffId);
    if (staff) apt.staff = { name: staff.name };
  }

  if (options?.includeServices) {
    const lines = (data.services as FirebaseFirestore.DocumentData[] | undefined) ?? [];
    apt.services = lines.map(mapAppointmentLine);
  }

  return apt;
}

export async function listAppointments(options: {
  customerId?: string;
  limit?: number;
  includeRelations?: boolean;
}): Promise<Appointment[]> {
  let query: FirebaseFirestore.Query = db().collection(COLLECTIONS.appointments);
  if (options.customerId) {
    query = query.where("customerId", "==", options.customerId);
  }
  const snap = await query.get();
  let docs = snap.docs;
  docs = docs.sort(
    (a, b) => toDate(b.data().scheduledAt).getTime() - toDate(a.data().scheduledAt).getTime(),
  );
  if (options.limit) docs = docs.slice(0, options.limit);

  return Promise.all(
    docs.map((d) =>
      enrichAppointment(d.id, d.data(), {
        includeCustomer: options.includeRelations,
        includeStaff: options.includeRelations,
        includeServices: options.includeRelations,
      }),
    ),
  );
}

export async function findAppointmentById(
  id: string,
  options?: { includeRelations?: boolean },
): Promise<Appointment | null> {
  const doc = await db().collection(COLLECTIONS.appointments).doc(id).get();
  if (!doc.exists) return null;
  return enrichAppointment(doc.id, doc.data()!, {
    includeCustomer: options?.includeRelations,
    includeStaff: options?.includeRelations,
    includeServices: options?.includeRelations,
  });
}

export async function createAppointment(data: {
  customerId: string;
  staffId: string | null;
  scheduledAt: Date;
  notes: string | null;
  totalAmount: number;
  status: AppointmentStatus;
  services: { serviceId: string; price: number; serviceName: string }[];
}): Promise<Appointment> {
  const id = newId();
  const now = timestampNow();
  const services = data.services.map((s) => ({
    id: newId(),
    serviceId: s.serviceId,
    price: s.price,
    serviceName: s.serviceName,
  }));
  const payload = {
    customerId: data.customerId,
    staffId: data.staffId,
    scheduledAt: Timestamp.fromDate(data.scheduledAt),
    notes: data.notes,
    totalAmount: data.totalAmount,
    status: data.status,
    services,
    invoiceId: null,
    createdAt: now,
    updatedAt: now,
  };
  await db().collection(COLLECTIONS.appointments).doc(id).set(payload);
  return enrichAppointment(id, payload, { includeServices: true });
}

export async function updateAppointment(
  id: string,
  data: Partial<{
    status: AppointmentStatus;
    staffId: string | null;
    notes: string | null;
    scheduledAt: Date;
    totalAmount: number;
    invoiceId: string | null;
  }>,
): Promise<Appointment> {
  const ref = db().collection(COLLECTIONS.appointments).doc(id);
  const update: Record<string, unknown> = { ...data, updatedAt: timestampNow() };
  if (data.scheduledAt) update.scheduledAt = Timestamp.fromDate(data.scheduledAt);
  await ref.update(update);
  const doc = await ref.get();
  return enrichAppointment(doc.id, doc.data()!, { includeServices: true });
}

export async function countAppointments(): Promise<number> {
  const snap = await db().collection(COLLECTIONS.appointments).get();
  return snap.size;
}

export async function sumAppointmentTotals(): Promise<number> {
  const snap = await db().collection(COLLECTIONS.appointments).get();
  return snap.docs.reduce((sum, d) => sum + (d.data().totalAmount ?? 0), 0);
}

// ——— Invoices ———

function mapInvoiceItem(raw: FirebaseFirestore.DocumentData): InvoiceItem {
  return {
    id: raw.id ?? newId(),
    serviceId: raw.serviceId ?? null,
    description: raw.description,
    quantity: raw.quantity ?? 1,
    unitPrice: raw.unitPrice,
    total: raw.total,
  };
}

function mapInvoice(id: string, data: FirebaseFirestore.DocumentData): Invoice {
  const items = (data.items as FirebaseFirestore.DocumentData[] | undefined)?.map(
    mapInvoiceItem,
  );
  return {
    id,
    invoiceNumber: data.invoiceNumber,
    customerId: data.customerId,
    appointmentId: data.appointmentId ?? null,
    subtotal: data.subtotal,
    tax: data.tax ?? 0,
    discount: data.discount ?? 0,
    total: data.total,
    status: data.status as InvoiceStatus,
    paidAt: data.paidAt ? toDate(data.paidAt) : null,
    notes: data.notes ?? null,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    items,
  };
}

export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `SH-${year}-`;
  const snap = await db().collection(COLLECTIONS.invoices).get();
  const numbers = snap.docs
    .map((d) => d.data().invoiceNumber as string)
    .filter((n) => n.startsWith(prefix))
    .sort()
    .reverse();
  const latest = numbers[0];
  const next = latest ? parseInt(latest.slice(prefix.length), 10) + 1 : 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

export async function findInvoiceById(
  id: string,
  options?: { includeCustomer?: boolean; includeItems?: boolean },
): Promise<Invoice | null> {
  const doc = await db().collection(COLLECTIONS.invoices).doc(id).get();
  if (!doc.exists) return null;
  const invoice = mapInvoice(doc.id, doc.data()!);
  if (options?.includeCustomer) {
    const customer = await findUserById(invoice.customerId);
    if (customer) {
      invoice.customer = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      };
    }
  }
  return invoice;
}

export async function findInvoiceByAppointmentId(
  appointmentId: string,
): Promise<Invoice | null> {
  const snap = await db()
    .collection(COLLECTIONS.invoices)
    .where("appointmentId", "==", appointmentId)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapInvoice(doc.id, doc.data()!);
}

export async function listInvoices(options?: {
  includeCustomer?: boolean;
}): Promise<Invoice[]> {
  const snap = await db().collection(COLLECTIONS.invoices).get();
  const invoices = snap.docs
    .map((d) => mapInvoice(d.id, d.data()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (options?.includeCustomer) {
    for (const inv of invoices) {
      const customer = await findUserById(inv.customerId);
      if (customer) {
        inv.customer = {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        };
      }
    }
  }
  return invoices;
}

export async function createInvoice(data: {
  invoiceNumber: string;
  customerId: string;
  appointmentId: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  items: Omit<InvoiceItem, "id">[];
}): Promise<Invoice> {
  const id = newId();
  const now = timestampNow();
  const items = data.items.map((item) => ({ ...item, id: newId() }));
  const payload = {
    ...data,
    items,
    paidAt: null,
    notes: null,
    createdAt: now,
    updatedAt: now,
  };
  await db().collection(COLLECTIONS.invoices).doc(id).set(payload);
  if (data.appointmentId) {
    await db()
      .collection(COLLECTIONS.appointments)
      .doc(data.appointmentId)
      .update({ invoiceId: id, updatedAt: timestampNow() });
  }
  return mapInvoice(id, payload);
}

export async function updateInvoice(
  id: string,
  data: Partial<{
    status: InvoiceStatus;
    paidAt: Date | null;
    notes: string | null;
  }>,
): Promise<Invoice> {
  const ref = db().collection(COLLECTIONS.invoices).doc(id);
  const update: Record<string, unknown> = { ...data, updatedAt: timestampNow() };
  if (data.paidAt) update.paidAt = Timestamp.fromDate(data.paidAt);
  await ref.update(update);
  const doc = await ref.get();
  return mapInvoice(doc.id, doc.data()!);
}

export async function getAppointmentForInvoice(
  appointmentId: string,
): Promise<Appointment | null> {
  const doc = await db().collection(COLLECTIONS.appointments).doc(appointmentId).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  const apt = await enrichAppointment(doc.id, data, { includeServices: true });
  const invoice = await findInvoiceByAppointmentId(appointmentId);
  apt.invoice = invoice;
  return apt;
}

export async function listBillableAppointments(): Promise<Appointment[]> {
  const snap = await db().collection(COLLECTIONS.appointments).get();
  const result: Appointment[] = [];
  for (const d of snap.docs) {
    if (d.data().invoiceId) continue;
    const status = d.data().status as AppointmentStatus;
    if (!["COMPLETED", "CONFIRMED", "IN_PROGRESS"].includes(status)) continue;
    result.push(
      await enrichAppointment(d.id, d.data(), {
        includeCustomer: true,
        includeServices: true,
      }),
    );
  }
  return result.sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());
}

// ——— Gallery ———

function mapGallery(id: string, data: FirebaseFirestore.DocumentData): GalleryImage {
  return {
    id,
    title: data.title ?? null,
    imageUrl: data.imageUrl,
    driveFileId: data.driveFileId ?? null,
    category: data.category ?? null,
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
    createdAt: toDate(data.createdAt),
  };
}

export async function listActiveGalleryImages(): Promise<GalleryImage[]> {
  const snap = await db()
    .collection(COLLECTIONS.galleryImages)
    .where("isActive", "==", true)
    .get();
  return snap.docs
    .map((d) => mapGallery(d.id, d.data()))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listAllGalleryImages(): Promise<GalleryImage[]> {
  const snap = await db().collection(COLLECTIONS.galleryImages).get();
  return snap.docs
    .map((d) => mapGallery(d.id, d.data()))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function findGalleryById(id: string): Promise<GalleryImage | null> {
  const doc = await db().collection(COLLECTIONS.galleryImages).doc(id).get();
  if (!doc.exists) return null;
  return mapGallery(doc.id, doc.data()!);
}

export async function findGalleryByImageUrl(url: string): Promise<GalleryImage | null> {
  const snap = await db()
    .collection(COLLECTIONS.galleryImages)
    .where("imageUrl", "==", url)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapGallery(doc.id, doc.data()!);
}

export async function createGalleryImage(
  data: Omit<GalleryImage, "id" | "createdAt">,
): Promise<GalleryImage> {
  const id = newId();
  const payload = { ...data, createdAt: timestampNow() };
  await db().collection(COLLECTIONS.galleryImages).doc(id).set(payload);
  return mapGallery(id, payload);
}

export async function updateGalleryImage(
  id: string,
  data: Partial<Omit<GalleryImage, "id" | "createdAt">>,
): Promise<GalleryImage> {
  const ref = db().collection(COLLECTIONS.galleryImages).doc(id);
  await ref.update(data);
  const doc = await ref.get();
  return mapGallery(doc.id, doc.data()!);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await db().collection(COLLECTIONS.galleryImages).doc(id).delete();
}

// ——— Site settings ———

export async function getSiteSetting(key: string): Promise<string | null> {
  const doc = await db().collection(COLLECTIONS.siteSettings).doc(key).get();
  if (!doc.exists) return null;
  return (doc.data()?.value as string) ?? null;
}

export async function getSiteSettingsByKeys(
  keys: string[],
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  await Promise.all(
    keys.map(async (key) => {
      const value = await getSiteSetting(key);
      if (value !== null) result[key] = value;
    }),
  );
  return result;
}

export async function upsertSiteSetting(key: string, value: string): Promise<void> {
  await db().collection(COLLECTIONS.siteSettings).doc(key).set({ key, value });
}

// ——— Contact messages ———

function mapMessage(id: string, data: FirebaseFirestore.DocumentData): ContactMessage {
  return {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message,
    isRead: data.isRead ?? false,
    createdAt: toDate(data.createdAt),
  };
}

export async function createContactMessage(
  data: Omit<ContactMessage, "id" | "isRead" | "createdAt">,
): Promise<ContactMessage> {
  const id = newId();
  const payload = { ...data, isRead: false, createdAt: timestampNow() };
  await db().collection(COLLECTIONS.contactMessages).doc(id).set(payload);
  return mapMessage(id, payload);
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const snap = await db().collection(COLLECTIONS.contactMessages).get();
  return snap.docs
    .map((d) => mapMessage(d.id, d.data()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function markAllMessagesRead(): Promise<void> {
  const snap = await db()
    .collection(COLLECTIONS.contactMessages)
    .where("isRead", "==", false)
    .get();
  const batch = db().batch();
  snap.docs.forEach((d) => batch.update(d.ref, { isRead: true }));
  await batch.commit();
}

export async function deleteContactMessage(id: string): Promise<void> {
  await db().collection(COLLECTIONS.contactMessages).doc(id).delete();
}

export async function countUnreadMessages(): Promise<number> {
  const snap = await db()
    .collection(COLLECTIONS.contactMessages)
    .where("isRead", "==", false)
    .get();
  return snap.size;
}

export async function countServices(): Promise<number> {
  const snap = await db().collection(COLLECTIONS.services).get();
  return snap.size;
}

export async function countStaff(): Promise<number> {
  const snap = await db().collection(COLLECTIONS.staff).get();
  return snap.size;
}
