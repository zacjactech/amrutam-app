// Navigation Types and Route Definitions

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  EmailVerification: { email: string; name?: string };
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Consultations: undefined;
  Shop: undefined;
  HealthRecords: undefined;
  Profile: undefined;
};

export type ConsultationStackParamList = {
  ConsultationHome: undefined;
  DoctorList: undefined;
  DoctorSearch: undefined;
  DoctorDetails: { doctorId: string };
  SlotSelection: { doctorId: string };
  BookingConfirmation: {
    doctorId: string;
    slot: {
      id: string;
      doctorId: string;
      startTime: string;
      endTime: string;
      isBooked: boolean;
      consultationType: 'video' | 'audio' | 'chat' | 'in-person';
    };
  };
  BookingSuccess: {
    bookingId: string;
    doctorId: string;
    slot: {
      id: string;
      doctorId: string;
      startTime: string;
      endTime: string;
      isBooked: boolean;
      consultationType: 'video' | 'audio' | 'chat' | 'in-person';
    };
  };
  UpcomingConsultations: undefined;
  ConsultationDetails: { bookingId: string };
  CancellationSuccess: { doctorName: string };
};

export type ShopStackParamList = {
  ShopHome: undefined;
  ProductList: undefined;
  ProductSearch: undefined;
  ProductDetails: { productId: string };
  Wishlist: undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: undefined;
  OrderFailed: undefined;
};

export type HealthRecordsStackParamList = {
  Timeline: undefined;
  RecordDetail: { recordId: string };
  AttachmentPreview: {
    attachment: {
      id: string;
      name: string;
      mimeType: 'image/jpeg' | 'image/png' | 'application/pdf';
      thumbnailUrl: string | undefined;
      uri: string | undefined;
      sizeBytes: number | undefined;
    };
  };
  RecordSearch: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  Notifications: undefined;
};
