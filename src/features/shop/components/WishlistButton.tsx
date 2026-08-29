// Shop Module - Wishlist Button Component

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useWishlist } from '../hooks';
import { useThemeColors } from '../../../shared/components/ThemeProvider';

interface WishlistButtonProps {
  productId: string;
  size?: number;
}

export function WishlistButton({ productId, size = 24 }: WishlistButtonProps) {
  const colors = useThemeColors();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const handlePress = () => {
    void toggleWishlist.mutate({ productId, isAdded: inWishlist });
  };

  return (
    <TouchableOpacity onPress={handlePress} hitSlop={8} accessibilityLabel={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'} accessibilityRole="button" accessibilityState={{ selected: inWishlist }}>
      <Text style={{ fontSize: size, color: inWishlist ? colors.status.error : colors.text.disabled }}>
        {inWishlist ? '♥' : '♡'}
      </Text>
    </TouchableOpacity>
  );
}
