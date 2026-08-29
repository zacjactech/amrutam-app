// Shop Module - Cart Item Component

import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../../../shared/components/AppText';
import { CartItem as CartItemType, Product } from '../types';
import { Button } from '../../../shared/components/Button';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface CartItemProps {
  cartItem: CartItemType;
  product: Product;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItemComponent = memo(function CartItemComponent({ cartItem, product, onUpdateQuantity, onRemove }: CartItemProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md, marginHorizontal: spacing.lg, marginVertical: spacing.sm }]}>
      <Image
        source={{ uri: product.imageUrl }}
        style={[styles.image, { backgroundColor: colors.background.secondary }]}
        contentFit="cover"
      />
      <View style={styles.info}>
        <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }} numberOfLines={2}>
          {product.name}
        </AppText>
        <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
          ₹{cartItem.unitPrice.toLocaleString('en-IN')}
        </AppText>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.background.secondary, width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }]}
            onPress={() => onUpdateQuantity(cartItem.productId, cartItem.quantity - 1)}
            accessibilityLabel="Decrease quantity"
            accessibilityRole="button"
          >
            <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }}>-</AppText>
          </TouchableOpacity>
          <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600', minWidth: 24, textAlign: 'center' }}>
            {cartItem.quantity}
          </AppText>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.background.secondary, width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }]}
            onPress={() => onUpdateQuantity(cartItem.productId, cartItem.quantity + 1)}
            accessibilityLabel="Increase quantity"
            accessibilityRole="button"
          >
            <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }}>+</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actions}>
        <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '700' }}>
          ₹{(cartItem.quantity * cartItem.unitPrice).toLocaleString('en-IN')}
        </AppText>
        <Button
          title="Remove"
          variant="ghost"
          size="small"
          onPress={() => onRemove(cartItem.productId)}
          style={{ marginTop: 8 }}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {},
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 8,
  },
});
