// Navigation Types and Route Definitions

export type RootStackParamList = {
  MainTabs: undefined;
  DoctorDetails: { doctorId: string };
  ProductDetails: { productId: string };
  BookingConfirmation: { bookingId: string };
  ConsultationDetails: { bookingId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Consultations: undefined;
  Shop: undefined;
  HealthRecords: undefined;
};

export type ConsultationStackParamList = {
  DoctorList: undefined;
  DoctorDetails: { doctorId: string };
  SlotPicker: { doctorId: string };
  BookingConfirmation: { bookingId: string };
  UpcomingConsultations: undefined;
  ConsultationDetails: { bookingId: string };
};

export type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  Wishlist: undefined;
};

export type HealthRecordsStackParamList = {
  Timeline: undefined;
  RecordDetails: { recordId: string };
  AttachmentPreview: { attachment: { id: string; name: string; mimeType: 'image/jpeg' | 'image/png' | 'application/pdf'; thumbnailUrl: string | undefined; uri: string | undefined; sizeBytes: number | undefined } };
};
