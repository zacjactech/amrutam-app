// Navigation Configuration

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import {
  RootStackParamList,
  MainTabParamList,
  ConsultationStackParamList,
  ShopStackParamList,
  HealthRecordsStackParamList,
  ProfileStackParamList,
} from './types';
import type { RouteProp, NavigationProp } from '@react-navigation/native';
import { useThemeColors } from '../shared/components/ThemeProvider';

import { SplashScreen } from '../features/auth/screens/SplashScreen';
import { OnboardingScreen } from '../features/auth/screens/OnboardingScreen';
import { SignInScreen } from '../features/auth/screens/SignInScreen';
import { SignUpScreen } from '../features/auth/screens/SignUpScreen';
import { OTPVerificationScreen } from '../features/auth/screens/OTPVerificationScreen';
import { HomeDashboardScreen } from '../features/home/screens/HomeDashboardScreen';

import { ConsultationHomeScreen } from '../features/consultation/screens/ConsultationHomeScreen';
import { DoctorListScreen } from '../features/consultation/screens/DoctorListScreen';
import { DoctorSearchScreen } from '../features/consultation/screens/DoctorSearchScreen';
import { DoctorDetailsScreen } from '../features/consultation/screens/DoctorDetailsScreen';
import { SlotSelectionScreen } from '../features/consultation/screens/SlotSelectionScreen';
import { BookingConfirmationScreen } from '../features/consultation/screens/BookingConfirmationScreen';
import { BookingSuccessScreen } from '../features/consultation/screens/BookingSuccessScreen';
import { UpcomingConsultationsScreen } from '../features/consultation/screens/UpcomingConsultationsScreen';
import { ConsultationDetailsScreen } from '../features/consultation/screens/ConsultationDetailsScreen';
import { CancellationSuccessScreen } from '../features/consultation/screens/CancellationSuccessScreen';
import { BookingConflictModal } from '../features/consultation/screens/BookingConflictModal';
import { SlotExpiredModal } from '../features/consultation/screens/SlotExpiredModal';
import { CancelConsultationSheet } from '../features/consultation/screens/CancelConsultationSheet';
import { useDoctor } from '../features/consultation/hooks';

import { ShopHomeScreen } from '../features/shop/screens/ShopHomeScreen';
import { ProductListScreen } from '../features/shop/screens/ProductListScreen';
import { ProductSearchScreen } from '../features/shop/screens/ProductSearchScreen';
import { ProductDetailsScreen } from '../features/shop/screens/ProductDetailsScreen';
import { WishlistScreen } from '../features/shop/screens/WishlistScreen';
import { CartScreen } from '../features/shop/screens/CartScreen';
import { CheckoutScreen } from '../features/shop/screens/CheckoutScreen';
import { OrderSuccessScreen } from '../features/shop/screens/OrderSuccessScreen';
import { OrderFailedScreen } from '../features/shop/screens/OrderFailedScreen';

import { TimelineScreen } from '../features/health/screens/TimelineScreen';
import { RecordDetailScreen } from '../features/health/screens/RecordDetailScreen';
import { AttachmentPreviewScreen } from '../features/health/screens/AttachmentPreviewScreen';
import { RecordSearchScreen } from '../features/health/screens/RecordSearchScreen';

import { ProfileMainScreen } from '../features/profile/screens/ProfileMainScreen';
import { SettingsScreen } from '../features/profile/screens/SettingsScreen';
import { NotificationsScreen } from '../features/profile/screens/NotificationsScreen';

import { ConnectionIndicator } from '../shared/components/ConnectionIndicator';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const ConsultationStack = createNativeStackNavigator<ConsultationStackParamList>();
const ShopStack = createNativeStackNavigator<ShopStackParamList>();
const HealthRecordsStack = createNativeStackNavigator<HealthRecordsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// ─── Consultation Navigator Wrappers ──────────────────────────────────────────

function ConsultationHomeNavigator({ navigation }: { navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  return (
    <ConsultationHomeScreen
      onDoctorPress={(doctorId) => navigation.navigate('DoctorDetails', { doctorId })}
      onSeeAllDoctors={() => navigation.navigate('DoctorList')}
      onSearchPress={() => navigation.navigate('DoctorSearch')}
      onUpcomingPress={() => navigation.navigate('UpcomingConsultations')}
    />
  );
}

function DoctorListNavigator({ navigation }: { navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  return (
    <DoctorListScreen
      onDoctorPress={(doctorId) => navigation.navigate('DoctorDetails', { doctorId })}
      onBack={() => navigation.goBack()}
    />
  );
}

function DoctorSearchNavigator({ navigation }: { navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  return (
    <DoctorSearchScreen
      onBack={() => navigation.goBack()}
      onDoctorPress={(doctorId) => navigation.navigate('DoctorDetails', { doctorId })}
    />
  );
}

function DoctorDetailsNavigator({ route, navigation }: { route: RouteProp<ConsultationStackParamList, 'DoctorDetails'>; navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  const { doctorId } = route.params;
  return (
    <DoctorDetailsScreen
      doctorId={doctorId}
      onBack={() => navigation.goBack()}
      onProceedToSlotSelection={(id) => navigation.navigate('SlotSelection', { doctorId: id })}
    />
  );
}

function SlotSelectionNavigator({ route, navigation }: { route: RouteProp<ConsultationStackParamList, 'SlotSelection'>; navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  const { doctorId } = route.params;
  const [conflictVisible, setConflictVisible] = React.useState(false);
  const [expiredVisible, setExpiredVisible] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      <SlotSelectionScreen
        doctorId={doctorId}
        onBack={() => navigation.goBack()}
        onContinue={(slot) => navigation.navigate('BookingConfirmation', { doctorId, slotId: slot.id })}
      />
      <BookingConflictModal
        visible={conflictVisible}
        onClose={() => setConflictVisible(false)}
        onChooseAnother={() => { setConflictVisible(false); navigation.goBack(); }}
      />
      <SlotExpiredModal
        visible={expiredVisible}
        onClose={() => setExpiredVisible(false)}
        onChooseAnother={() => { setExpiredVisible(false); navigation.goBack(); }}
      />
    </View>
  );
}

function BookingConfirmationNavigator({ route, navigation }: { route: RouteProp<ConsultationStackParamList, 'BookingConfirmation'>; navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  const { doctorId, slotId } = route.params;
  const [conflictVisible, setConflictVisible] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      <BookingConfirmationScreen
        doctorId={doctorId}
        slot={{
          id: slotId,
          doctorId,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          isBooked: false,
          consultationType: 'video',
        }}
        onBack={() => navigation.goBack()}
        onBookingSuccess={(bookingId) => navigation.navigate('BookingSuccess', { bookingId, doctorId })}
        onConflict={() => setConflictVisible(true)}
      />
      <BookingConflictModal
        visible={conflictVisible}
        onClose={() => setConflictVisible(false)}
        onChooseAnother={() => { setConflictVisible(false); navigation.goBack(); }}
      />
    </View>
  );
}

function BookingSuccessNavigator({ route, navigation }: { route: RouteProp<ConsultationStackParamList, 'BookingSuccess'>; navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  const { bookingId, doctorId } = route.params;
  const { data: doctor } = useDoctor(doctorId);
  const date = new Date();

  return (
    <BookingSuccessScreen
      doctorName={doctor?.name ?? 'Doctor'}
      doctorPhoto={doctor?.photoUrl ?? ''}
      date={date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      time={date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
      duration="30 minutes"
      bookingId={bookingId.slice(0, 16)}
      onViewConsultation={() => navigation.navigate('ConsultationDetails', { bookingId })}
      onBackToHome={() => navigation.goBack()}
    />
  );
}

function UpcomingConsultationsNavigator({ navigation }: { navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  return (
    <UpcomingConsultationsScreen
      onConsultationPress={(bookingId) => navigation.navigate('ConsultationDetails', { bookingId })}
      onBack={() => navigation.goBack()}
    />
  );
}

function ConsultationDetailsNavigator({ route, navigation }: { route: RouteProp<ConsultationStackParamList, 'ConsultationDetails'>; navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  const { bookingId } = route.params;
  const [cancelVisible, setCancelVisible] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ConsultationDetailsScreen
        bookingId={bookingId}
        onBack={() => navigation.goBack()}
        onCancel={() => setCancelVisible(true)}
      />
      <CancelConsultationSheet
        visible={cancelVisible}
        onClose={() => setCancelVisible(false)}
        onConfirmCancel={() => {
          setCancelVisible(false);
          navigation.navigate('CancellationSuccess');
        }}
        doctorName="Doctor"
        consultationDate={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
      />
    </View>
  );
}

function CancellationSuccessNavigator({ navigation }: { navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  return (
    <CancellationSuccessScreen
      onBackToConsultations={() => navigation.goBack()}
    />
  );
}

// ─── Consultation Navigator ───────────────────────────────────────────────────

function ConsultationNavigator(): React.JSX.Element {
  return (
    <ConsultationStack.Navigator screenOptions={{ headerShown: false }}>
      <ConsultationStack.Screen name="ConsultationHome" component={ConsultationHomeNavigator} />
      <ConsultationStack.Screen name="DoctorList" component={DoctorListNavigator} />
      <ConsultationStack.Screen name="DoctorSearch" component={DoctorSearchNavigator} />
      <ConsultationStack.Screen name="DoctorDetails" component={DoctorDetailsNavigator} />
      <ConsultationStack.Screen name="SlotSelection" component={SlotSelectionNavigator} />
      <ConsultationStack.Screen name="BookingConfirmation" component={BookingConfirmationNavigator} />
      <ConsultationStack.Screen name="BookingSuccess" component={BookingSuccessNavigator} />
      <ConsultationStack.Screen name="UpcomingConsultations" component={UpcomingConsultationsNavigator} />
      <ConsultationStack.Screen name="ConsultationDetails" component={ConsultationDetailsNavigator} />
      <ConsultationStack.Screen name="CancellationSuccess" component={CancellationSuccessNavigator} />
    </ConsultationStack.Navigator>
  );
}

// ─── Shop Navigator Wrappers ──────────────────────────────────────────────────

function ShopHomeNavigator({ navigation }: { navigation: NavigationProp<ShopStackParamList> }): React.JSX.Element {
  return (
    <ShopHomeScreen
      navigation={{
        navigate: (screen: string, params?: Record<string, unknown>) =>
          navigation.navigate(screen as keyof ShopStackParamList, params as never),
      } as React.ComponentProps<typeof ShopHomeScreen>['navigation']}
    />
  );
}

function ProductListNavigator({ route, navigation }: { route: RouteProp<ShopStackParamList, 'ProductList'>; navigation: NavigationProp<ShopStackParamList> }): React.JSX.Element {
  const category = (route.params as { category?: string } | undefined)?.category;
  const screenProps = category !== undefined
    ? { params: { category } }
    : undefined;
  return (
    <ProductListScreen
      {...{ route: screenProps, navigation: {
        goBack: () => navigation.goBack(),
        navigate: (screen: string, params?: { productId: string }) =>
          navigation.navigate(screen as keyof ShopStackParamList, params as never),
      }} as React.ComponentProps<typeof ProductListScreen>}
    />
  );
}

function ProductSearchNavigator({ navigation }: { navigation: NavigationProp<ShopStackParamList> }): React.JSX.Element {
  return (
    <ProductSearchScreen
      navigation={{
        goBack: () => navigation.goBack(),
        navigate: (screen: string, params?: { productId: string }) =>
          navigation.navigate(screen as keyof ShopStackParamList, params as never),
      } as React.ComponentProps<typeof ProductSearchScreen>['navigation']}
    />
  );
}

function ProductDetailsNavigator({ route, navigation }: { route: RouteProp<ShopStackParamList, 'ProductDetails'>; navigation: NavigationProp<ShopStackParamList> }): React.JSX.Element {
  return (
    <ProductDetailsScreen
      route={{ params: { productId: route.params.productId } }}
      navigation={{
        goBack: () => navigation.goBack(),
        navigate: (screen: string) =>
          navigation.navigate(screen as never),
      } as React.ComponentProps<typeof ProductDetailsScreen>['navigation']}
    />
  );
}

function WishlistNavigator({ navigation }: { navigation: NavigationProp<ShopStackParamList> }): React.JSX.Element {
  return (
    <WishlistScreen
      navigation={{
        goBack: () => navigation.goBack(),
        navigate: (screen: string, params?: { productId: string }) =>
          navigation.navigate(screen as keyof ShopStackParamList, params as never),
      } as React.ComponentProps<typeof WishlistScreen>['navigation']}
    />
  );
}

function CartNavigator({ navigation }: { navigation: NavigationProp<ShopStackParamList> }): React.JSX.Element {
  return (
    <CartScreen
      navigation={{
        goBack: () => navigation.goBack(),
        navigate: (screen: string) =>
          navigation.navigate(screen as never),
      } as React.ComponentProps<typeof CartScreen>['navigation']}
    />
  );
}

function CheckoutNavigator({ navigation }: { navigation: NavigationProp<ShopStackParamList> }): React.JSX.Element {
  return (
    <CheckoutScreen
      navigation={{
        goBack: () => navigation.goBack(),
        navigate: (screen: string) =>
          navigation.navigate(screen as never),
      } as React.ComponentProps<typeof CheckoutScreen>['navigation']}
    />
  );
}

function OrderSuccessNavigator({ navigation }: { navigation: NavigationProp<ShopStackParamList> }): React.JSX.Element {
  return (
    <OrderSuccessScreen
      navigation={{
        goBack: () => navigation.goBack(),
        navigate: (screen: string) =>
          navigation.navigate(screen as never),
      } as React.ComponentProps<typeof OrderSuccessScreen>['navigation']}
    />
  );
}

function OrderFailedNavigator({ navigation }: { navigation: NavigationProp<ShopStackParamList> }): React.JSX.Element {
  return (
    <OrderFailedScreen
      navigation={{
        goBack: () => navigation.goBack(),
        navigate: (screen: string) =>
          navigation.navigate(screen as never),
      } as React.ComponentProps<typeof OrderFailedScreen>['navigation']}
    />
  );
}

// ─── Shop Navigator ───────────────────────────────────────────────────────────

function ShopNavigator(): React.JSX.Element {
  return (
    <ShopStack.Navigator screenOptions={{ headerShown: false }}>
      <ShopStack.Screen name="ShopHome" component={ShopHomeNavigator} />
      <ShopStack.Screen name="ProductList" component={ProductListNavigator} />
      <ShopStack.Screen name="ProductSearch" component={ProductSearchNavigator} />
      <ShopStack.Screen name="ProductDetails" component={ProductDetailsNavigator} />
      <ShopStack.Screen name="Wishlist" component={WishlistNavigator} />
      <ShopStack.Screen name="Cart" component={CartNavigator} />
      <ShopStack.Screen name="Checkout" component={CheckoutNavigator} />
      <ShopStack.Screen
        name="OrderSuccess"
        component={OrderSuccessNavigator}
        options={{ animation: 'slide_from_bottom' }}
      />
      <ShopStack.Screen
        name="OrderFailed"
        component={OrderFailedNavigator}
        options={{ presentation: 'modal' }}
      />
    </ShopStack.Navigator>
  );
}

// ─── Health Records Navigator ─────────────────────────────────────────────────

function HealthRecordsNavigator(): React.JSX.Element {
  return (
    <HealthRecordsStack.Navigator screenOptions={{ headerShown: false }}>
      <HealthRecordsStack.Screen name="Timeline" component={TimelineScreen} />
      <HealthRecordsStack.Screen name="RecordDetail" component={RecordDetailScreen} />
      <HealthRecordsStack.Screen name="AttachmentPreview" component={AttachmentPreviewScreen} />
      <HealthRecordsStack.Screen name="RecordSearch" component={RecordSearchScreen} />
    </HealthRecordsStack.Navigator>
  );
}

// ─── Profile Navigator ────────────────────────────────────────────────────────

function ProfileNavigator(): React.JSX.Element {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileMainScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
    </ProfileStack.Navigator>
  );
}

// ─── Main Tabs ────────────────────────────────────────────────────────────────

function MainTabs(): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>{'\u2302'}</Text>,
        }}
      />
      <Tab.Screen
        name="Consultations"
        component={ConsultationNavigator}
        options={{
          tabBarLabel: 'Consult',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>{'\u2695'}</Text>,
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopNavigator}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>{'\uD83D\uDECD'}</Text>,
        }}
      />
      <Tab.Screen
        name="HealthRecords"
        component={HealthRecordsNavigator}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>{'\uD83D\uDCCB'}</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>{'\uD83D\uDC64'}</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root Stack ───────────────────────────────────────────────────────────────

export function Navigation(): React.JSX.Element {
  return (
    <NavigationContainer>
      <ConnectionIndicator />
      <RootStack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animation: 'fade' }}
        />
        <RootStack.Screen name="SignIn" component={SignInScreen} />
        <RootStack.Screen name="SignUp" component={SignUpScreen} />
        <RootStack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
