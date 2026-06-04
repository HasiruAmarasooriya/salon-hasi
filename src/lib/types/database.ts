export type Role = "ADMIN" | "STAFF" | "CUSTOMER";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type InvoiceStatus =
  | "DRAFT"
  | "PAID"
  | "PARTIAL"
  | "REFUNDED"
  | "CANCELLED";

export type User = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: Role;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  imageUrl: string | null;
  driveFileId: string | null;
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ServiceWithCategory = Service & {
  category: Pick<ServiceCategory, "id" | "slug" | "name" | "sortOrder">;
};

export type Staff = {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  imageUrl: string | null;
  driveFileId: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentServiceLine = {
  id: string;
  serviceId: string;
  price: number;
  service?: { name: string; slug?: string };
};

export type Appointment = {
  id: string;
  customerId: string;
  staffId: string | null;
  scheduledAt: Date;
  status: AppointmentStatus;
  notes: string | null;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  customer?: Pick<User, "name" | "email" | "phone">;
  staff?: Pick<Staff, "name"> | null;
  services?: AppointmentServiceLine[];
  invoice?: Invoice | null;
};

export type InvoiceItem = {
  id: string;
  serviceId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  service?: Service | null;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  appointmentId: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  paidAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer?: Pick<User, "name" | "email" | "phone">;
  appointment?: Appointment | null;
  items?: InvoiceItem[];
};

export type GalleryImage = {
  id: string;
  title: string | null;
  imageUrl: string;
  driveFileId: string | null;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
};
