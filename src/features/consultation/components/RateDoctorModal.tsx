// Consultation Module - Rate Doctor Modal

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { BottomSheet } from '../../../shared/components/BottomSheet';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { useSubmitReview, useBookingReview } from '../hooks';
import { useToast } from '../../../shared/components/Toast';

interface RateDoctorModalProps {
  visible: boolean;
  onClose: () => void;
  bookingId: string;
  doctorId: string;
  doctorName: string;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export function RateDoctorModal({
  visible,
  onClose,
  bookingId,
  doctorId,
  doctorName,
}: RateDoctorModalProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: existingReview } = useBookingReview(bookingId);
  const submitReview = useSubmitReview();

  const isEditing = existingReview !== null && existingReview !== undefined;
  const isSubmitting = submitReview.isPending;

  const handleSubmit = useCallback(async () => {
    if (rating === 0) {
      showToast('Please select a rating', 'warning');
      return;
    }

    try {
      const reviewData: { bookingId: string; doctorId: string; rating: number; comment?: string } = {
        bookingId,
        doctorId,
        rating,
      };
      if (comment.trim().length > 0) {
        reviewData.comment = comment.trim();
      }
      await submitReview.mutateAsync(reviewData);

      showToast(
        isEditing ? 'Review updated successfully' : 'Thank you for your review!',
        'success',
      );

      // Reset and close
      setRating(0);
      setComment('');
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit review';
      showToast(message, 'error');
    }
  }, [rating, comment, bookingId, doctorId, submitReview, showToast, isEditing, onClose]);

  const handleClose = useCallback(() => {
    setRating(isEditing && existingReview ? existingReview.rating : 0);
    setComment(isEditing && existingReview ? (existingReview.comment ?? '') : '');
    onClose();
  }, [isEditing, existingReview, onClose]);

  // Pre-fill when editing
  React.useEffect(() => {
    if (visible && isEditing && existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment ?? '');
    } else if (visible && !isEditing) {
      setRating(0);
      setComment('');
    }
  }, [visible, isEditing, existingReview]);

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={isEditing ? 'Edit Review' : 'Rate Doctor'}
      bottomAction={
        <View style={styles.bottomActions}>
          <Button
            title="Cancel"
            variant="outline"
            size="medium"
            onPress={handleClose}
            style={{ flex: 1 }}
            disabled={isSubmitting}
          />
          <Button
            title={isSubmitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
            variant="primary"
            size="medium"
            onPress={handleSubmit}
            style={{ flex: 1 }}
            disabled={isSubmitting || rating === 0}
            loading={isSubmitting}
          />
        </View>
      }
    >
      <View style={styles.content}>
        {/* Doctor name */}
        <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.lg }}>
          How was your consultation with {doctorName}?
        </AppText>

        {/* Star Rating */}
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
              style={[styles.starButton, { padding: spacing.xs }]}
              accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
              accessibilityRole="button"
              accessibilityState={{ selected: star <= rating }}
            >
              <AppText
                variant="h1"
                style={{
                  color: star <= rating ? colors.rating : colors.text.disabled,
                  fontSize: 36,
                }}
              >
                ★
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rating Label */}
        {rating > 0 && (
          <AppText
            variant="body"
            style={{ color: colors.action.primary, textAlign: 'center', fontWeight: '600', marginTop: spacing.xs }}
          >
            {RATING_LABELS[rating]}
          </AppText>
        )}

        {/* Comment Input */}
        <View style={[styles.commentContainer, { marginTop: spacing.xl }]}>
          <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            ADD A COMMENT (OPTIONAL)
          </AppText>
          <TextInput
            style={[
              styles.commentInput,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.default,
                color: colors.text.primary,
                borderRadius: spacing.sm,
              },
            ]}
            placeholder="Tell others about your experience..."
            placeholderTextColor={colors.text.tertiary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <AppText variant="caption" style={{ color: colors.text.tertiary, textAlign: 'right', marginTop: spacing.xs }}>
            {comment.length}/500
          </AppText>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  starButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentContainer: {
    width: '100%',
  },
  commentInput: {
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 100,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
