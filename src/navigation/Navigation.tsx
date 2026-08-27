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
} from './types';
import type { RouteProp, NavigationProp } from '@react-navigation/native';
import { useThemeColors } from '../shared/components/ThemeProvider';

import { DoctorListScreen } from '../features/consultation/screens/DoctorListScreen';
import { DoctorDetailsScreen } from '../features/consultation/screens/DoctorDetailsScreen';
import { BookingConfirmationScreen } from '../features/consultation/screens/BookingConfirmationScreen';
import { UpcomingConsultationsScreen } from '../features/consultation/screens/UpcomingConsultationsScreen';
import { ProductListScreen } from '../features/shop/screens/ProductListScreen';
import { ProductDetailsScreen } from '../features/shop/screens/ProductDetailsScreen';
import { CartScreen } from '../features/shop/screens/CartScreen';
import { CheckoutScreen } from '../features/shop/screens/CheckoutScreen';
import { WishlistScreen } from '../features/shop/screens/WishlistScreen';
import { TimelineScreen } from '../features/health/screens/TimelineScreen';
import { RecordDetailsScreen } from '../features/health/screens/RecordDetailsScreen';
import { AttachmentPreviewScreen } from '../features/health/screens/AttachmentPreviewScreen';
import { ConnectionIndicator } from '../shared/components/ConnectionIndicator';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const ConsultationStack = createNativeStackNavigator<ConsultationStackParamList>();
const ShopStack = createNativeStackNavigator<ShopStackParamList>();
const HealthRecordsStack = createNativeStackNavigator<HealthRecordsStackParamList>();

function DoctorDetailsNavigator({ route, navigation }: { route: RouteProp<ConsultationStackParamList, 'DoctorDetails'>; navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  const { doctorId } = route.params;
  return (
    <DoctorDetailsScreen
      doctorId={doctorId}
      onBack={() => navigation.goBack()}
      onBookingSuccess={() => navigation.goBack()}
    />
  );
}

function BookingConfirmationNavigator({ route, navigation }: { route: RouteProp<ConsultationStackParamList, 'BookingConfirmation'>; navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  const { bookingId } = route.params;
  return (
    <BookingConfirmationScreen
      booking={{ id: bookingId, doctorId: '', patientId: '', slotId: '', consultationType: 'video', status: 'pending_confirmation', createdAt: new Date().toISOString() } as any}
      doctor={{ id: '', name: '', specialty: '', experience: 0, rating: 0, fee: 0, availability: [], bio: '', imageUrl: '' } as any}
      onDone={() => navigation.goBack()}
      onViewConsultations={() => navigation.goBack()}
    />
  );
}

function UpcomingConsultationsNavigator({ navigation }: { navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  return (
    <UpcomingConsultationsScreen
      onConsultationPress={(bookingId: string) => navigation.navigate('ConsultationDetails', { bookingId })}
    />
  );
}

function DoctorListNavigator({ navigation }: { navigation: NavigationProp<ConsultationStackParamList> }): React.JSX.Element {
  return (
    <DoctorListScreen
      onDoctorPress={(doctorId: string) => navigation.navigate('DoctorDetails', { doctorId })}
      onFilterPress={() => {}}
    />
  );
}

function ConsultationNavigator(): React.JSX.Element {
  return (
    <ConsultationStack.Navigator screenOptions={{ headerShown: false }}>
      <ConsultationStack.Screen name="DoctorList" component={DoctorListNavigator} />
      <ConsultationStack.Screen name="DoctorDetails" component={DoctorDetailsNavigator} />
      <ConsultationStack.Screen name="SlotPicker" component={PlaceholderScreen} />
      <ConsultationStack.Screen name="BookingConfirmation" component={BookingConfirmationNavigator} />
      <ConsultationStack.Screen name="UpcomingConsultations" component={UpcomingConsultationsNavigator} />
      <ConsultationStack.Screen name="ConsultationDetails" component={PlaceholderScreen} />
    </ConsultationStack.Navigator>
  );
}

function ShopNavigator(): React.JSX.Element {
  return (
    <ShopStack.Navigator screenOptions={{ headerShown: false }}>
      <ShopStack.Screen name="ProductList" component={ProductListScreen} />
      <ShopStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <ShopStack.Screen name="Cart" component={CartScreen} />
      <ShopStack.Screen name="Checkout" component={CheckoutScreen} />
      <ShopStack.Screen name="Wishlist" component={WishlistScreen} />
    </ShopStack.Navigator>
  );
}

function RecordDetailsNavigator(route: any): React.JSX.Element {
  const navigation = route.navigation;
  return <RecordDetailsScreen route={route.route} navigation={navigation} />;
}

function AttachmentPreviewNavigator(route: any): React.JSX.Element {
  const navigation = route.navigation;
  return <AttachmentPreviewScreen route={route.route} navigation={navigation} />;
}

function HealthRecordsNavigator(): React.JSX.Element {
  return (
    <HealthRecordsStack.Navigator screenOptions={{ headerShown: false }}>
      <HealthRecordsStack.Screen name="Timeline" component={TimelineScreen} />
      <HealthRecordsStack.Screen name="RecordDetails" component={RecordDetailsNavigator} />
      <HealthRecordsStack.Screen name="AttachmentPreview" component={AttachmentPreviewNavigator} />
    </HealthRecordsStack.Navigator>
  );
}

function MainTabs(): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.action.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={PlaceholderScreen}
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
          tabBarLabel: 'Health',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>{'\u2665'}</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function PlaceholderScreen(): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <View style={styles.placeholderContainer}>
      <Text style={[styles.placeholderText, { color: colors.text.secondary }]}>Coming Soon</Text>
    </View>
  );
}

export function Navigation(): React.JSX.Element {
  return (
    <NavigationContainer>
      <ConnectionIndicator />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen name="DoctorDetails" component={DoctorDetailsNavigator} />
        <RootStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <RootStack.Screen name="BookingConfirmation" component={BookingConfirmationNavigator} />
        <RootStack.Screen name="ConsultationDetails" component={PlaceholderScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E0E0E0',
  },
  tabIcon: {
    fontSize: 20,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
